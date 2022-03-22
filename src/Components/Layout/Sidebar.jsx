import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import Modal from "../../Components/UI/Modal";
import { UserForm } from "../../Components/Forms/UserForm";
import WorksContext from "../../store/works-context";
import ReactStars from "react-rating-stars-component";
import { ImageForm } from "../../Components/Forms/ImageForm";
import { Details } from "../../Components/Details/Details";

export const Sidebar = () => {
  const ctx = useContext(WorksContext);
  const [showModal, setShowModal] = useState(false);
  const { type, updateType, updateAllWorks } = ctx;

  const user = type !== "guest" && JSON.parse(sessionStorage.getItem("user"));

  return (
    <>
      <nav id="sidebar" className="sidebar">
        {type !== "guest" && (
          <img
            onClick={() =>
              setShowModal(<ImageForm onClose={() => setShowModal(false)} />)
            }
            src={
              user[type].img
                ? user[type].img
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
              value={user.sub.grade.grade}
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
                    img={user[type].img}
                    name={user[type].name}
                    phone={user[type].phone}
                    grade={type === "sub" && user[type].grade.grade}
                    votes={type === "sub" && user[type].grade.votes}
                    onClose={() => setShowModal(false)}
                  />
                )
              }
            >
              החשבון שלי
            </Nav.Link>
            <Nav.Link
              onClick={() =>
                setShowModal(
                  <UserForm
                    user={user}
                    signup
                    onClose={() => setShowModal(false)}
                  />
                )
              }
            >
              ערוך פרופיל
            </Nav.Link>
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
                setShowModal(<UserForm onClose={() => setShowModal(false)} />)
              }
            >
              התחבר
            </Nav.Link>
            <Nav.Link
              onClick={() =>
                setShowModal(
                  <UserForm signup onClose={() => setShowModal(false)} />
                )
              }
            >
              הרשמה
            </Nav.Link>
            <Nav.Link
              onClick={() =>
                setShowModal(
                  <UserForm signup demo onClose={() => setShowModal(false)} />
                )
              }
            >
              דמו
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
