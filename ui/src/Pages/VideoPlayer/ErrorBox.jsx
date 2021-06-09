import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateVideo } from "../../actions/video";

function ErrorBox() {
  const dispatch = useDispatch();

  const { video, error } = useSelector(store => ({
    video: store.video,
    error: store.video.error
  }));

  const hide = useCallback(() => {
    dispatch(updateVideo({
      error: null
    }));
  }, [dispatch]);

  const reloadPlayer = () => {
    sessionStorage.setItem("currentTime", video.currentTime);
    window.location.reload();
  };

  console.log("[VIDEO] error", error);

  return (
    <div className="errorBox">
      <h2>Error</h2>
      <div className="separator"/>
      <p>{error.msg}</p>
      {error.errors.map((err, i) => (
        <details key={i}>
          <summary>({++i})</summary>
          <div className="stderr">
            <code>{err}</code>
          </div>
        </details>
      ))}
      <div className="options">
        <button onClick={hide}>Hide</button>
        <button onClick={reloadPlayer}>Retry</button>
      </div>
    </div>
  );
}

export default ErrorBox;
