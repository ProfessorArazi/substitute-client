import ReactDOM from "react-dom";
import "../../scss/App.scss";
import { IconContext } from "react-icons";
import { IoCloseOutline } from "react-icons/io5";

const Backdrop = (props) => {
  return <div className="backdrop" onClick={props.onClose} />;
};

const ModalOverlay = (props) => {
  return (
    <div className="modal-overlay">
      <IconContext.Provider value={{ className: "close-btn" }}>
        <IoCloseOutline onClick={props.onClose} />
      </IconContext.Provider>
      <div className="content">{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById("overlays");

const Modal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onClose={props.onClose} />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay onClose={props.onClose} background={props.background}>
          {props.children}
        </ModalOverlay>,
        portalElement
      )}
    </>
  );
};

export default Modal;
