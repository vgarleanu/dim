import { Link } from "react-router-dom";
import ModalBox from "./Index";

import FileVideoIcon from "../assets/Icons/FileVideo";

import "./SelectMediaVersion.scss";

const SelectMediaVersion = (props) => (
  <ModalBox id="modalSelectMediaVersion" activatingComponent={props.children}>
    {closeModal => (
      <div className="modalSelectMediaVersion">
        <h3>Select file version</h3>
        <div className="separator"/>
        <div className="fileVersionsWrapper">
          <div className="fileVersions">
            {props.versions.map((version, i) => (
              <Link to={`/play/${version.id}`} className="fileVersion" key={i}>
                <FileVideoIcon/>
                <p>{version.display_name}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="options">
          <button onClick={closeModal}>Nevermind</button>
        </div>
      </div>
    )}
  </ModalBox>
);

export default SelectMediaVersion;
