import { useContext, useRef, useState, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import { Input } from "./Input";
import validator from "validator";
import { httpRequest } from "../../httpRequest";
import WorksContext from "../../store/works-context";
import { resizeFile } from "../Images/resizeFile";
import { storageObject } from "../Storage/storageObject";
import { toast } from "react-toastify";
import { updateWorks } from "../Works/updateWorks";

import "../../scss/App.scss";

export const UserForm = (props) => {
  const { user } = props;
  const ctx = useContext(WorksContext);
  const {
    updateType,
    updateAllWorks,
    updateUserWorks,
    showModalLoading,
    updateNotifications,
    modalLoading,
  } = ctx;

  const [files, setFiles] = useState([]);
  const [type, setType] = useState();
  const [nameValue, setNameValue] = useState(user ? user[user.type].name : "");
  const [cityValue, setCityValue] = useState(user ? user[user.type].city : "");
  const [phoneValue, setphoneValue] = useState(
    user ? user[user.type].phone : ""
  );
  const [ageGroupValue, setAgeGroupValue] = useState(
    user ? user[user.type].ageGroup : ""
  );
  const [mailingList, setMailingList] = useState(
    user ? user[user.type].mailingList : false
  );
  const [descValue, setDescValue] = useState(user ? user[user.type].desc : "");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const cityRef = useRef();
  const phoneRef = useRef();
  const descRef = useRef();
  const formRef = useRef();

  const onImageChange = (e) => {
    setFiles(e.target.files);
  };

  const updateUserWorksHandler = useCallback(
    (data, user) => {
      updateUserWorks({
        works: {
          works: [...data.sub.works],
          subId: user.sub._id,
        },
      });
      updateNotifications(data.sub.notifications);
      sessionStorage.setItem(
        "user",
        JSON.stringify(storageObject("sub", data))
      );
    },
    [updateUserWorks, updateNotifications]
  );

  const setUserInStorage = (data) => {
    let justLoggedIn = false;
    if (
      (user && user.type === "school") ||
      type === "school" ||
      data.type === "school"
    ) {
      updateUserWorks({ works: { works: data.school.works, type: "school" } });
      justLoggedIn = true;
    }

    sessionStorage.setItem(
      "user",
      JSON.stringify(
        storageObject(user ? user.type : data.type, data, justLoggedIn)
      )
    );
    updateType(user ? user.type : data.type);

    props.onClose();
  };

  const submitHandler = async (e) => {
    let demoType;

    if (typeof e === "string") {
      demoType = e;
    } else {
      e.preventDefault();
    }

    let email;
    let password;

    if (props.demo) {
      email = `demo${Math.floor(Math.random() * 100000)}@gmail.com`;
      password = `Name${Math.floor(Math.random() * 1000) + 100}!`;
    } else if (!user) {
      email = emailRef.current.value;
      password = passwordRef.current.value;
    }

    let name;
    let city;
    let phone;
    let ageGroup;
    let desc;
    let formErrors = {};

    if (props.signup) {
      if (props.demo) {
        name = "דמו";
        city = "רמת גן";
        phone = "0544444444";
      } else {
        name = nameRef.current.value;
        city = cityRef.current.value;
        phone = phoneRef.current.value;
      }

      if (
        type === "school" ||
        (user && user.type) === "school" ||
        demoType === "school"
      ) {
        ageGroup = ageGroupValue || "יסודי";
      } else {
        desc = descValue;
      }
    }

    if (!user) {
      if (!validator.isEmail(email)) {
        formErrors.email = true;
      }
      if (password.length <= 3) {
        formErrors.password = true;
      }
    }

    if (props.signup) {
      if (name.length < 2) {
        formErrors.name = true;
      }
      if (city.length < 2) {
        formErrors.city = true;
      }
      if (phone.length !== 10) {
        formErrors.phone = true;
      }

      // if (type === "school" || (user && user.type === "school")) {
      //   if (!["יסודי", "חטיבה", "תיכון"].includes(ageGroup)) {
      //     validForm = false;
      //   }
      // }

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return formRef.current.scrollIntoView({ behavior: "smooth" });
      }
      setErrors({});
      let img;
      if (files.length > 0) {
        img = await resizeFile(files[0]);
      }
      showModalLoading(true);
      if (!user) {
        const res = await httpRequest("post", `/${type || demoType}`, {
          img,
          email,
          password,
          name,
          city,
          phone,
          ageGroup,
          mailingList,
          desc,
          demo: props.demo ? true : false,
        });

        if (res.data) {
          setUserInStorage(res.data);
          if (type === "sub" || demoType === "sub") {
            updateAllWorks(res.data.works);

            const user = JSON.parse(sessionStorage.getItem("user"));
            updateUserWorksHandler(res.data, user);
          }
        } else {
          toast.error("האימייל שהוזן קיים במערכת", {
            autoClose: 1000,
            position: "top-left",
            theme: "colored",
            hideProgressBar: true,
          });
        }
        showModalLoading(false);
      } else if (user) {
        const data = {
          email: user[user.type].email,
          changes: {
            name,
            city,
            phone,
            mailingList,
          },
          type: user.type,
        };
        if (user.type === "sub") {
          data.substituteId = user.sub._id;
          data.changes.desc = desc;
        } else {
          data.userId = user.school._id;
          data.changes.ageGroup = ageGroup;
        }

        const res = await httpRequest("put", `/${user.type}`, data, {
          token: user.token,
        });
        if (res.data) {
          if (user.type === "sub") {
            updateAllWorks(res.data.works);
          }

          setUserInStorage(res.data);
        } else {
          console.log("פרטים לא נכונים");
        }
        showModalLoading(false);
      }
    } else {
      showModalLoading(true);
      const res = await httpRequest("post", `/${type}/login`, {
        email,
        password,
      });

      if (res.data) {
        setUserInStorage(res.data);
        showModalLoading(false);
        if (type === "sub") {
          updateAllWorks(res.data.works);
          const subWorks = await updateWorks("/sub/works");
          if (subWorks.data) {
            const user = JSON.parse(sessionStorage.getItem("user"));
            updateUserWorksHandler(subWorks.data, user);
          } else {
            console.log(res.error);
          }
        }
      } else {
        setErrorMessage("פרטים לא נכונים");
        showModalLoading(false);
      }
    }
  };

  const inputs = [
    {
      name: "name",
      label: "שם",
      value: nameValue,
      onInput: () => setNameValue(nameRef.current.value),
      ref: nameRef,
      type: "text",
    },
    {
      name: "city",
      label: "עיר",
      value: cityValue,
      onInput: () => setCityValue(cityRef.current.value),
      ref: cityRef,
      type: "text",
    },
    {
      name: "phone",
      label: "טלפון",
      value: phoneValue,
      onInput: () => setphoneValue(phoneRef.current.value),
      dir: "ltr",
      ref: phoneRef,
      type: "text",
    },
  ];

  const loginInputs = [
    {
      name: "email",
      label: "אימייל",
      ref: emailRef,
      type: "email",
      dir: "ltr",
    },
    {
      name: "password",
      label: "סיסמה",
      ref: passwordRef,
      type: "password",
      placeholder: props.signup && "לפחות 8 תווים",
      dir: "ltr",
      className: "password-desc",
    },
  ];

  return (
    <>
      {!type && !user ? (
        <div className="login-actions">
          <Button
            className="light-blue__btn"
            onClick={() => {
              setType("sub");
              props.demo && submitHandler("sub");
            }}
          >
            מורה מחליף
          </Button>
          <Button
            className="light-blue__btn"
            onClick={() => {
              setType("school");
              props.demo && submitHandler("school");
            }}
          >
            בית ספר
          </Button>
        </div>
      ) : (
        <>
          {modalLoading ? (
            modalLoading
          ) : props.demo ? (
            ""
          ) : (
            <Form ref={formRef} className="login-form" onSubmit={submitHandler}>
              {props.signup && (
                <>
                  {!user && type === "sub" && (
                    <Input
                      label="תמונת פרופיל"
                      type="file"
                      onChange={onImageChange}
                    />
                  )}

                  {inputs.map((input, i) => (
                    <Input
                      key={i}
                      errors={errors}
                      name={input.name}
                      label={input.label}
                      value={input.value}
                      onInput={input.onInput}
                      dir={input.dir && input.dir}
                      ref={input.ref}
                      type={input.type}
                    />
                  ))}
                </>
              )}
              <>
                {!user && (
                  <>
                    {loginInputs.map((input, i) => (
                      <Input
                        key={i}
                        errors={errors}
                        name={input.name}
                        label={input.label}
                        ref={input.ref}
                        type={input.type}
                        dir={input.dir}
                        placeholder={input.placeholder}
                        className={input.className}
                      />
                    ))}
                    {!props.signup && errorMessage.length > 0 && (
                      <div className="login-error">{errorMessage}</div>
                    )}
                  </>
                )}
                {((props.signup && type === "sub") ||
                  (user && user.type === "sub")) && (
                  <Input
                    errors={errors}
                    name="desc"
                    label="ספר קצת על עצמך"
                    value={descValue}
                    onInput={() => setDescValue(descRef.current.value)}
                    ref={descRef}
                    type="textarea"
                    rows={3}
                  />
                )}
                {((props.signup && type === "school") ||
                  (user && user.type === "school")) && (
                  <div onChange={(e) => setAgeGroupValue(e.target.value)}>
                    <input
                      type="radio"
                      value="יסודי"
                      name="age"
                      defaultChecked={ageGroupValue === "יסודי"}
                    />
                    {" יסודי"}
                    <br />
                    <input
                      type="radio"
                      value="חטיבה"
                      name="age"
                      defaultChecked={ageGroupValue === "חטיבה"}
                    />
                    {" חטיבה"}
                    <br />
                    <input
                      type="radio"
                      value="תיכון"
                      name="age"
                      defaultChecked={ageGroupValue === "תיכון"}
                    />
                    {" תיכון"}
                  </div>
                )}

                {props.signup && (
                  <Form.Check
                    className="check-email"
                    defaultChecked={mailingList}
                    onChange={(e) => setMailingList(e.target.checked)}
                    id="mailingList"
                    label="אני מעוניין לקבל עדכונים למייל "
                  />
                )}

                <Button className="light-blue__btn form-btn" type="submit">
                  {user ? "עדכן" : props.signup ? "הירשם" : "התחבר"}
                </Button>
              </>
            </Form>
          )}
        </>
      )}
    </>
  );
};
