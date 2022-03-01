import { useContext, useEffect } from "react";
import { WorksFormat } from "../Components/WorksFormat";
import WorksContext from "../store/works-context";

export const SubWorks = () => {
  const ctx = useContext(WorksContext);
  const { closeWorks, waitingWorks, rejectedWorks, oldWorks, updateUserWorks } =
    ctx;

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
    if (
      closeWorks.length +
        oldWorks.length +
        waitingWorks.length +
        rejectedWorks.length !==
      JSON.parse(sessionStorage.getItem("user")).sub.works.length
    ) {
      const works = JSON.parse(sessionStorage.getItem("user")).sub.works;
      updateUserWorks({
        works: {
          works: [...works],
          subId: JSON.parse(sessionStorage.getItem("user")).sub._id,
        },
      });
    }
  }, []);

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
