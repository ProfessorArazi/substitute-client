import { useCallback, useReducer } from "react";
import WorksContext from "./works-context";
import PacmanLoader from "react-spinners/PacmanLoader";

const loadingstyle = {
  position: "fixed",
  top: "10%",
  left: "43%",
  transform: "translate(-50%, -50%)",
};

const modalLoadingstyle = {
  position: "fixed",
  top: "28%",
  left: "43%",
  transform: "translate(-50%, -50%)",
};

const defaultWorksState = {
  type: sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user")).type
    : "guest",
  loading: false,
  modalLoading: false,
  works: [],
  closeWorks: [],
  waitingWorks: [],
  rejectedWorks: [],
  oldWorks: [],
  notifications: [],
  notificationsNumber: 0,
  modal: false,
};

const worksReducer = (state, action) => {
  if (action.type === "ALL") {
    return {
      works: action.works.sort((a, b) => new Date(a.date) - new Date(b.date)),
      closeWorks: state.closeWorks,
      waitingWorks: state.waitingWorks,
      rejectedWorks: state.rejectedWorks,
      oldWorks: state.oldWorks,
      type: state.type,
      loading: state.loading,
      modalLoading: state.modalLoading,
      notifications: state.notifications,
      notificationsNumber: state.notificationsNumber,
      modal: state.modal,
    };
  }

  if (action.type === "UPDATE") {
    let closeWorks = [];
    let oldWorks = [];
    let waitingWorks = [];
    let rejectedWorks = [];
    const now = new Date().getTime();
    if (action.works.type === "school") {
      action.works.works.forEach((work) =>
        new Date(work.work.date).getTime() < now
          ? oldWorks.push(work.work)
          : closeWorks.push(work.work)
      );
    } else {
      action.works.works.forEach((work) => {
        const date = new Date(work.date).getTime();
        if (date < now) {
          if (work.taken._id === action.works.subId) {
            oldWorks.push(work);
          }
        } else if (work.taken._id === "") {
          waitingWorks.push(work);
        } else if (work.taken._id === action.works.subId) {
          closeWorks.push(work);
        } else {
          rejectedWorks.push(work);
        }
      });
    }

    return {
      works: state.works,
      closeWorks: closeWorks.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      ),
      waitingWorks: waitingWorks.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      ),
      rejectedWorks: rejectedWorks.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      ),
      oldWorks: oldWorks.sort((a, b) => new Date(b.date) - new Date(a.date)),
      type: state.type,
      loading: state.loading,
      modalLoading: state.modalLoading,
      notifications: state.notifications,
      notificationsNumber: state.notificationsNumber,
      modal: state.modal,
    };
  }

  if (action.type === "TYPE") {
    return {
      type: action.user,
      works: state.works,
      closeWorks: state.closeWorks,
      waitingWorks: state.waitingWorks,
      rejectedWorks: state.rejectedWorks,
      oldWorks: state.oldWorks,
      loading: state.loading,
      modalLoading: state.modalLoading,
      notifications: state.notifications,
      notificationsNumber: state.notificationsNumber,
      modal: state.modal,
    };
  }
  if (action.type === "NOTIFICATION") {
    return {
      notifications: action.notifications,
      notificationsNumber: action.notifications.length,
      type: state.type,
      works: state.works,
      closeWorks: state.closeWorks,
      waitingWorks: state.waitingWorks,
      rejectedWorks: state.rejectedWorks,
      oldWorks: state.oldWorks,
      loading: state.loading,
      modalLoading: state.modalLoading,
      modal: state.modal,
    };
  }

  if (action.type === "NUMBER") {
    return {
      notifications: state.notifications,
      notificationsNumber: action.number,
      type: state.type,
      works: state.works,
      closeWorks: state.closeWorks,
      waitingWorks: state.waitingWorks,
      rejectedWorks: state.rejectedWorks,
      oldWorks: state.oldWorks,
      loading: state.loading,
      modalLoading: state.modalLoading,
      modal: state.modal,
    };
  }

  if (action.type === "LOADING") {
    return {
      loading:
        action.loading === true ? (
          <div style={loadingstyle}>
            <PacmanLoader color="goldenrod" loading={true} />
          </div>
        ) : (
          false
        ),
      modalLoading: state.modalLoading,
      type: state.type,
      works: state.works,
      closeWorks: state.closeWorks,
      waitingWorks: state.waitingWorks,
      rejectedWorks: state.rejectedWorks,
      oldWorks: state.oldWorks,
      notifications: state.notifications,
      notificationsNumber: state.notificationsNumber,
      modal: state.modal,
    };
  }

  if (action.type === "MODALLOADING") {
    return {
      modalLoading:
        action.loading === true ? (
          <div style={modalLoadingstyle}>
            <PacmanLoader color="goldenrod" loading={true} />
          </div>
        ) : (
          false
        ),
      loading: state.loading,
      type: state.type,
      works: state.works,
      closeWorks: state.closeWorks,
      waitingWorks: state.waitingWorks,
      rejectedWorks: state.rejectedWorks,
      oldWorks: state.oldWorks,
      notifications: state.notifications,
      notificationsNumber: state.notificationsNumber,
      modal: state.modal,
    };
  }

  if (action.type === "MODAL") {
    return {
      modal: action.modal,
      notifications: state.notifications,
      notificationsNumber: action.number,
      type: state.type,
      works: state.works,
      closeWorks: state.closeWorks,
      waitingWorks: state.waitingWorks,
      rejectedWorks: state.rejectedWorks,
      oldWorks: state.oldWorks,
      loading: state.loading,
      modalLoading: state.modalLoading,
    };
  }

  return defaultWorksState;
};

