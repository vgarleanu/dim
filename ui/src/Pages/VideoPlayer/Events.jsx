import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MediaPlayer } from "dashjs";

import { setManifestState, updateVideo } from "../../actions/video";

function VideoEvents() {
  const dispatch = useDispatch();

  const { video, player } = useSelector(store => ({
    video: store.video,
    player: store.video.player
  }));

  const eManifestLoad = useCallback(() => {
    console.log("[VIDEO] manifest loaded");

    dispatch(setManifestState({
      loading: false,
      loaded: true
    }));
  }, [dispatch]);

  const eCanPlay = useCallback(() => {
    console.log("[VIDEO] can play");

    dispatch(updateVideo({
      canPlay: true,
      waiting: false,
      duration: Math.round(player.duration()) | 0
    }));
  }, [dispatch, player]);

  const ePlayBackPaused = useCallback(() => {
    console.log("[VIDEO] paused");

    dispatch(updateVideo({
      paused: true
    }));
  }, [dispatch]);

  const ePlayBackPlaying = useCallback(() => {
    dispatch(updateVideo({
      paused: false
    }));
  }, [dispatch]);

  const ePlayBackWaiting = useCallback(() => {
    console.log("[VIDEO] playback waiting");

    dispatch(updateVideo({
      waiting: true
    }));
  }, [dispatch]);

  const ePlayBackEnded = useCallback(e => {
    console.log("[VIDEO] playback ended", e);
  }, []);

  const eError = useCallback(e => {
    // segment not available
    if (e.error.code === 27) {
      console.log("[VIDEO] segment not available", e.error.message);
      return;
    }

    (async () => {
      console.log("[VIDEO] fetching stderr");
      const res = await fetch(`/api/v1/stream/${video.gid}/state/get_stderr`);
      const error = await res.json();

      dispatch(updateVideo({
        error: {
          msg: e.error.message,
          errors: error.errors
        }
      }));
    })();
  }, [dispatch, video.gid]);

  const ePlayBackNotAllowed = useCallback(e => {
    console.log("[VIDEO] playback not allowed");

    if (e.type === "playbackNotAllowed") {
      dispatch(updateVideo({
        paused: true
      }));
    }
  }, [dispatch]);

  /*
    PLAYBACK_PROGRESS event stops after error occurs
    so using this event from now on to get buffer length
  */
  const ePlayBackTimeUpdated = useCallback(e => {
    /*
      on some browsers (*cough*, chrome) current
      time gets reset back to 0 on seek
    */
    let newTime = Math.floor(e.time);

    if (newTime < video.prevSeekTo) {
      newTime += video.prevSeekTo - newTime;
    }

    dispatch(updateVideo({
      currentTime: newTime,
      buffer: Math.round(player.getBufferLength())
    }));
  }, [dispatch, player, video.prevSeekTo]);

  // other events
  useEffect(() => {
    if (!player) return;

    player.on(MediaPlayer.events.MANIFEST_LOADED, eManifestLoad);
    player.on(MediaPlayer.events.CAN_PLAY, eCanPlay);
    player.on(MediaPlayer.events.ERROR, eError);

    return () => {
      player.off(MediaPlayer.events.MANIFEST_LOADED, eManifestLoad);
      player.off(MediaPlayer.events.CAN_PLAY, eCanPlay);
      player.off(MediaPlayer.events.ERROR, eError);
    };
  }, [eCanPlay, eError, eManifestLoad, player]);

  // video playback
  useEffect(() => {
    if (!player) return;

    player.on(MediaPlayer.events.PLAYBACK_PAUSED, ePlayBackPaused);
    player.on(MediaPlayer.events.PLAYBACK_PLAYING, ePlayBackPlaying);
    player.on(MediaPlayer.events.PLAYBACK_WAITING, ePlayBackWaiting);
    player.on(MediaPlayer.events.PLAYBACK_TIME_UPDATED, ePlayBackTimeUpdated);
    player.on(MediaPlayer.events.PLAYBACK_NOT_ALLOWED, ePlayBackNotAllowed);
    player.on(MediaPlayer.events.PLAYBACK_ENDED, ePlayBackEnded);

    return () => {
      player.off(MediaPlayer.events.PLAYBACK_PAUSED, ePlayBackPaused);
      player.off(MediaPlayer.events.PLAYBACK_PLAYING, ePlayBackPlaying);
      player.off(MediaPlayer.events.PLAYBACK_WAITING, ePlayBackWaiting);
      player.off(MediaPlayer.events.PLAYBACK_TIME_UPDATED, ePlayBackTimeUpdated);
      player.off(MediaPlayer.events.PLAYBACK_NOT_ALLOWED, ePlayBackNotAllowed);
      player.off(MediaPlayer.events.PLAYBACK_ENDED, ePlayBackEnded);
    };
  }, [ePlayBackEnded, ePlayBackNotAllowed, ePlayBackPaused, ePlayBackPlaying, ePlayBackTimeUpdated, ePlayBackWaiting, player]);

  return null;
}

export default VideoEvents;
