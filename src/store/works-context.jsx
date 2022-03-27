import React from "react";

const WorksContext = React.createContext({
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

  updateType: (type) => {},
  updateAllWorks: (works) => {},
  updateUserWorks: (user) => {},
  showLoading: (loading) => {},
  showModalLoading: (loading) => {},
  updateNotifications: (notifications) => {},
  updateNotificationsNumber: (number) => {},
  showModal: (modal) => {},
});

export default WorksContext;
