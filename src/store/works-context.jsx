import React from "react";

const WorksContext = React.createContext({
  type: sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user")).type
    : "guest",
  loading: false,
  works: [],
  closeWorks: [],
  waitingWorks: [],
  rejectedWorks: [],
  oldWorks: [],
  notifications: [],
  notificationsNumber: 0,

  updateType: (type) => {},
  updateAllWorks: (works) => {},
  updateUserWorks: (user) => {},
  showLoading: (loading) => {},
  updateNotifications: (notifications) => {},
  updateNotificationsNumber: (number) => {},
});

export default WorksContext;