const CartProvider = (props) => {
  const [worksState, dispatchWorksAction] = useReducer(
    worksReducer,
    defaultWorksState
  );

  const updateAllWorksHandler = useCallback((works) => {
    dispatchWorksAction({
      type: "ALL",
      works: works,
    });
  }, []);

  const updateUserWorksHandler = useCallback((user) => {
    dispatchWorksAction({
      type: "UPDATE",
      works: user.works,
    });
  }, []);

  const updateTypeHandler = useCallback((user) => {
    dispatchWorksAction({
      type: "TYPE",
      user: user,
    });
  }, []);

  const showLoadingHandler = useCallback((loading) => {
    dispatchWorksAction({
      type: "LOADING",
      loading: loading,
    });
  }, []);

  const showModalLoadingHandler = useCallback((loading) => {
    dispatchWorksAction({
      type: "MODALLOADING",
      loading: loading,
    });
  }, []);

  const showModalHandler = useCallback((modal) => {
    dispatchWorksAction({
      type: "MODAL",
      modal: modal,
    });
  }, []);

  const updateNotificationsHandler = useCallback((notifications) => {
    dispatchWorksAction({
      type: "NOTIFICATION",
      notifications: notifications,
    });
  }, []);

  const updateNotificationsNumberHandler = useCallback((number) => {
    dispatchWorksAction({
      type: "NUMBER",
      number: number,
    });
  }, []);

  const worksContext = {
    type: worksState.type,
    loading: worksState.loading,
    modalLoading: worksState.modalLoading,
    works: worksState.works,
    closeWorks: worksState.closeWorks,
    waitingWorks: worksState.waitingWorks,
    rejectedWorks: worksState.rejectedWorks,
    oldWorks: worksState.oldWorks,
    notifications: worksState.notifications,
    notificationsNumber: worksState.notificationsNumber,
    modal: worksState.modal,
    updateType: updateTypeHandler,
    updateAllWorks: updateAllWorksHandler,
    updateUserWorks: updateUserWorksHandler,
    showLoading: showLoadingHandler,
    showModalLoading: showModalLoadingHandler,
    updateNotifications: updateNotificationsHandler,
    updateNotificationsNumber: updateNotificationsNumberHandler,
    showModal: showModalHandler,
  };

  return (
    <WorksContext.Provider value={worksContext}>
      {props.children}
    </WorksContext.Provider>
  );
};

export default CartProvider;
