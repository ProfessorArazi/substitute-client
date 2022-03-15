import { useState, useRef, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import validator from "validator";
import WorksContext from "../../store/works-context";
import { httpRequest } from "../../httpRequest";
import { storageObject } from "../Storage/storageObject";
import { resizeFile } from "../Images/resizeFile";

export const UserForm = (props) => {
  const ctx = useContext(WorksContext);
  const { updateType, updateAllWorks, updateUserWorks, showLoading, loading } =
    ctx;

  const [files, setFiles] = useState([]);
  const [type, setType] = useState();

  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const cityRef = useRef();
  const phoneRef = useRef();

  const onImageChange = (e) => {
    setFiles(e.target.files);
  };

  const setUserInStorage = (data) => {
    if ((props.user && props.user.type === "school") || type === "school") {
      updateUserWorks({ works: { works: data.school.works, type: "school" } });
    }

    sessionStorage.setItem(
      "user",
      JSON.stringify(storageObject(props.user ? props.user.type : type, data))
    );
    updateType(props.user ? props.user.type : type);

    props.onClose();
  };

  const loginOrSignupHandler = async (e) => {
    e.preventDefault();
    let email;
    let password;
    if (!props.user) {
      email = emailRef.current.value;
      password = passwordRef.current.value;
    }

    let name;
    let city;
    let phone;

    if (props.signup) {
      name = nameRef.current.value;
      city = cityRef.current.value;
      phone = phoneRef.current.value;
    }

    let validForm = true;

    if (!props.user) {
      if (!validator.isEmail(email) || password.length <= 3) {
        validForm = false;
      }
    }

    if (validForm) {
      if (props.signup) {
        if (name.length < 2 || city.length < 2 || phone.length !== 10) {
          validForm = false;
        }
        if (validForm) {
          let img;
          if (files.length > 0) {
            img = await resizeFile(files[0]);
          }
          showLoading(true);
          if (!props.user) {
            const res = await httpRequest("post", `/${type}`, {
              img,
              email,
              password,
              name,
              city,
              phone,
            });

            if (res.data) {
              if (type === "sub") updateAllWorks(res.data.works);
              setUserInStorage(res.data);
            } else {
              console.log(res.err);
            }
            showLoading(false);
          } else if (props.user) {
            const data = {
              email: props.user[props.user.type].email,
              changes: {
                name,
                city,
                phone,
              },
              type: props.user.type,
            };
            props.user.type === "sub"
              ? (data.substituteId = props.user.sub._id)
              : (data.userId = props.user.school._id);

            const res = await httpRequest("put", `/${props.user.type}`, data, {
              token: props.user.token,
            });
            if (res.data) {
              if (props.user.type === "sub") updateAllWorks(res.data.works);
              setUserInStorage(res.data);
            } else {
              console.log(res.err);
            }
            showLoading(false);
          }
        }
      } else {
        showLoading(true);
        const res = await httpRequest("post", `/${type}/login`, {
          email,
          password,
        });

        if (res.data) {
          if (type === "sub") updateAllWorks(res.data.works);

          setUserInStorage(res.data);
          showLoading(false);
        } else {
          console.log(res.err);
          showLoading(false);
        }
      }
    }
  };

  return (
    <>
      {!type && !props.user ? (
        <div className="login-actions">
          <Button onClick={() => setType("sub")}>מורה מחליף</Button>
          <Button onClick={() => setType("school")}>בית ספר</Button>
        </div>
      ) : (
        <>
          {loading ? (
            loading
          ) : (
            <Form className="login-form" onSubmit={loginOrSignupHandler}>
              {props.signup && (
                <>
                  {!props.user && (
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>תמונת פרופיל</Form.Label>
                      <Form.Control onChange={onImageChange} type="file" />
                    </Form.Group>
                  )}

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
              <>
                {!props.user && (
                  <>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>אימייל</Form.Label>
                      <Form.Control dir="ltr" ref={emailRef} type="email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>סיסמה</Form.Label>
                      <Form.Control
                        dir="ltr"
                        ref={passwordRef}
                        type="password"
                      />
                    </Form.Group>
                  </>
                )}
                <Button type="submit">Submit</Button>
              </>
            </Form>
          )}
        </>
      )}
    </>
  );
};
