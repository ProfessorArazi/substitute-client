import { useContext } from "react";
import WorksContext from "../store/works-context";
import moment from "moment";
import { Button } from "react-bootstrap";
import { ApplyIcon } from "../Components/Apply";
import ReactStars from "react-rating-stars-component";
import { httpRequest } from "../httpRequest";
import { storageObject } from "../Components/Storage/storageObject";

export const Work = (props) => {
  const ctx = useContext(WorksContext);
  const { updateUserWorks, showLoading } = ctx;

  const rateTeacherHandler = async (rating) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    showLoading(true);
    const res = await httpRequest(
      "post",
      "/school/rate",
      {
        email: user.school.email,
        userId: user.school.id,
        type: "school",
        workId: props.id,
        subId: props.picked._id,
        grade: rating,
      },
      { token: user.token }
    );

    if (res.data) {
      sessionStorage.setItem(
        "user",
        JSON.stringify(storageObject("school", res.data))
      );
      updateUserWorks({
        works: { works: res.data.school.works, type: "school" },
      });
    } else console.log(res.err);
    showLoading(false);
  };

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
            onClick={() => {
              const work = {
                ageGroup: props.ageGroup,
                city: props.city,
                date: props.date,
                hours: props.hours,
                id: props.id,
                school: props.school,
                subject: props.subject,
              };
              props.onApply(
                JSON.parse(sessionStorage.getItem("user")).sub._id,
                work,
                props.userId
              );
            }}
          >
            הירשם
          </Button>
        )}
        {props.type === "school" && props.page === "works" && (
          <div>
            {props.picked ? (
              <>
                <p>המורה שנבחר: {props.picked.name}</p>
                {props.old && !props.grade && (
                  <ReactStars
                    onChange={rateTeacherHandler}
                    classNames="stars"
                    count={5}
                    size={24}
                  />
                )}
              </>
            ) : props.applied.length ? (
              <>
                {props.applied.map((apply) => (
                  <ApplyIcon apply={apply.apply} workId={props.id} />
                ))}
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
