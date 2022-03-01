import { useEffect, useContext, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./Pages/Home";
import { SchoolWorks } from "./Pages/SchoolWorks";
import { SubWorks } from "./Pages/SubWorks";
import WorksContext from "./store/works-context";
import axios from "axios";

export const SiteRoutes = () => {
  const ctx = useContext(WorksContext);
  const { updateAllWorks, updateType, type } = ctx;

  const user = JSON.parse(sessionStorage.getItem("user"));

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (user) {
      updateType(user.type);
      if (user.type === "sub") {
        console.log("hey");
        setIsLoading(true);
        axios(
          `${process.env.REACT_APP_SERVER}/works/${user ? user.sub._id : "!"}`
        )
          .then((res) => {
            updateAllWorks(res.data.works);
            setIsLoading(false);
          })
          .catch((err) => console.log(err));
      }
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        exact
        element={
          type !== "school" && isLoading ? (
            <p>Loading...</p>
          ) : type !== "school" ? (
            <Home type={type} />
          ) : (
            <SchoolWorks />
          )
        }
      ></Route>
      {type !== "guest" && (
        <>
          <Route
            path="/works"
            exact
            element={type === "school" ? <SchoolWorks /> : <SubWorks />}
          ></Route>
        </>
      )}
      <Route path="*" element={<Navigate to="/" />}></Route>
    </Routes>
  );
};
