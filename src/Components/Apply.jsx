import { useContext } from "react";
import { httpRequest } from "../httpRequest";
import WorksContext from "../store/works-context";
import { Details } from "./Details/Details";
import { storageObject } from "./Storage/storageObject";
import { toast } from "react-toastify";

export const ApplyIcon = (props) => {
  const { apply, workId } = props;
  const { showModal } = useContext(WorksContext);

  return (
    <>
      <img
        onClick={() =>
          showModal(
            <ApplyDetails
              apply={apply}
              workId={workId}
              onClose={() => showModal(false)}
            />
          )
        }
        src={
          apply.img.length > 0
            ? apply.img
            : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/2048px-User_font_awesome.svg.png"
        }
        alt="user"
        className="apply"
      />
    </>
  );
};

const ApplyDetails = (props) => {
  const ctx = useContext(WorksContext);
  const {
    updateUserWorks,
    updateNotifications,
    showModalLoading,
    modalLoading,
  } = ctx;

  const pickSubHandler = async () => {
    const { apply, workId } = props;

    showModalLoading(true);
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
      if (res.data.error) {
        showModalLoading(false);
        return toast.error(res.data.error, {
          autoClose: 1000,
          position: "top-left",
          theme: "colored",
          hideProgressBar: true,
        });
      }
      sessionStorage.setItem(
        "user",
        JSON.stringify(storageObject("school", res.data))
      );
      const works = res.data.school.works;
      updateNotifications(res.data.school.notifications);
      updateUserWorks({ works: { works, type: "school" } });

      props.onClose();
    } else console.log(res.err);
    showModalLoading(false);
  };

  return (
    <>
      {modalLoading ? (
        modalLoading
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
