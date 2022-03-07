import { useContext, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./Pages/Home";
import { SchoolWorks } from "./Pages/SchoolWorks";
import { SubWorks } from "./Pages/SubWorks";
import WorksContext from "./store/works-context";
import { Notifications } from "./Components/UI/Notifications";
import { httpRequest } from "./httpRequest";

export const SiteRoutes = () => {
  const ctx = useContext(WorksContext);
  const { updateType, updateNotifications, type, loading } = ctx;

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      updateType(user.type);
      if (user.type === "school") {
        const updateStorage = async () => {
          const res = await httpRequest(
            "post",
            "/school/works",
            {
              userId: user.school._id,
              email: user.school.email,
              type: "school",
            },
            { token: user.token }
          );

          if (res.data) {
            sessionStorage.setItem("user", JSON.stringify(res.data));
            updateNotifications(res.data.school.notifications);
          } else console.log(res.err);
        };

        updateStorage();
      }
    }
  }, [updateType, updateNotifications]);

  return (
    <Routes>
      <Route
        path="/"
        exact
        element={
          <>
            {type !== "guest" && !loading && (
              <Notifications notifications={4} />
            )}
            {type !== "school" ? <Home type={type} /> : <SchoolWorks />}
          </>
        }
      ></Route>
      {(type === "sub" ||
        (sessionStorage.getItem("user") &&
          JSON.parse(sessionStorage.getItem("user")).sub)) && (
        <>
          <Route
            path="/works"
            exact
            element={
              <>
                <Notifications notifications={4} />
                <SubWorks />
              </>
            }
          ></Route>
        </>
      )}
      <Route path="*" element={<Navigate to="/" />}></Route>
    </Routes>
  );
};
