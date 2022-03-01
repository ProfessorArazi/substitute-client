import { useContext } from "react";
import WorksContext from "../store/works-context";
import { Work } from "./Work";
import axios from "axios";

export const Home = (props) => {
  const ctx = useContext(WorksContext);
  const { works, updateAllWorks } = ctx;

  const onApplyHandler = (substituteId, workId, userId) => {
    axios
      .post(`${process.env.REACT_APP_SERVER}/sub/works/apply`, {
        substituteId,
        workId,
        userId,
      })
      .then((res) => {
        sessionStorage.setItem("user", JSON.stringify(res.data));

        const updatedWorks = works
          .slice()
          .filter((work) => work._id !== workId);

        updateAllWorks(updatedWorks);
      })
      .catch((err) => console.log(err));
  };

  const type = props.type;

  return (
    <>
      {works.length > 0 ? (
        <>
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
        <h3>דף הבית</h3>
      )}
    </>
  );
};
