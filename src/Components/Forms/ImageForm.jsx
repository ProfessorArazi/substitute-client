import React from "react";
import { useState, useContext } from "react";
import WorksContext from "../../store/works-context";
import { Form, Button } from "react-bootstrap";
import { httpRequest } from "../../httpRequest";
import { storageObject } from "../Storage/storageObject";
import { toast } from "react-toastify";

export const ImageForm = (props) => {
  const ctx = useContext(WorksContext);
  const {
    updateAllWorks,
    updateUserWorks,
    updateNotifications,
    showModalLoading,
    updateProfileImage,
    modalLoading,
  } = ctx;

  const [files, setFiles] = useState([]);

  const onImageChange = (e) => {
    setFiles(e.target.files);
  };

  const uploadImageHandler = async (e) => {
    e.preventDefault();
    const user = JSON.parse(sessionStorage.getItem("user"));
    const fd = new FormData();

    if (files.length === 0) {
      return toast.error("לא הכנסת תמונה", {
        autoClose: 1000,
        position: "top-left",
        theme: "colored",
        hideProgressBar: true,
      });
    }
    fd.append("files", files[0], files[0].name);
    fd.append(
      "state",
      JSON.stringify({
        email: user[user.type].email,
        type: user.type,
        substituteId: user.sub._id,
      })
    );

    showModalLoading(true);
    const res = await httpRequest("put", `/${user.type}/image`, fd, {
      token: user.token,
    });
    if (res.data) {
      sessionStorage.setItem(
        "user",
        JSON.stringify(storageObject(user.type, res.data))
      );
      const image = res.data.sub.img.img.data.data;
      const base64String = btoa(String.fromCharCode(...new Uint8Array(image)));
      updateProfileImage(`data:image/png;base64,${base64String}`);
      updateAllWorks(res.data.works);
      updateUserWorks({
        works: {
          works: [...res.data.sub.works],
          subId: user.sub._id,
        },
      });

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
