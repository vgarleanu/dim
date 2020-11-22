import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { newLibrary } from "../../../actions/library.js";
import MediaTypeSelection from "./MediaTypeSelection.jsx";
import DirSelection from "./DirSelection.jsx";

import "./Index.scss";

Modal.setAppElement("body");

// ! UPDATE this.state.root ON componentDidMount WITH /api/v1/filebrowser/
function NewLibraryModal(props) {
  const nameInput = useRef(null);

  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState("");
  const [name, setName] = useState("");
  const [mediaType, setMediaType] = useState("movie");

  // prevent scrolling behind Modal
  useEffect(() => {
    visible
      ? document.body.style.overflow = 'hidden'
      : document.body.style.overflow = 'unset';
  }, [visible]);

  useEffect(() => {
    if (nameInput.current) {
      nameInput.current.style.border = "solid 2px transparent";
    }
  }, [name]);

  const open = useCallback(() => {
    setVisible(true);
  }, []);

  useEffect(open, []);

  const close = useCallback(() => {
    setVisible(false);
    setName("");
    setCurrent("");
  }, []);

  const add = useCallback(async () => {
    if (!name) {
      nameInput.current.style.border = "solid 2px #ff6961";
    }

    if (name) {
      const data = {
        name,
        location: current,
        media_type: mediaType
      };

      await props.newLibrary(props.auth.token, data);
      close();
    }
  }, [name, mediaType, current]);

  return (
    <Fragment>
      <button className="openNewLibrary" onClick={open}>
        +
      </button>
      <Modal
        isOpen={visible}
        contentLabel="newLibrary"
        className="newLibraryPopup"
        onRequestClose={close}
        overlayClassName="popupOverlay"
      >
        <div className="heading">
          <h2>Add a new library</h2>
          <div className="separator"/>
        </div>
        <div className="fields">
          <div className="field">
            <h3>Name</h3>
            <input
              ref={nameInput}
              onChange={e => setName(e.target.value)}
              type="text"
              placeholder="Untitled"
              value={name}
            />
          </div>
          <MediaTypeSelection
            mediaType={mediaType}
            setMediaType={setMediaType}
          />
        </div>
        {visible && (
          <DirSelection
            current={current}
            setCurrent={setCurrent}
          />
        )}
        <div className="options">
          <button onClick={close}>Nevermind</button>
          <button onClick={add}>Add library</button>
        </div>
      </Modal>
    </Fragment>
  )
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

const mapActionsToProps = {
  newLibrary
};

export default connect(mapStateToProps, mapActionsToProps)(NewLibraryModal);