import { useContext, useEffect, useCallback } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Home } from "./Pages/Home";
import { SchoolWorks } from "./Pages/SchoolWorks";
import { SubWorks } from "./Pages/SubWorks";
import WorksContext from "./store/works-context";
import { Notifications } from "./Components/UI/Notifications";
import { updateWorks } from "./Components/Works/updateWorks";
import { storageObject } from "./Components/Storage/storageObject";

export const SiteRoutes = () => {
  const ctx = useContext(WorksContext);
  const {
    updateType,
    updateNotifications,
    updateAllWorks,
    showLoading,
    type,
    loading,
  } = ctx;

  const updateAllWorksHandler = useCallback(
    (data) => {
      updateAllWorks(data.works);
      updateNotifications(data.sub.notifications);
      sessionStorage.setItem(
        "user",
        JSON.stringify(storageObject("sub", data))
      );
    },
    [updateAllWorks, updateNotifications]
  );

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      updateType(user.type);
    }
  }, [updateType, updateNotifications]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (user && user.type === "sub") {
      const updateHome = async () => {
        showLoading(true);
        const res = await updateWorks("/works");

        if (res.data) {
          updateAllWorksHandler(res.data);
          showLoading(false);
        } else {
          console.log(res.error);
        }
      };

      updateHome();
    }
  }, [updateAllWorksHandler, showLoading]);

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
            {type !== "school" ? (
              !loading ? (
                <Home type={type} />
              ) : (
                loading
              )
            ) : (
              <SchoolWorks />
            )}
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
