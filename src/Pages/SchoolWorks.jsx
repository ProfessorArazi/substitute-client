import { useContext, useEffect, useState } from "react";
import WorksContext from "../store/works-context";
import { WorksFormat } from "../Components/WorksFormat";
import { httpRequest } from "../httpRequest";
import { Button } from "react-bootstrap";
import Modal from "../Components/UI/Modal";
import { WorksForm } from "../Components/Forms/WorksForm";

export const SchoolWorks = () => {
  const ctx = useContext(WorksContext);
  const {
    closeWorks,
    oldWorks,
    updateUserWorks,
    updateNotifications,
    showLoading,
    loading,
  } = ctx;

  const [showModal, setShowModal] = useState(false);

  const structures = [
    {
      title: "עבודות זמינות",
      works: closeWorks,
    },

    {
      title: "עבודות ישנות",
      works: oldWorks,
    },
  ];

  const onDeleteHandler = async (userId, id) => {
    showLoading(true);
    const res = await httpRequest(
      "post",
      `/school/works/${userId}/${id}`,
      {
        email: JSON.parse(sessionStorage.getItem("user")).school.email,
        userId: JSON.parse(sessionStorage.getItem("user")).school.id,
        type: "school",
      },
      { token: JSON.parse(sessionStorage.getItem("user")).token }
    );
    if (res.data) {
      sessionStorage.setItem("user", JSON.stringify(res.data));
      updateUserWorks({ works: res.data.school.works });
    } else {
      console.log(res.err);
    }
    showLoading(false);
  };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    const updateStorage = async () => {
      const res = await httpRequest(
        "post",
        "/school/works",
        {
          userId: user.school._id,
          email: user.school.email,
          type: "school",
        },
        { token: user.token }
      );

      if (res.data) {
        sessionStorage.setItem("user", JSON.stringify(res.data));
        updateUserWorks({ works: res.data.school.works });
        updateNotifications(res.data.school.notifications);
      } else console.log(res.err);
    };

    updateStorage();
  }, [updateNotifications, updateUserWorks]);

  useEffect(() => {
    if (
      !closeWorks.length &&
      !oldWorks.length &&
      JSON.parse(sessionStorage.getItem("user")).school.works.length
    ) {
      const works = JSON.parse(sessionStorage.getItem("user")).school.works;
      updateUserWorks({ works });
    }
  }, [closeWorks, oldWorks, updateUserWorks]);

  return (
    <>
      <Button
        onClick={() =>
          setShowModal(<WorksForm onClose={() => setShowModal(false)} />)
        }
        className="add-work__btn"
      >
        +
      </Button>

      {loading
        ? loading
        : structures.map((structure, i) => (
            <WorksFormat
              key={i}
              title={structure.title}
              type="school"
              works={structure.works}
              onDelete={(userId, id) => onDeleteHandler(userId, id)}
              onEdit={(work) =>
                setShowModal(
                  <WorksForm work={work} onClose={() => setShowModal(false)} />
                )
              }
            />
          ))}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>{showModal}</Modal>
      )}
    </>
  );
};
