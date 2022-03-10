import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import Modal from "../../Components/UI/Modal";
import { LoginAndSignup } from "../Users/LoginAndSignup";
import WorksContext from "../../store/works-context";
import ReactStars from "react-rating-stars-component";
import { ImageForm } from "../../Components/Forms/ImageForm";
import { Details } from "../../Components/Details/Details";

export const Sidebar = () => {
  const ctx = useContext(WorksContext);
  const [showModal, setShowModal] = useState(false);
  const { type, updateType, updateAllWorks } = ctx;

  const user =
    type !== "guest" && JSON.parse(sessionStorage.getItem("user"))[type];

  return (
    <>
      <nav id="sidebar" className="sidebar">
        {type !== "guest" && (
          <img
            onClick={() =>
              setShowModal(<ImageForm onClose={() => setShowModal(false)} />)
            }
            src={
              user.img
                ? user.img
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/2048px-User_font_awesome.svg.png"
            }
            alt="user"
            className="user-img"
          />
        )}

        {type === "sub" && (
          <>
            <ReactStars
              classNames="stars"
              count={5}
              size={24}
              value={JSON.parse(sessionStorage.getItem("user")).sub.grade.grade}
              edit={false}
              isHalf={true}
            />
            <Link to="/">עבודות זמינות</Link>
          </>
        )}
        {type !== "guest" ? (
          <>
            <Nav.Link
              onClick={() =>
                setShowModal(
                  <Details
                    img={user.img}
                    name={user.name}
                    phone={user.phone}
                    grade={type === "sub" && user.grade.grade}
                    votes={type === "sub" && user.grade.votes}
                    onClose={() => setShowModal(false)}
                  />
                )
              }
            >
              החשבון שלי
            </Nav.Link>
            <Link to="/profile">ערוך פרופיל</Link>
            <Link to="/works">העבודות שלי</Link>

            <Nav.Link
              onClick={() => {
                updateType("guest");
                sessionStorage.clear();
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
