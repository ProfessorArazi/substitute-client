import React from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { httpRequest } from "../../httpRequest";

export const ImageForm = () => {
  const [files, setFiles] = useState([]);

  const onImageChange = (e) => {
    setFiles(e.target.files);
  };

  const uploadImageHandler = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const data = new FormData();
    data.append("file", files[0]);
    const res = await httpRequest("post", `/${user.type}/image`, data);
  };

  return (
    <Form onSubmit={uploadImageHandler}>
      <Form.Group className="mb-3" controlId="image">
        <Form.Label>פרופיל</Form.Label>
        <Form.Control onChange={onImageChange} type="file" />
      </Form.Group>
      <Button>submit</Button>
    </Form>
  );
};
