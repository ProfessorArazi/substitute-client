import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import Modal from "../../Components/UI/Modal";
import { LoginAndSignup } from "../Users/LoginAndSignup";
import WorksContext from "../../store/works-context";

export const Sidebar = () => {
  const ctx = useContext(WorksContext);
  const [showModal, setShowModal] = useState(false);
  const { type, updateType, updateAllWorks } = ctx;

  return (
    <>
      <nav id="sidebar" className="sidebar">
        {type === "sub" && <Link to="/">עבודות זמינות</Link>}
        {type !== "guest" ? (
          <>
            <Link to="/account">החשבון שלי</Link>
            <Link to="/profile">ערוך פרופיל</Link>
            <Link to="/works">העבודות שלי</Link>

            <Nav.Link
              onClick={() => {
                sessionStorage.clear();
                updateType("guest");
                updateAllWorks([]);
              }}
            >
              התנתק
            </Nav.Link>
          </>
        ) : (
          <>
            <Nav.Link
              onClick={() =>
                setShowModal(
                  <LoginAndSignup onClose={() => setShowModal(false)} />
                )
              }
            >
              התחבר
            </Nav.Link>
            <Nav.Link
              onClick={() =>
                setShowModal(
                  <LoginAndSignup signup onClose={() => setShowModal(false)} />
                )
              }
            >
              הרשמה
            </Nav.Link>
          </>
        )}
      </nav>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>{showModal}</Modal>
      )}
    </>
  );
};
