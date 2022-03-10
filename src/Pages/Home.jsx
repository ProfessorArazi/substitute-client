import { useContext, useState, useRef, useEffect, useCallback } from "react";
import WorksContext from "../store/works-context";
import { Work } from "./Work";
import { httpRequest } from "../httpRequest";
import { Navbar, Button } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import he from "date-fns/locale/he";
import "react-datepicker/dist/react-datepicker.css";
import { updateWorks } from "../Components/Works/updateWorks";
import { storageObject } from "../Components/Storage/storageObject";

registerLocale("he", he);

export const Home = () => {
  const cityRef = useRef();
  const minHoursRef = useRef();
  const maxHoursRef = useRef();

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const ctx = useContext(WorksContext);
  const {
    closeWorks,
    oldWorks,
    waitingWorks,
    rejectedWorks,
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

  const onFilterHandler = async () => {
    let start;
    let end;
    if (startDate) {
      start = new Date([
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
      ]);
    }
    if (endDate) {
      end = new Date([
        endDate.getFullYear(),
        endDate.getMonth() + 1,
        endDate.getDate() + 1,
      ]);
    }
    showLoading(true);
    const user = JSON.parse(sessionStorage.getItem("user"));
    const res = await httpRequest(
      "post",
      "/works",
      {
        substituteId: user.sub._id,
        email: user.sub.email,
        type: "sub",

        city: cityRef.current.value,
        minHours: minHoursRef.current.value,
        maxHours: maxHoursRef.current.value,
        startDate: start,
        endDate: end,
      },
      { token: user.token }
    );

    if (res.data) {
      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...storageObject("sub", res.data), filtered: true })
      );
      updateAllWorks(res.data.works);
    } else console.log(res.err);
    showLoading(false);
  };

  const onApplyHandler = async (substituteId, workId, userId) => {
    showLoading(true);
    const before = new Date().getTime();
    const res = await httpRequest(
      "post",
      "/sub/works/apply",
      {
        substituteId,
        workId,
        userId,
        email: JSON.parse(sessionStorage.getItem("user")).sub.email,
        type: "sub",
      },
      { token: JSON.parse(sessionStorage.getItem("user")).token }
    );

    if (res.data) {
      updateAllWorks(res.data.works);
      sessionStorage.setItem(
        "user",
        JSON.stringify(storageObject("sub", res.data))
      );
    } else {
      console.log(res.err);
    }
    console.log(new Date().getTime() - before);
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
            <Navbar
              style={{
                width: "85%",
                padding: "10px 20px",
              }}
              bg="secondary"
              dir="rtl"
            >
              <input ref={cityRef} type="text" placeholder="עיר" />
              <input
                ref={minHoursRef}
                type="number"
                placeholder="מינימום שעות"
              />
              <input
                ref={maxHoursRef}
                type="number"
                placeholder="מקסימום שעות"
              />
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                locale="he"
                dateFormat="dd/MM/yyyy"
                onChange={(update) => {
                  setDateRange(update);
                }}
                placeholderText="תאריך"
                withPortal
              />

              <Button onClick={onFilterHandler}>סנן</Button>
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
                      ? (substituteId, workId, userId) =>
                          onApplyHandler(substituteId, workId, userId)
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
