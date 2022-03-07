import { useContext, useEffect } from "react";
import { WorksFormat } from "../Components/WorksFormat";
import WorksContext from "../store/works-context";
import { httpRequest } from "../httpRequest";

export const SubWorks = () => {
  const ctx = useContext(WorksContext);
  const {
    closeWorks,
    waitingWorks,
    rejectedWorks,
    oldWorks,
    updateAllWorks,
    updateNotifications,
  } = ctx;

  const structures = [
    {
      title: "עבודות קרובות",
      works: closeWorks,
    },
    {
      title: "עבודות בהמתנה",
      works: waitingWorks,
    },
    {
      title: "עבודות שנדחו",
      works: rejectedWorks,
    },
    {
      title: "עבודות שביצעתי",
      works: oldWorks,
    },
  ];

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.type === "sub") {
      const updateWorks = async () => {
        const res = await httpRequest(
          "post",
          "/works",
          {
            substituteId: user.sub._id,
            email: user.sub.email,
            type: user.type,
          },
          { token: user.token }
        );
        if (res.data) {
          updateAllWorks(res.data.works);
          updateNotifications(res.data.sub.notifications);
          sessionStorage.setItem(
            "user",
            JSON.stringify({
              sub: res.data.sub,
              token: res.data.token,
              type: res.data.type,
            })
          );
        } else {
          console.log(res.error);
        }
      };

      updateWorks();
    }
  }, [updateAllWorks, updateNotifications]);

  return (
    <>
      <h1>העבודות שלי</h1>
      {structures.map((structure, i) => (
        <WorksFormat
          key={i}
          type="sub"
          title={structure.title}
          works={structure.works}
        />
      ))}
    </>
  );
};
