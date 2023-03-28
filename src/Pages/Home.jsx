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

export const Home = (cities) => {
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
                    <FilterForm cities={cities} />
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>

            <h1>עבודות זמינות</h1>
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
          <>
            <p dir="rtl" className="home-page__desc">
              <p className="home-page__desc__title">
                Substitues הוא אתר המחבר בין בתי ספר למורים מחליפים.
              </p>
              <br />
              האתר נותן מענה במקרים בהם מורים נעדרים מבית הספר ויש צורך במורה
              מחליף, אפשר להירשם בתור בית ספר או בתור מורה. <br /> <br /> בית
              הספר יכול להציע משרות למורים, המורים מציעים עצמם לבית הספר ע"י
              הרשמה למשרה. לבית הספר יש אפשרות לבחור מורה מרשימת המורים שנרשמו
              לכל משרה.
              <br /> לאחר שבית הספר העסיק מורה הוא יוכל לדרג אותו בסיום העבודה.{" "}
              <br />
              בתי ספר אחרים יוכלו לראות את הדירוג הממוצע של המורה ולהחליט אם
              להעסיק אותו. <br />
              <br />
              מורים יכולים לסנן את המשרות המוצעות ע"י בחירת תאריכים, שעות עבודה
              ועיר.<br />
              <br /> המשתמשים מקבלים התראות באתר עם כל עדכון רלוונטי, הם יכולים
              להצטרף לרשימת התפוצה ולקבל גם התראות במייל.<br/> מורים אשר יצטרפו
              לרשימת התפוצה יקבלו עדכונים יומיים לגבי משרות חדשות בעיר שלהם.<br />
              <br /> אם
              תרצו רק להתרשם מהאתר אפשר לצפות ע"י הרשמה במצב דמו.
            </p>
          </>
        )}
      </>
    </>
  );
};
