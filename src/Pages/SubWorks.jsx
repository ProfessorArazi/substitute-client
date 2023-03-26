import { useContext, useEffect, useCallback } from "react";
import { WorksFormat } from "../Components/Works/WorksFormat";
import WorksContext from "../store/works-context";
import { updateWorks } from "../Components/Works/updateWorks";
import { storageObject } from "../Components/Storage/storageObject";
import { httpRequest } from "../httpRequest";

export const SubWorks = () => {
  const ctx = useContext(WorksContext);
  const {
    closeWorks,
    waitingWorks,
    rejectedWorks,
    oldWorks,
    loading,
    updateAllWorks,
    updateUserWorks,
    updateNotifications,
    showLoading,
  } = ctx;

  const onCancelHandler = async (workId, userId) => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    showLoading(true);
    const res = await httpRequest(
      "post",
      "/sub/works/apply/cancel",
      {
        substituteId: user.sub._id,
        workId,
        userId,
        email: user.sub.email,
        type: "sub",
      },
      { token: user.token }
    );

    if (res.data) {
      sessionStorage.setItem(
        "user",
        JSON.stringify(storageObject("sub", res.data))
      );
      updateUserWorks({
        works: {
          works: [...res.data.sub.works],
          subId: user.sub._id,
        },
      });
      updateAllWorks(res.data.works);
      updateNotifications(res.data.sub.notifications);
    } else console.log(res.err);
    showLoading(false);
  };

  const structures = [
    {
      title: "עבודות קרובות",
      works: closeWorks,
      close: true,
    },
    {
      title: "עבודות בהמתנה",
      works: waitingWorks,
      cancelHandler: onCancelHandler,
      className: "old-section"
    },
    {
      title: "עבודות שנדחו",
      works: rejectedWorks,
    },
    {
      title: "עבודות שביצעתי",
      works: oldWorks,
      className: "old-section"
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
      {!loading && (
        <section className="main-title">
          <h1>העבודות שלי</h1>
        </section>
      )}
      {!loading
        ? structures.map((structure, i) => (
            <WorksFormat
              key={i}
              type="sub"
              title={structure.title}
              works={structure.works}
              onCancel={structure.cancelHandler && structure.cancelHandler}
              close={structure.close}
              className={structure.className}
            />
          ))
        : loading}
    </>
  );
};
