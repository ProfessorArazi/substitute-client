import { useContext, useEffect, useState } from "react";
import WorksContext from "../store/works-context";
import { WorksFormat } from "../Components/WorksFormat";
import axios from "axios";
import { Button } from "react-bootstrap";
import Modal from "../Components/UI/Modal";
import { WorksForm } from "../Components/Forms/WorksForm";

export const SchoolWorks = () => {
  const ctx = useContext(WorksContext);
  const { closeWorks, oldWorks, updateUserWorks } = ctx;

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

  const onDeleteHandler = (userId, id) => {
    axios
      .delete(`${process.env.REACT_APP_SERVER}/school/works/${userId}/${id}`)
      .then((res) => {
        sessionStorage.setItem("user", JSON.stringify(res.data));
        updateUserWorks({ works: res.data.school.works });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (
      !closeWorks.length &&
      !oldWorks.length &&
      JSON.parse(sessionStorage.getItem("user")).school.works.length
    ) {
      const works = JSON.parse(sessionStorage.getItem("user")).school.works;
      updateUserWorks({ works });
    }
  }, [closeWorks, oldWorks]);

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
      {structures.map((structure, i) => (
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
