import React from "react";
import { useState, useContext } from "react";
import WorksContext from "../../store/works-context";
import { Form, Button } from "react-bootstrap";
import { httpRequest } from "../../httpRequest";
import { getBase64 } from "../Images/getBase64";
import { storageObject } from "../Storage/storageObject";

export const ImageForm = (props) => {
  const ctx = useContext(WorksContext);
  const {
    updateAllWorks,
    updateUserWorks,
    updateNotifications,
    showLoading,
    loading,
  } = ctx;

  const [files, setFiles] = useState([]);

  const onImageChange = (e) => {
    setFiles(e.target.files);
  };

  const uploadImageHandler = async (e) => {
    e.preventDefault();
    const user = JSON.parse(sessionStorage.getItem("user"));
    const img = await getBase64(files[0]);

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
    showLoading(true);
    const res = await httpRequest("post", `/${user.type}/image`, data, {
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
        updateUserWorks({
          works: { works: data.school.works, type: "school" },
        });
      }
      updateNotifications(res.data[user.type].notifications);
      props.onClose();
    } else console.log(res.error);
    showLoading(false);
  };

  return (
    <>
      {loading ? (
        loading
      ) : (
        <Form onSubmit={uploadImageHandler}>
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>פרופיל</Form.Label>
            <Form.Control onChange={onImageChange} type="file" />
          </Form.Group>
          <Button type="submit">submit</Button>
        </Form>
      )}
    </>
  );
};
