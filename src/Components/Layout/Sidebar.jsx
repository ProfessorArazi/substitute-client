import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { UserForm } from "../../Components/Forms/UserForm";
import WorksContext from "../../store/works-context";
import ReactStars from "react-rating-stars-component";
import { ImageForm } from "../../Components/Forms/ImageForm";
import { Details } from "../../Components/Details/Details";

export const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  const ctx = useContext(WorksContext);
  const {
    type,
    updateType,
    updateAllWorks,
    showModal,
    profileImage,
    updateProfileImage,
  } = ctx;

  const toggleHandler = () => {
    setExpanded(expanded ? false : "expanded");
  };

  const closeToggleHandler = () => {
    setExpanded(false);
  };

  const user = type !== "guest" && JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.sub.img) {
      const image = user.sub.img.img.data.data;
      const base64String = btoa(String.fromCharCode(...new Uint8Array(image)));
      updateProfileImage(`data:image/png;base64,${base64String}`);
    }
  }, [updateProfileImage]);

  const menu = (
    <>
      {type === "sub" && (
        <img
          onClick={() =>
            showModal(<ImageForm onClose={() => showModal(false)} />)
          }
          src={profileImage}
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
              showModal(
                <Details
                  name={user[type].name}
                  phone={user[type].phone}
                  grade={type === "sub" && user[type].grade.grade}
                  votes={type === "sub" && user[type].grade.votes}
                />
              )
            }
          >
            החשבון שלי
          </Nav.Link>
          <Nav.Link
            onClick={() =>
              showModal(
                <UserForm onClose={() => showModal(false)} user={user} signup />
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
              showModal(<UserForm onClose={() => showModal(false)} />)
            }
          >
            התחבר
          </Nav.Link>
          <Nav.Link
            onClick={() =>
              showModal(<UserForm onClose={() => showModal(false)} signup />)
            }
          >
            הרשמה
          </Nav.Link>
          <Nav.Link
            onClick={() =>
              showModal(
                <UserForm onClose={() => showModal(false)} signup demo />
              )
            }
          >
            דמו
          </Nav.Link>
        </>
      )}
    </>
  );

  return (
    <>
      {window.innerWidth > 768 ? (
        <nav id="sidebar" className="sidebar">
          {menu}
        </nav>
      ) : (
        <Navbar
          className="navbar"
          dir="rtl"
          bg="light"
          expand="lg"
          expanded={expanded}
        >
          <Container>
            <Navbar.Toggle
              onClick={toggleHandler}
              aria-controls="basic-navbar-nav"
            />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav onClick={closeToggleHandler} className="me-auto">
                {menu}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  );
};
