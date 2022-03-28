import React, { useRef, useState, useContext } from "react";
import WorksContext from "../../store/works-context";
import { httpRequest } from "../../httpRequest";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import he from "date-fns/locale/he";
import { Button } from "react-bootstrap";
import { storageObject } from "../Storage/storageObject";

export const FilterForm = () => {
  registerLocale("he", he);

  const ctx = useContext(WorksContext);
  const { updateAllWorks, showLoading } = ctx;

  const cityRef = useRef();
  const minHoursRef = useRef();
  const maxHoursRef = useRef();

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

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

  return (
    <form className="filter-form">
      <label className="city-input">
        <span>עיר</span>
        <input ref={cityRef} type="text" />
      </label>
      <label className="hours-input">
        <span>מינימום שעות</span>
        <input ref={minHoursRef} type="number" />
      </label>
      <label className="hours-input">
        <span>מקסימום שעות</span>
        <input dir="ltr" ref={maxHoursRef} type="number" />
      </label>
      <label className="date-input">
        <span>תאריך</span>
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          locale="he"
          dateFormat="dd/MM/yyyy"
          onChange={(update) => {
            setDateRange(update);
          }}
          withPortal
        />
      </label>

      <Button
        className="filter-btn"
        variant="success"
        onClick={onFilterHandler}
      >
        חפש
      </Button>
    </form>
  );
};
