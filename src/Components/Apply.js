import { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import { httpRequest } from "../httpRequest";
import Modal from "./UI/Modal";
import WorksContext from "../store/works-context";

export const ApplyIcon = (props) => {
  const { apply, workId } = props;
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
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/2048px-User_font_awesome.svg.png"
        alt="user"
        className="apply"
      />
      {showModal && showModal}
    </>
  );
};

const ApplyDetails = (props) => {
  const ctx = useContext(WorksContext);
  const { updateUserWorks, showLoading, loading } = ctx;

  const pickSubHandler = async () => {
    const { apply, workId } = props;
    return console.log(apply);

    showLoading(true);
    const res = await httpRequest(
      "post",
      "/school/works/pick",
      {
        workId,
        pickedTeacherId: apply._id,
        email: JSON.parse(sessionStorage.getItem("user")).school.email,
        userId: JSON.parse(sessionStorage.getItem("user")).school.id,
        type: "school",
      },
      { token: JSON.parse(sessionStorage.getItem("user")).token }
    );

    if (res.data) {
      sessionStorage.setItem("user", JSON.stringify(res.data));
      const works = res.data.school.works;
      updateUserWorks({ works });

      props.onClose();
    } else console.log(res.err);
    showLoading(false);
  };

  return (
    <>
      {loading ? (
        loading
      ) : (
        <div>
          <ul style={{ listStyle: "none" }}>
            <li>שם: {props.apply.name}</li>
            <li>טלפון: {props.apply.phone}</li>
          </ul>
          <Button onClick={pickSubHandler}>בחר</Button>
        </div>
      )}
    </>
  );
};
