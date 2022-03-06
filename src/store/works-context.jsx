import React from "react";

const WorksContext = React.createContext({
  type: "guest",
  loading: false,
  works: [],
  closeWorks: [],
  waitingWorks: [],
  rejectedWorks: [],
  oldWorks: [],

  updateType: (type) => {},
  updateAllWorks: (works) => {},
  updateUserWorks: (user) => {},
  showLoading: (loading) => {},
});

export default WorksContext;
