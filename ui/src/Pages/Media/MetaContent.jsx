import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { clearMediaInfo, fetchMediaInfo } from "../../actions/card.js";
import PlayButton from "../../Components/PlayButton.jsx";
import CircleIcon from "../../assets/Icons/Circle";

import "./MetaContent.scss";

function MetaContent() {
  const dispatch = useDispatch();

  const { auth, media_info } = useSelector(store => ({
    auth: store.auth,
    media_info: store.card.media_info
  }));

  const { id } = useParams();

  const [mediaVersions, setMediaVersions] = useState([]);

  useEffect(() => {
    dispatch(fetchMediaInfo(id));
    return () => dispatch(clearMediaInfo());
  }, [dispatch, id]);

  const { token } = auth;

  // to get file versions
  useEffect(() => {
    // note: quickly coded
    (async () => {
      const config = {
        headers: {
          "authorization": token
        }
      };

      const res = await fetch(`/api/v1/media/${id}/info`, config);

      if (res.status !== 200) return;

      const payload = await res.json();

      if (payload.error) return;

      if (payload.seasons) {
        setMediaVersions(
          payload.seasons[0].episodes[0].versions
        );
      } else {
        setMediaVersions(payload.versions);
      }
    })();
  }, [id, token]);

  useEffect(() => {
    const { fetched, error, info } = media_info;

    // FETCH_MEDIA_INFO_OK
    if (fetched && !error) {
      document.title = `Dim - ${info.name}`;
    }
  }, [media_info]);

  let metaContent = <></>;

  // FETCH_MEDIA_INFO_OK
  if (media_info.fetched && !media_info.error) {
    const {
      description,
      genres,
      name,
      duration,
      rating,
      year,
      media_type,
      id,
      seasons
    } = media_info.info;

    const length = {
      hh: ("0" + Math.floor(duration / 3600)).slice(-2),
      mm: ("0" + Math.floor((duration % 3600) / 60)).slice(-2),
      ss: ("0" + Math.floor((duration % 3600) % 60)).slice(-2)
    };

    metaContent = (
      <div className="metaContent">
        <h1>{name}</h1>
        <div className="genres">
          <Link to={`/search?year=${year}`}>{year}</Link>
          {genres.length > 0 && (
            <CircleIcon/>
          )}
          {genres &&
            genres.map((genre, i) => <Link to={`/search?genre=${genre}`} key={i}>{genre}</Link>)
          }
        </div>
        <p className="description">{description}</p>
        <div className="meta-info">
          <div className="info">
            <h4>ID</h4>
            <p>{id}</p>
          </div>
          <div className="info">
            <h4>Type</h4>
            <p>{media_type}</p>
          </div>
          {!seasons && (
            <div className="info">
              <h4>Duration</h4>
              <p>{length.hh}:{length.mm}:{length.ss}</p>
            </div>
          )}
          {seasons && (
            <div className="info">
              <h4>Seasons</h4>
              <p>{seasons}</p>
            </div>
          )}
          <div className="info">
            <h4>Rating</h4>
            <p>{rating}/10</p>
          </div>
        </div>
        {media_type !== "tv" && (
          <PlayButton mediaID={id} versions={mediaVersions}/>
        )}
      </div>
    );
  }

  return metaContent;
}

export default MetaContent;
