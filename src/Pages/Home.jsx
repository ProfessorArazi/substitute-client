import { useContext, useState, useRef, useEffect } from "react";
import WorksContext from "../store/works-context";
import { Work } from "./Work";
import { httpRequest } from "../httpRequest";
import { Navbar, Button } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import he from "date-fns/locale/he";
import "react-datepicker/dist/react-datepicker.css";

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
    updateType,
    type,
    loading,
    showLoading,
  } = ctx;

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
      updateAllWorks(res.data.works);
    } else console.log(res.err);
    showLoading(false);
  };

  const onApplyHandler = async (substituteId, workId, userId) => {
    showLoading(true);
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
        JSON.stringify({
          sub: res.data.sub,
          token: res.data.token,
          type: res.data.type,
        })
      );
    } else {
      console.log(res.err);
    }
    showLoading(false);
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.type === "sub") updateType("sub");
  }, [updateType]);

  useEffect(() => {
    if (
      closeWorks.length +
        oldWorks.length +
        waitingWorks.length +
        rejectedWorks.length !==
      JSON.parse(sessionStorage.getItem("user")).sub.works.length
    ) {
      const works = JSON.parse(sessionStorage.getItem("user")).sub.works;
      updateUserWorks({
        works: {
          works: [...works],
          subId: JSON.parse(sessionStorage.getItem("user")).sub._id,
        },
      });
    }
  }, [
    closeWorks.length,
    oldWorks.length,
    rejectedWorks.length,
    waitingWorks.length,
    updateUserWorks,
  ]);

  return (
    <>
      <>
        {loading ? (
          loading
        ) : (
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
        )}
      </>
    </>
  );
};
