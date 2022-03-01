import { useRef, useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import WorksContext from "../../store/works-context";
import axios from "axios";

export const WorksForm = (props) => {
  const { work } = props;
  const ctx = useContext(WorksContext);
  const { updateUserWorks } = ctx;

  const subjectRef = useRef();
  const dateRef = useRef();
  const hoursRef = useRef();
  const ageRef = useRef();

  const [subjectValue, setSubjectValue] = useState(work ? work.subject : "");
  const [dateValue, setDateValue] = useState(work ? work.date : "");
  const [hoursValue, setHoursValue] = useState(work ? work.hours : "");
  const [ageValue, setAgeValue] = useState(work ? work.ageGroup : "");

  const addWorkHandler = (e) => {
    e.preventDefault();

    const user = JSON.parse(sessionStorage.getItem("user")).school;

    const subject = subjectRef.current.value;
    const date = new Date(dateRef.current.value);
    const hours = hoursRef.current.value;
    const ageGroup = +ageRef.current.value;

    axios({
      method: work ? "put" : "post",
      url: `${process.env.REACT_APP_SERVER}/school/work`,
      data: {
        userId: user.id,
        id: work ? work._id : "",
        subject,
        date,
        hours,
        ageGroup,
        city: user.city,
        school: user.name,
        phone: user.phone,
        changes: {
          subject,
          date,
          hours,
          ageGroup,
        },
      },
    })
      .then((res) => {
        sessionStorage.setItem("user", JSON.stringify(res.data));
        updateUserWorks({ works: res.data.school.works });
        props.onClose();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Form className="login-form" onSubmit={addWorkHandler}>
      <>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>מקצוע</Form.Label>
          <Form.Control
            value={subjectValue}
            onInput={() => setSubjectValue(subjectRef.current.value)}
            ref={subjectRef}
            type="text"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="city">
          <Form.Label>תאריך</Form.Label>
          <Form.Control
            value={dateValue}
            onInput={() => setDateValue(dateRef.current.value)}
            ref={dateRef}
            type="date"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="טלפון">
          <Form.Label>שעות</Form.Label>
          <Form.Control
            value={hoursValue}
            onInput={() => setHoursValue(hoursRef.current.value)}
            ref={hoursRef}
            dir="ltr"
            type="text"
          />
        </Form.Group>
      </>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>גילאים</Form.Label>
        <Form.Control
          value={ageValue}
          onInput={() => setAgeValue(ageRef.current.value)}
          ref={ageRef}
          dir="ltr"
          type="text"
        />
      </Form.Group>

      <Button type="submit">Submit</Button>
    </Form>
  );
};
