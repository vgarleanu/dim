import { useCallback, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { MediaPlayer } from "dashjs";

import { setTracks, setGID, setManifestState, updateVideo, incIdleCount, clearVideoData } from "../../actions/video";
import { VideoPlayerContext } from "./Context";
import VideoEvents from "./Events";
import VideoMediaData from "./MediaData";

import RingLoad from "../../Components/Load/Ring";
import Menus from "./Menus";
import VideoControls from "./Controls/Index";
import ErrorBox from "./ErrorBox";
import ContinueProgress from "./ContinueProgress";
import VideoSubtitles from "./Subtitles";

import "./Index.scss";

function VideoPlayer() {
  const params = useParams();
  const dispatch = useDispatch();

  const { error, manifest, player, audioTracks, videoTracks, video, auth, media_info, extra_media_info } = useSelector(store => ({
    auth: store.auth,
    media_info: store.card.media_info,
    extra_media_info: store.card.extra_media_info,
    video: store.video,
    player: store.video.player,
    manifest: store.video.manifest,
    videoTracks: store.video.tracks.video,
    audioTracks: store.video.tracks.audio,
    error: store.video.error
  }));

  const videoPlayer = useRef(null);
  const overlay = useRef(null);
  const videoRef = useRef(null);

  const { token } = auth;

  useEffect(() => {
    if (video.gid) return;

    const host = (
      `/api/v1/stream/${params.fileID}/manifest`
    );

    (async () => {
      const config = {
        headers: {
          "authorization": token
        }
      };

      const res = await fetch(host, config);
      const payload = await res.json();

      dispatch(setGID(payload.gid));

      const tVideos = payload.tracks.filter(track => track.content_type === "video");
      const tAudios = payload.tracks.filter(track => track.content_type === "audio");
      const tSubtitles = payload.tracks.filter(track => track.content_type === "subtitle");

      dispatch(setTracks({
        video: tVideos,
        audio: tAudios,
        subtitle: tSubtitles
      }));

      dispatch(setManifestState({
        virtual: { loaded: true }
      }));
    })();
  }, [dispatch, params.fileID, token, video.gid]);

  useEffect(() => {
    document.title = "Dim - Video Player";

    if (media_info.info.name) {
      document.title = `Dim - Playing '${media_info.info.name}'`;
    }
  }, [media_info.info.name]);

  useEffect(() => {
    if (!video.gid || !manifest.virtual.loaded) return;

    dispatch(setManifestState({
      loading: true,
      loaded: false
    }));

    const includes = `${videoTracks.list[videoTracks.current].id},${audioTracks.list[audioTracks.current].id}`;
    const url = `/api/v1/stream/${video.gid}/manifest.mpd?start_num=0&should_kill=false&includes=${includes}`;
    const mediaPlayer = MediaPlayer().create();

    // even with these settings, high bitrate movies fail.
    // The only solution is to have a constant bitrate and cosistent segments.
    // Thus transcoding is the only solution.
    let settings = {
      streaming: {
        stableBufferTime: 20,
        bufferToKeep: 10,
        bufferTimeAtTopQuality: 20,
        bufferTimeAtTopQualityLongForm: 20,
        useAppendWindow: true,
        bufferPruningInterval: 10,
        smallGapLimit: 1000
      }
    };

    mediaPlayer.updateSettings(settings);

    mediaPlayer.extend("RequestModifier", function () {
      return {
        modifyRequestHeader: function (xhr) {
          xhr.setRequestHeader("Authorization", auth.token);
          return xhr;
        },
        modifyRequestURL: function (url) {
          return url;
        }
      };
    });

    mediaPlayer.initialize(videoRef.current, url, true);

    dispatch(updateVideo({
      player: mediaPlayer
    }));

    return () => {
      dispatch(clearVideoData());
      mediaPlayer.destroy();

      if (!video.gid) return;

      (async () => {
        await fetch(`/api/v1/stream/${video.gid}/state/kill`);
        sessionStorage.clear();
      })();
    };
  }, [audioTracks, auth.token, dispatch, manifest.virtual.loaded, video.gid, videoTracks]);

  const seekTo = useCallback(async newTime => {
    player.seek(newTime);
    dispatch(updateVideo({
      seeking: false
    }));
  }, [audioTracks, dispatch, player, video.gid, videoTracks]);

  useEffect(() => {
    if (video.showSubSwitcher) return;
    dispatch(incIdleCount());
  }, [video.currentTime, dispatch, video.showSubSwitcher]);

  const initialValue = {
    videoRef,
    videoPlayer,
    overlay: overlay.current,
    seekTo
  };

  return (
    <VideoPlayerContext.Provider value={initialValue}>
      <div className="videoPlayer" ref={videoPlayer}>
        <VideoEvents/>
        <VideoMediaData/>
        <video ref={videoRef}/>
        <VideoSubtitles/>
        <div className="overlay" ref={overlay}>
          {(!error && (manifest.loaded && video.canPlay && video.showSubSwitcher)) && <Menus/>}
          {(!error && (manifest.loaded && video.canPlay)) && <VideoControls/>}
          {(!error & (manifest.loading || !video.canPlay) || video.waiting) && <RingLoad/>}
          {((!error && (manifest.loaded && video.canPlay)) && extra_media_info.info.progress > 0) && (
            <ContinueProgress/>
          )}
          {error && <ErrorBox/>}
        </div>
      </div>
    </VideoPlayerContext.Provider>
  );
}

export default VideoPlayer;
