import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { UserForm } from "../../Components/Forms/UserForm";
import WorksContext from "../../store/works-context";
import ReactStars from "react-rating-stars-component";
import { ImageForm } from "../../Components/Forms/ImageForm";
import { Details } from "../../Components/Details/Details";

export const Sidebar = (props) => {
  const [expanded, setExpanded] = useState(false);

  const ctx = useContext(WorksContext);
  const { type, updateType, updateAllWorks, showModal } = ctx;

  const toggleHandler = () => {
    setExpanded(expanded ? false : "expanded");
  };

  const closeToggleHandler = () => {
    setExpanded(false);
  };

  const user = type !== "guest" && JSON.parse(sessionStorage.getItem("user"));

  const menu = (
    <>
      {type === "school" && (
        <p className="school-name">{`ביה"ס ${user[type].name}`}</p>
      )}
      {type === "sub" && (
        <>
          <img
            onClick={() =>
              showModal(<ImageForm onClose={() => showModal(false)} />)
            }
            src={
              user[type].img
                ? user[type].img
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/2048px-User_font_awesome.svg.png"
            }
            alt="user"
            className="user-img"
          />
          <ReactStars
            classNames="stars"
            count={5}
            size={24}
            value={user.sub.grade.grade}
            edit={false}
            isHalf={true}
          />
          <Link className="nav-link" to="/">
            עבודות זמינות
          </Link>
        </>
      )}
      {type !== "guest" ? (
        <>
          <Nav.Link
            className="nav-link"
            onClick={() =>
              showModal(
                <Details
                  img={user[type].img}
                  name={user[type].name}
                  phone={user[type].phone}
                  grade={type === "sub" ? user[type].grade.grade : "school"}
                  votes={type === "sub" ? user[type].grade.votes : "school"}
                  desc={type === "sub" ? user[type].desc : "school"}
                />
              )
            }
          >
            החשבון שלי
          </Nav.Link>
          <Nav.Link
            className="nav-link"
            onClick={() =>
              showModal(
                <UserForm onClose={() => showModal(false)} user={user} signup />
              )
            }
          >
            ערוך פרופיל
          </Nav.Link>
          <Link className="nav-link" to="/works">
            העבודות שלי
          </Link>

          <Nav.Link
            className="nav-link"
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
            className="nav-link"
            onClick={() =>
              showModal(<UserForm onClose={() => showModal(false)} />)
            }
          >
            התחבר
          </Nav.Link>
          <Nav.Link
            className="nav-link"
            onClick={() =>
              showModal(<UserForm onClose={() => showModal(false)} signup />)
            }
          >
            הרשמה
          </Nav.Link>
          <Nav.Link
            className="nav-link"
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
      {window.innerWidth > 992 ? (
        <nav id="sidebar" className="sidebar">
          {menu}
        </nav>
      ) : (
        <>
          <Navbar className="navbar" dir="rtl" expand="lg" expanded={expanded}>
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
          {<div onClick={closeToggleHandler}>{props.children}</div>}
        </>
      )}
    </>
  );
};
