import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchDirectories } from "../../actions/fileBrowser.js";
import FolderIcon from "../../assets/Icons/Folder";
import ArrowLeftIcon from "../../assets/Icons/ArrowLeft";

import "./DirSelection.scss";

function DirSelection(props) {
  const dispatch = useDispatch();
  const fileBrowser = useSelector(store => store.fileBrowser);

  const { current, setCurrent } = props;

  const select = useCallback(path => {
    dispatch(fetchDirectories(path));
    setCurrent(path);
  }, [dispatch, setCurrent]);

  useEffect(() => {
    const path = "";

    dispatch(fetchDirectories(path));
    setCurrent(path);
  }, [dispatch, setCurrent]);

  const goBack = useCallback(() => {
    if (current.length === 0) return;

    const path = current.split("/");

    path.pop();
    select(path.join("/"));
  }, [current, select]);

  let dirs;

  // FETCH_DIRECTORIES_ERR
  if (fileBrowser.fetched && fileBrowser.error) {
    dirs = (
      <div className="vertical-err">
        <p>Cannot load data</p>
      </div>
    );
  }

  // FETCH_DIRECTORIES_OK
  if (fileBrowser.fetched && !fileBrowser.error) {
    const { items } = fileBrowser;

    if (items.length === 0) {
      dirs = (
        <div className="vertical-err">
          <p>Empty</p>
        </div>
      );
    } else {
      dirs = items.map((dir, i) => {
        return (
          <div key={i} onClick={() => select(dir)} className="dir">
            <FolderIcon/>
            <p>{dir.replace(props.current, "").replace("/", "")}</p>
          </div>
        );
      });
    }
  }

  return (
    <div className="dirSelection">
      <h3>Select folder</h3>
      <div className="dirs-wrapper">
        <div className="dirs">
          {dirs}
        </div>
      </div>
      <div className="controls">
        <button onClick={goBack} className={`disable-${props.current === ""}`}>
          <ArrowLeftIcon/>
        </button>
        <h4>Selected: <span>{props.current}</span></h4>
      </div>
    </div>
  );
}

export default DirSelection;
