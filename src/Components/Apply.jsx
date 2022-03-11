import { useState, useContext } from "react";
import { httpRequest } from "../httpRequest";
import Modal from "./UI/Modal";
import WorksContext from "../store/works-context";
import { Details } from "./Details/Details";
import { storageObject } from "./Storage/storageObject";

export const ApplyIcon = (props) => {
  const { apply, workId } = props;
  console.log(apply);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <img
        onClick={() =>
          setShowModal(
            <Modal onClose={() => setShowModal(false)}>
              <ApplyDetails
                apply={apply}
                workId={workId}
                onClose={() => setShowModal(false)}
              />
            </Modal>
          )
        }
        src={apply.img}
        alt="user"
        className="apply"
      />
      {showModal && showModal}
    </>
  );
};

const ApplyDetails = (props) => {
  const ctx = useContext(WorksContext);
  const { updateUserWorks, updateNotifications, showLoading, loading } = ctx;

  const pickSubHandler = async () => {
    const { apply, workId } = props;

    showLoading(true);
    const res = await httpRequest(
      "post",
      "/school/works/pick",
      {
        workId,
        pickedTeacherId: apply._id,
        email: JSON.parse(sessionStorage.getItem("user")).school.email,
        userId: JSON.parse(sessionStorage.getItem("user")).school._id,
        type: "school",
      },
      { token: JSON.parse(sessionStorage.getItem("user")).token }
    );

    if (res.data) {
      sessionStorage.setItem(
        "user",
        JSON.stringify(storageObject("school", res.data))
      );
      const works = res.data.school.works;
      updateNotifications(res.data.school.notifications);
      updateUserWorks({ works: { works, type: "school" } });

      props.onClose();
    } else console.log(res.err);
    showLoading(false);
  };

  console.log(props.apply);

  return (
    <>
      {loading ? (
        loading
      ) : (
        <Details
          img={props.apply.img}
          name={props.apply.name}
          phone={props.apply.phone}
          grade={props.apply.grades.grade}
          votes={props.apply.grades.votes}
          onClick={pickSubHandler}
        />
      )}
    </>
  );
};
