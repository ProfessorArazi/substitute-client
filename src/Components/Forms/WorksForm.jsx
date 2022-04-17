import { useRef, useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import WorksContext from "../../store/works-context";
import { httpRequest } from "../../httpRequest";
import { storageObject } from "../Storage/storageObject";
import he from "date-fns/locale/he";
import DatePicker, { registerLocale } from "react-datepicker";
import { toast } from "react-toastify";
import { Input } from "./Input";

registerLocale("he", he);

export const WorksForm = (props) => {
  const { work } = props;
  const ctx = useContext(WorksContext);
  const { updateUserWorks, modalLoading, showModalLoading } = ctx;

  const subjectRef = useRef();
  const hoursRef = useRef();

  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));

  const [subjectValue, setSubjectValue] = useState(work ? work.subject : "");
  const [hoursValue, setHoursValue] = useState(work ? work.hours : "");
  const [date, setDate] = useState(work ? new Date(work.date) : tomorrow);
  const [errors, setErrors] = useState({});

  const addWorkHandler = async (e) => {
    e.preventDefault();

    const user = JSON.parse(sessionStorage.getItem("user")).school;

    const subject = subjectRef.current.value;
    const dateValue = new Date(date);
    const hours = hoursRef.current.value;

    if (
      props.work &&
      subject === props.work.subject &&
      dateValue.getTime() === new Date(props.work.date).getTime() &&
      hours === props.work.hours
    ) {
      return props.onClose();
    }

    const formErrors = {};

    if (subject.length < 2) {
      formErrors.subject = true;
    }

    if (hours < 1 || hours > 10) {
      formErrors.hours = true;
    }

    if (Object.keys(formErrors).length > 0) {
      return setErrors(formErrors);
    }

    setErrors({});

    showModalLoading(true);

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
      updateUserWorks({
        works: { works: res.data.school.works, type: "school" },
      });
      props.onClose();
    } else console.log(res.err);
    showModalLoading(false);
  };

  const inputs = [
    {
      name: "subject",
      label: "מקצוע",
      value: subjectValue,
      onInput: () => setSubjectValue(subjectRef.current.value),
      ref: subjectRef,
      type: "text",
    },
    {
      name: "hours",
      label: "שעות",
      value: hoursValue,
      onInput: () => setHoursValue(hoursRef.current.value),
      ref: hoursRef,
      type: "number",
    },
  ];

  return (
    <>
      {modalLoading ? (
        modalLoading
      ) : (
        <Form className="work-form" dir="rtl" onSubmit={addWorkHandler}>
          <>
            {inputs.map((input, i) => (
              <Input
                key={i}
                errors={errors}
                name={input.name}
                label={input.label}
                value={input.value}
                onInput={input.onInput}
                ref={input.ref}
                type={input.type}
              />
            ))}
          </>

          <Form.Group className="mb-3" controlId="name">
            <Form.Label>תאריך</Form.Label>
            <DatePicker
              className="work-form__date form-control "
              minDate={tomorrow}
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

          <Button
            className="light-blue__btn work-form__btn form-btn"
            type="submit"
          >
            {work ? "עדכן" : "צור"}
          </Button>
        </Form>
      )}
    </>
  );
};
