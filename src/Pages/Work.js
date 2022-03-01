import moment from "moment";
import { Button } from "react-bootstrap";

export const Work = (props) => {
  return (
    <>
      <div className="work">
        <div>
          {props.school && <p>בית הספר : {props.school}</p>}
          <p>
            תאריך :{" "}
            {moment(new Date(props.date).getTime()).format("DD.MM.YYYY")}
          </p>
          <p>מקצוע : {props.subject}</p>
        </div>
        <div>
          {props.city && <p>עיר : {props.city}</p>}
          <p>שעות : {props.hours}</p>
          <p>כיתות : {props.ageGroup}</p>
        </div>
        {props.type === "sub" && props.page === "home" && (
          <Button
            onClick={() =>
              props.onApply(
                JSON.parse(sessionStorage.getItem("user")).sub._id,
                props.id,
                props.userId
              )
            }
          >
            הירשם
          </Button>
        )}
        {props.type === "school" && props.page === "works" && (
          <div>
            {props.applied ? (
              <>
                {/* <p>נרשמים: </p> <div>{props.applied}</div>{" "} */}
                ''
              </>
            ) : props.picked ? (
              <>
                <p>המורה שנבחר: </p> <div>{props.picked}</div>
              </>
            ) : (
              <>
                <Button onClick={() => props.onEdit(props.work)}>ערוך</Button>
                <Button
                  onClick={() =>
                    props.onDelete(
                      JSON.parse(sessionStorage.getItem("user")).school.id,
                      props.id
                    )
                  }
                >
                  מחק
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};
