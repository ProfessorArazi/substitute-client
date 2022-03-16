import { useRef, useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import WorksContext from "../../store/works-context";
import { httpRequest } from "../../httpRequest";
import { storageObject } from "../Storage/storageObject";
import he from "date-fns/locale/he";
import DatePicker, { registerLocale } from "react-datepicker";
import { toast } from "react-toastify";

registerLocale("he", he);

export const WorksForm = (props) => {
  const { work } = props;
  const ctx = useContext(WorksContext);
  const { updateUserWorks, loading, showLoading } = ctx;

  const subjectRef = useRef();
  const hoursRef = useRef();

  const [subjectValue, setSubjectValue] = useState(work ? work.subject : "");
  const [hoursValue, setHoursValue] = useState(work ? work.hours : "");
  const [date, setDate] = useState(new Date());

  const addWorkHandler = async (e) => {
    e.preventDefault();

    const user = JSON.parse(sessionStorage.getItem("user")).school;

    const subject = subjectRef.current.value;
    const dateValue = new Date(date);
    const hours = hoursRef.current.value;

    showLoading(true);

    const res = await httpRequest(
      work ? "put" : "post",
      "/school/work",
      {
        userId: user._id,
        id: work ? work._id : "",
        email: user.email,
        subject,
        date: dateValue,
        hours,
        ageGroup: user.ageGroup,
        city: user.city,
        school: user.name,
        phone: user.phone,
        type: "school",
        changes: {
          subject,
          date,
          hours,
        },
      },
      { token: JSON.parse(sessionStorage.getItem("user")).token }
    );

    if (res.data) {
      if (res.data.error) {
        console.log(res.data.error);
        showLoading(false);
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
      updateUserWorks({
        works: { works: res.data.school.works, type: "school" },
      });
      props.onClose();
    } else console.log(res.err);
    showLoading(false);
  };

  return (
    <>
      {loading ? (
        loading
      ) : (
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
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>תאריך</Form.Label>

              <DatePicker
                startDate={date}
                endDate={new Date(31, 11, 2029)}
                selected={date}
                locale="he"
                dateFormat="dd/MM/yyyy"
                onChange={(update) => {
                  setDate(update);
                }}
                placeholderText={date.toLocaleDateString()}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="טלפון">
              <Form.Label>שעות</Form.Label>
              <Form.Control
                value={hoursValue}
                onInput={() => setHoursValue(hoursRef.current.value)}
                ref={hoursRef}
                dir="ltr"
                type="number"
              />
            </Form.Group>
          </>

          <Button type="submit">Submit</Button>
        </Form>
      )}
    </>
  );
};
