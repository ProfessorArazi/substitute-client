import { useState, useRef, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import validator from "validator";
import WorksContext from "../../store/works-context";
import { httpRequest } from "../../httpRequest";
import { storageObject } from "../Storage/storageObject";
import { resizeFile } from "../Images/resizeFile";

export const UserForm = (props) => {
  const { user } = props;
  const ctx = useContext(WorksContext);
  const { updateType, updateAllWorks, updateUserWorks, showLoading, loading } =
    ctx;

  const [files, setFiles] = useState([]);
  const [type, setType] = useState();
  const [nameValue, setNameValue] = useState(user ? user[user.type].name : "");
  const [cityValue, setCityValue] = useState(user ? user[user.type].city : "");
  const [phoneValue, setphoneValue] = useState(
    user ? user[user.type].phone : ""
  );

  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const cityRef = useRef();
  const phoneRef = useRef();

  const onImageChange = (e) => {
    setFiles(e.target.files);
  };

  const setUserInStorage = (data) => {
    if ((user && user.type === "school") || type === "school") {
      updateUserWorks({ works: { works: data.school.works, type: "school" } });
    }

    sessionStorage.setItem(
      "user",
      JSON.stringify(storageObject(user ? user.type : type, data))
    );
    updateType(user ? user.type : type);

    props.onClose();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let email;
    let password;
    if (!user) {
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

    if (!user) {
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
          if (!user) {
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
          } else if (user) {
            const data = {
              email: user[user.type].email,
              changes: {
                name,
                city,
                phone,
              },
              type: user.type,
            };
            user.type === "sub"
              ? (data.substituteId = user.sub._id)
              : (data.userId = user.school._id);

            const res = await httpRequest("put", `/${user.type}`, data, {
              token: user.token,
            });
            if (res.data) {
              if (user.type === "sub") updateAllWorks(res.data.works);
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
      {!type && !user ? (
        <div className="login-actions">
          <Button onClick={() => setType("sub")}>מורה מחליף</Button>
          <Button onClick={() => setType("school")}>בית ספר</Button>
        </div>
      ) : (
        <>
          {loading ? (
            loading
          ) : (
            <Form className="login-form" onSubmit={submitHandler}>
              {props.signup && (
                <>
                  {!user && (
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>תמונת פרופיל</Form.Label>
                      <Form.Control onChange={onImageChange} type="file" />
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>שם</Form.Label>
                    <Form.Control
                      value={nameValue}
                      onInput={() => setNameValue(nameRef.current.value)}
                      ref={nameRef}
                      type="text"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="city">
                    <Form.Label>עיר</Form.Label>
                    <Form.Control
                      value={cityValue}
                      onInput={() => setCityValue(cityRef.current.value)}
                      ref={cityRef}
                      type="text"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="טלפון">
                    <Form.Label>טלפון</Form.Label>
                    <Form.Control
                      value={phoneValue}
                      onInput={() => setphoneValue(phoneRef.current.value)}
                      dir="ltr"
                      ref={phoneRef}
                      type="text"
                    />
                  </Form.Group>
                </>
              )}
              <>
                {!user && (
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
