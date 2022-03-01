import React from "react";

const WorksContext = React.createContext({
  type: "guest",
  works: [],
  closeWorks: [],
  waitingWorks: [],
  rejectedWorks: [],
  oldWorks: [],

  updateType: (type) => {},
  updateAllWorks: (works) => {},
  updateUserWorks: (user) => {},
});

export default WorksContext;
