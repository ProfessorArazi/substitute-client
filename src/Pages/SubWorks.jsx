import { useContext, useEffect, useCallback } from "react";
import { WorksFormat } from "../Components/Works/WorksFormat";
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
    loading,
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

  return (
    <>
      {!loading && <h1>העבודות שלי</h1>}
      {!loading
        ? structures.map((structure, i) => (
            <WorksFormat
              key={i}
              type="sub"
              title={structure.title}
              works={structure.works}
            />
          ))
        : loading}
    </>
  );
};
