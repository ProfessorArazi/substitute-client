import { useReducer } from "react";
import WorksContext from "./works-context";
const defaultWorksState = {
  type: "guest",
  works: [],
  closeWorks: [],
  waitingWorks: [],
  rejectedWorks: [],
  oldWorks: [],
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
        const date = new Date(work.work.date).getTime();
        if (date < now) {
          if (work.work.taken === action.works.subId) {
            oldWorks.push(work.work);
          }
        } else if (work.work.taken === "") {
          waitingWorks.push(work.work);
        } else if (work.work.taken === action.works.subId) {
          closeWorks.push(work.work);
        } else {
          rejectedWorks.push(work.work);
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
    };
  }

  return defaultWorksState;
};

const CartProvider = (props) => {
  const [worksState, dispatchWorksAction] = useReducer(
    worksReducer,
    defaultWorksState
  );

  const updateAllWorksHandler = (works) => {
    dispatchWorksAction({
      type: "ALL",
      works: works,
    });
  };

  const updateUserWorksHandler = (user) => {
    dispatchWorksAction({
      type: "UPDATE",
      works: user.works,
    });
  };

  const updateTypeHandler = (user) => {
    dispatchWorksAction({
      type: "TYPE",
      user: user,
    });
  };

  const worksContext = {
    type: worksState.type,
    works: worksState.works,
    closeWorks: worksState.closeWorks,
    waitingWorks: worksState.waitingWorks,
    rejectedWorks: worksState.rejectedWorks,
    oldWorks: worksState.oldWorks,
    updateType: updateTypeHandler,
    updateAllWorks: updateAllWorksHandler,
    updateUserWorks: updateUserWorksHandler,
  };

  return (
    <WorksContext.Provider value={worksContext}>
      {props.children}
    </WorksContext.Provider>
  );
};

export default CartProvider;
