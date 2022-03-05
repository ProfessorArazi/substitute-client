import { useContext } from "react";
import WorksContext from "../store/works-context";
import { Work } from "./Work";
import { httpRequest } from "../httpRequest";

export const Home = (props) => {
  const ctx = useContext(WorksContext);
  const { works, updateAllWorks, loading, showLoading } = ctx;

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
      sessionStorage.setItem("user", JSON.stringify(res.data));

      const updatedWorks = works.slice().filter((work) => work._id !== workId);

      updateAllWorks(updatedWorks);
    } else {
      console.log(res.err);
    }
    showLoading(false);
  };

  const type = props.type;

  return (
    <>
      {works.length > 0 ? (
        <>
          {loading ? (
            loading
          ) : (
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
          )}
        </>
      ) : (
        <h3>דף הבית</h3>
      )}
    </>
  );
};
