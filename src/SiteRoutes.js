import { useEffect, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./Pages/Home";
import { SchoolWorks } from "./Pages/SchoolWorks";
import { SubWorks } from "./Pages/SubWorks";
import WorksContext from "./store/works-context";
import { httpRequest } from "./httpRequest";

export const SiteRoutes = () => {
  const ctx = useContext(WorksContext);
  const { updateAllWorks, updateType, type } = ctx;

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      updateType(user.type);
      if (user.type === "sub") {
        const updateWorks = async () => {
          // showLoading(true);
          const res = await httpRequest("get", `/works/${user.sub._id}`);
          if (res.data) {
            updateAllWorks(res.data.works);
          } else {
            console.log(res.error);
          }
          // showLoading(false);
        };

        updateWorks();
      }
    }
  }, [updateAllWorks, updateType]);

  return (
    <Routes>
      <Route
        path="/"
        exact
        element={type !== "school" ? <Home type={type} /> : <SchoolWorks />}
      ></Route>
      {(type === "sub" ||
        (sessionStorage.getItem("user") &&
          JSON.parse(sessionStorage.getItem("user")).sub)) && (
        <>
          <Route path="/works" exact element={<SubWorks />}></Route>
        </>
      )}
      <Route path="*" element={<Navigate to="/" />}></Route>
    </Routes>
  );
};
