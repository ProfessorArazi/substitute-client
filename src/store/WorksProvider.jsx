import { useCallback, useReducer } from "react";
import WorksContext from "./works-context";
import PacmanLoader from "react-spinners/PacmanLoader";
import { css } from "@emotion/react";

const override = css`
  display: block;
  margin: 10px auto;
`;

const defaultWorksState = {
  type: "guest",
  loading: false,
  works: [],
  closeWorks: [],
  waitingWorks: [],
  rejectedWorks: [],
  oldWorks: [],
  notifications: [],
  notificationsNumber: 0,
};

const worksReducer = (state, action) => {
  if (action.type === "ALL") {
    return {
      works: action.works,
      closeWorks: state.closeWorks,
      waitingWorks: state.waitingWorks,
      rejectedWorks: state.rejectedWorks,
      oldWorks: state.oldWorks,
      type: state.type,
      loading: state.loading,
      notifications: state.notifications,
      notificationsNumber: state.notificationsNumber,
    };
  }

  if (action.type === "UPDATE") {
    let closeWorks = [];
    let oldWorks = [];
    let waitingWorks = [];
    let rejectedWorks = [];
    const now = new Date().getTime();
    if (state.type === "school") {
      action.works.forEach((work) =>
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
      closeWorks: closeWorks,
      waitingWorks: waitingWorks,
      rejectedWorks: rejectedWorks,
      oldWorks: oldWorks,
      type: state.type,
      loading: state.loading,
      notifications: state.notifications,
      notificationsNumber: state.notificationsNumber,
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
      notifications: state.notifications,
      notificationsNumber: state.notificationsNumber,
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
    };
  }

  if (action.type === "LOADING") {
    return {
      loading:
        action.loading === true ? (
          <PacmanLoader color="goldenrod" loading={true} css={override} />
        ) : (
          false
        ),
      type: state.type,
      works: state.works,
      closeWorks: state.closeWorks,
      waitingWorks: state.waitingWorks,
      rejectedWorks: state.rejectedWorks,
      oldWorks: state.oldWorks,
      notifications: state.notifications,
      notificationsNumber: state.notificationsNumber,
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
    works: worksState.works,
    closeWorks: worksState.closeWorks,
    waitingWorks: worksState.waitingWorks,
    rejectedWorks: worksState.rejectedWorks,
    oldWorks: worksState.oldWorks,
    notifications: worksState.notifications,
    notificationsNumber: worksState.notificationsNumber,
    updateType: updateTypeHandler,
    updateAllWorks: updateAllWorksHandler,
    updateUserWorks: updateUserWorksHandler,
    showLoading: showLoadingHandler,
    updateNotifications: updateNotificationsHandler,
    updateNotificationsNumber: updateNotificationsNumberHandler,
  };

  return (
    <WorksContext.Provider value={worksContext}>
      {props.children}
    </WorksContext.Provider>
  );
};

export default CartProvider;