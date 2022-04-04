import { useContext, useEffect, useCallback } from "react";
import WorksContext from "../store/works-context";
import { Work } from "../Components/Works/Work";
import { httpRequest } from "../httpRequest";
import { updateWorks } from "../Components/Works/updateWorks";
import { storageObject } from "../Components/Storage/storageObject";
import { toast } from "react-toastify";
import { Navbar, Container, Nav } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import { FilterForm } from "../Components/Forms/FilterForm";

export const Home = () => {
  const ctx = useContext(WorksContext);
  const {
    updateUserWorks,
    works,
    updateAllWorks,
    type,
    showLoading,
    updateNotifications,
  } = ctx;

  const updateUserWorksHandler = useCallback(
    (data, user) => {
      updateUserWorks({
        works: {
          works: [...data.sub.works],
          subId: user.sub._id,
        },
      });
      updateNotifications(data.sub.notifications);
      sessionStorage.setItem(
        "user",
        JSON.stringify(storageObject("sub", data))
      );
    },
    [updateUserWorks, updateNotifications]
  );

  const onApplyHandler = async (substituteId, work, userId) => {
    showLoading(true);
    const res = await httpRequest(
      "post",
      "/sub/works/apply",
      {
        substituteId,
        work,
        userId,
        email: JSON.parse(sessionStorage.getItem("user")).sub.email,
        type: "sub",
      },
      { token: JSON.parse(sessionStorage.getItem("user")).token }
    );

    if (res.data) {
      if (res.data.error) {
        showLoading(false);
        return toast.error(res.data.error, {
          autoClose: 1000,
          position: "top-left",
          theme: "colored",
          hideProgressBar: true,
        });
      }

      updateAllWorks(res.data.works);
      sessionStorage.setItem(
        "user",
        JSON.stringify(storageObject("sub", res.data))
      );
    } else {
      console.log(res.err);
    }
    showLoading(false);
  };

  useEffect(() => {
    if (
      JSON.parse(sessionStorage.getItem("user")) &&
      JSON.parse(sessionStorage.getItem("user")).type === "sub"
    ) {
      const user = JSON.parse(sessionStorage.getItem("user"));

      const updateSubWorksPage = async () => {
        const res = await updateWorks("/sub/works");
        if (res.data) {
          updateUserWorksHandler(res.data, user);
        } else {
          console.log(res.error);
        }
      };

      updateSubWorksPage();
    }
  }, [updateUserWorksHandler]);

  return (
    <>
      <>
        {type === "sub" ? (
          <>
            <Navbar className="filter" dir="rtl" expand="lg">
              <Container>
                <Navbar.Toggle
                  className="toggle"
                  aria-controls="basic-navbar-nav"
                >
                  <span>
                    <FaFilter />
                  </span>
                </Navbar.Toggle>
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                    <FilterForm />
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>

            <h2>עבודות זמינות</h2>
            <div className="works">
              {works.map((work, i) => (
                <Work
                  key={work._id}
                  id={work._id}
                  userId={work.userId}
                  page="home"
                  type={type}
                  school={work.school}
                  date={work.date}
                  subject={work.subject}
                  city={work.city}
                  hours={work.hours}
                  ageGroup={work.ageGroup}
                  onApply={
                    type === "sub"
                      ? (substituteId, work, userId) =>
                          onApplyHandler(substituteId, work, userId)
                      : ""
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <h2>דף הבית</h2>
        )}
      </>
    </>
  );
};
