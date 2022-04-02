import React from "react";
import ReactStars from "react-rating-stars-component";
import { Button } from "react-bootstrap";

export const Details = (props) => {
  return (
    <div>
      <ul style={{ listStyle: "none", textAlign: "center" }}>
        {props.img && (
          <img
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
            src={props.img}
            alt="profile"
          />
        )}
        <li>שם: {props.name}</li>
        <li>טלפון: {props.phone}</li>
        {props.grade !== "school" && (
          <>
            <li>
              {
                <ReactStars
                  classNames={"stars"}
                  count={5}
                  size={24}
                  edit={false}
                  isHalf={true}
                  value={props.grade}
                />
              }
            </li>
            <li>דירוגים: {props.votes}</li>
          </>
        )}
        {props.onClick && <Button onClick={props.onClick}>בחר</Button>}
      </ul>
    </div>
  );
};
