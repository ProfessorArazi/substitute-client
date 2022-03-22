import React from "react";
import { useState, useContext } from "react";
import WorksContext from "../../store/works-context";
import { Form, Button } from "react-bootstrap";
import { httpRequest } from "../../httpRequest";
import { resizeFile } from "../Images/resizeFile";
import { storageObject } from "../Storage/storageObject";
import { toast } from "react-toastify";

export const ImageForm = (props) => {
  const ctx = useContext(WorksContext);
  const {
    updateAllWorks,
    updateUserWorks,
    updateNotifications,
    showModalLoading,
    modalLoading,
  } = ctx;

  const [files, setFiles] = useState([]);

  const onImageChange = (e) => {
    setFiles(e.target.files);
  };

  const uploadImageHandler = async (e) => {
    e.preventDefault();
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (files.length === 0) {
      return toast.error("לא הכנסת תמונה", {
        autoClose: 1000,
        position: "top-left",
        theme: "colored",
        hideProgressBar: true,
      });
    }

    const img = await resizeFile(files[0]);

    const data = {
      img,
      email: user[user.type].email,
      type: user.type,
    };

    if (user.type === "sub") {
      data.substituteId = user.sub._id;
    } else {
      data.userId = user.school._id;
    }
    showModalLoading(true);
    const res = await httpRequest("put", `/${user.type}/image`, data, {
      token: user.token,
    });
    if (res.data) {
      sessionStorage.setItem(
        "user",
        JSON.stringify(storageObject(user.type, res.data))
      );
      if (user.type === "sub") {
        updateAllWorks(res.data.works);
        updateUserWorks({
          works: {
            works: [...res.data.sub.works],
            subId: user.sub._id,
          },
        });
      } else {
        console.log(res.data);
        updateUserWorks({
          works: { works: res.data.school.works, type: "school" },
        });
      }
      updateNotifications(res.data[user.type].notifications);
      props.onClose();
    } else console.log(res.err);
    showModalLoading(false);
  };

  return (
    <>
      {modalLoading ? (
        modalLoading
      ) : (
        <>
          <Form onSubmit={uploadImageHandler}>
            <Form.Group className="mb-3" controlId="image">
              <Form.Label>פרופיל</Form.Label>
              <Form.Control onChange={onImageChange} type="file" />
            </Form.Group>
            <Button type="submit">submit</Button>
          </Form>
        </>
      )}
    </>
  );
};
