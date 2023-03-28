import React, { useRef, useState, useContext, useEffect } from "react";
import WorksContext from "../../store/works-context";
import { httpRequest } from "../../httpRequest";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import he from "date-fns/locale/he";
import { Button } from "react-bootstrap";
import { storageObject } from "../Storage/storageObject";
import { BsCheckLg } from "react-icons/bs";

export const FilterForm = (cities) => {
  registerLocale("he", he);

  const ctx = useContext(WorksContext);
  const { updateAllWorks, showLoading } = ctx;

  const cityRef = useRef();
  const minHoursRef = useRef();
  const maxHoursRef = useRef();

  const [showDate, setShowDate] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (startDate && endDate) {
      setShowDate(false);
    }
  }, [startDate, endDate]);

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

  const cityAndDate = (
    <>
      <label>
        <span className="filter-form__span">עיר</span>
        <input
          ref={cityRef}
          type="text"
          id="city"
          list="cityname"
        />
        <datalist id="cityname">
          {cities &&
            cities.cities.cities.map((city) => (
              <option value={city["שם_ישוב"].trim()} />
            ))}
        </datalist>
      </label>
      <label>
        <span className="filter-form__span">תאריך</span>
        {!showDate && <input onClick={() => setShowDate(true)} />}
        {showDate && (
          <DatePicker
            // withPortal
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            locale="he"
            dateFormat="dd/MM/yyyy"
            onKeyDown={(e) => {
              e.preventDefault();
            }}
            onChange={(update) => {
              setDateRange(update);
            }}
          />
        )}
      </label>
    </>
  );

  const hoursInputs = (
    <>
      <label>
        <span className="filter-form__span">מקסימום שעות</span>
        <input dir="ltr" ref={maxHoursRef} type="number" />
      </label>
      <label>
        <span className="filter-form__span">מינימום שעות</span>
        <input ref={minHoursRef} type="number" />
      </label>
    </>
  );

  return (
    <form className="filter-form">
      {window.innerWidth < 1120 ? (
        <div className="filter-form__inner">{cityAndDate}</div>
      ) : (
        cityAndDate
      )}
      {window.innerWidth < 1120 ? (
        <div className="filter-form__inner">
          {hoursInputs}
          <div className="filter-btn">
            <Button className="light-blue__btn" onClick={onFilterHandler}>
              <BsCheckLg />
            </Button>
          </div>
        </div>
      ) : (
        <>
          {hoursInputs}
          <div className="filter-btn">
            <Button className="light-blue__btn" onClick={onFilterHandler}>
              <BsCheckLg />
            </Button>
          </div>
        </>
      )}
    </form>
  );
};
