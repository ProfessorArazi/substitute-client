import React, { useContext } from "react";
import WorksContext from "../../store/works-context";
import ReactStars from "react-rating-stars-component";
import { Button } from "react-bootstrap";

export const Details = (props) => {
  const { profileImage } = useContext(WorksContext);

  return (
    <div>
      <ul style={{ listStyle: "none" }}>
        {profileImage && (
          <img
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
            src={profileImage}
            alt="profile"
          />
        )}
        <li>שם: {props.name}</li>
        <li>טלפון: {props.phone}</li>
        {props.grade && (
          <>
            <li>
              {
                <ReactStars
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
      </ul>
      {props.onClick && <Button onClick={props.onClick}>בחר</Button>}
    </div>
  );
};
