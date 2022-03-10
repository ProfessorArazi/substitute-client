import { useContext, useEffect, useCallback } from "react";
import { WorksFormat } from "../Components/WorksFormat";
import WorksContext from "../store/works-context";
import { updateWorks } from "../Components/Works/updateWorks";
import { storageObject } from "../Components/Storage/storageObject";

export const SubWorks = () => {
  const ctx = useContext(WorksContext);
  const {
    closeWorks,
    waitingWorks,
    rejectedWorks,
    oldWorks,
    updateAllWorks,
    updateNotifications,
    updateUserWorks,
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

  const updateAllWorksHandler = useCallback(
    (data) => {
      updateAllWorks(data.works);
      updateNotifications(data.sub.notifications);
      sessionStorage.setItem(
        "user",
        JSON.stringify(storageObject("sub", data))
      );
    },
    [updateAllWorks, updateNotifications]
  );

  useEffect(() => {
    const updateHomePage = async () => {
      const res = await updateWorks("/works");
      if (res.data) {
        updateAllWorksHandler(res.data);
      } else console.log(res.err);
    };

    updateHomePage();
  }, [updateAllWorksHandler]);

  useEffect(() => {
    console.log("loli");
    if (
      !closeWorks.length &&
      !waitingWorks.length &&
      !rejectedWorks.length &&
      !oldWorks.length
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
    updateAllWorks,
    updateNotifications,
    updateUserWorks,
    closeWorks.length,
    oldWorks.length,
    rejectedWorks.length,
    waitingWorks.length,
  ]);

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
