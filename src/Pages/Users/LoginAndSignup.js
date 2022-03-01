import { useState, useRef, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import validator from "validator";
import axios from "axios";
import WorksContext from "../../store/works-context";

export const LoginAndSignup = (props) => {
  const ctx = useContext(WorksContext);
  const { updateType, updateAllWorks } = ctx;

  const [type, setType] = useState();
  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const cityRef = useRef();
  const phoneRef = useRef();

  const setUserInStorage = (data) => {
    updateType(type);
    sessionStorage.setItem("user", JSON.stringify(data));
    props.onClose();
  };

  const loginOrSignupHandler = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    let name;
    let city;
    let phone;

    if (props.signup) {
      name = nameRef.current.value;
      city = cityRef.current.value;
      phone = phoneRef.current.value;
    }

    let validForm = true;

    if (!validator.isEmail(email) || password.length <= 3) {
      validForm = false;
    }

    if (validForm) {
      if (props.signup) {
        if (name.length < 2 || city.length < 2 || phone.length !== 10) {
          validForm = false;
        }
        if (validForm) {
          axios
            .post(`${process.env.REACT_APP_SERVER}/${type}`, {
              email,
              password,
              name,
              city,
              phone,
            })
            .then((res) => {
              setUserInStorage(res.data);
            })
            .catch((err) => console.log(err));
        }
      } else {
        axios
          .post(`${process.env.REACT_APP_SERVER}/${type}/login`, {
            email,
            password,
          })
          .then((res) => {
            if (type === "sub") updateAllWorks(res.data.sub.works);

            setUserInStorage(res.data[type]);
          })
          .catch((err) => console.log(err));
      }
    }
  };

  return (
    <>
      {!type ? (
        <div className="login-actions">
          <Button onClick={() => setType("sub")}>מורה מחליף</Button>
          <Button onClick={() => setType("school")}>בית ספר</Button>
        </div>
      ) : (
        <Form className="login-form" onSubmit={loginOrSignupHandler}>
          {props.signup && (
            <>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>שם</Form.Label>
                <Form.Control ref={nameRef} type="text" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="city">
                <Form.Label>עיר</Form.Label>
                <Form.Control ref={cityRef} type="text" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="טלפון">
                <Form.Label>טלפון</Form.Label>
                <Form.Control dir="ltr" ref={phoneRef} type="text" />
              </Form.Group>
            </>
          )}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>אימייל</Form.Label>
            <Form.Control dir="ltr" ref={emailRef} type="email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>סיסמה</Form.Label>
            <Form.Control dir="ltr" ref={passwordRef} type="password" />
          </Form.Group>

          <Button type="submit">Submit</Button>
        </Form>
      )}
    </>
  );
};
