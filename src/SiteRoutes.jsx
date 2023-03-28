import { useContext, useEffect, useCallback } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Home } from "./Pages/Home";
import { SchoolWorks } from "./Pages/SchoolWorks";
import { SubWorks } from "./Pages/SubWorks";
import WorksContext from "./store/works-context";
import { Notifications } from "./Components/UI/Notifications";
import { updateWorks } from "./Components/Works/updateWorks";
import { storageObject } from "./Components/Storage/storageObject";
import Modal from "./Components/UI/Modal";
import axios from "axios";
import { useState } from "react";

export const SiteRoutes = () => {
  const { pathname } = useLocation();
  const ctx = useContext(WorksContext);
  const {
    updateType,
    updateNotifications,
    updateAllWorks,
    updateUserWorks,
    showLoading,
    type,
    loading,
    modal,
    showModal,
  } = ctx;

  const [cities, setCities] = useState([]);

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

  const updateUserWorksHandler = useCallback(
    (data, user) => {
      updateUserWorks({
        works: {
          works: [...data.sub.works],
          subId: user.sub._id,
        },
      });
    },
    [updateUserWorks]
  );

  useEffect(() => {
    axios("https://data.gov.il/api/3/action/datastore_search", {
      params: {
        resource_id: "d4901968-dad3-4845-a9b0-a57d027f11ab",
        limit: 10000,
      },
    })
      .then((res) => {
        setCities(
          res.data.result.records.map((city) => {
            return {
              ...city,
              שם_ישוב: city["שם_ישוב"].replace(/יישוב|[()]|שבט/g, ""),
            };
          })
        );
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      updateType(user.type);
    }
  }, [updateType]);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.type === "sub") {
      const updateHome = async () => {
        showLoading(true);
        const res = await updateWorks(
          `${pathname === "/works" ? "/sub" : ""}/works`
        );

        if (res.data) {
          pathname === "/works"
            ? updateUserWorksHandler(res.data, user)
            : updateAllWorksHandler(res.data);
          showLoading(false);
        } else {
          console.log(res.error);
        }
      };

      updateHome();
    }
  }, [updateAllWorksHandler, updateUserWorksHandler, showLoading]);

  return (
    <>
      {!loading && <Notifications guest={type === "guest"} />}
      <Routes>
        <Route
          path="/"
          exact
          element={
            <>
              {type !== "school" ? (
                !loading ? (
                  <Home cities={cities} />
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
                  <SubWorks />
                </>
              }
            ></Route>
          </>
        )}
        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
      {modal && (
        <Modal
          onClose={() => {
            showModal(false);
          }}
        >
          {modal}
        </Modal>
      )}
    </>
  );
};
