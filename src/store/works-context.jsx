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
  profileImage:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/2048px-User_font_awesome.svg.png",

  updateType: (type) => {},
  updateAllWorks: (works) => {},
  updateUserWorks: (user) => {},
  showLoading: (loading) => {},
  showModalLoading: (loading) => {},
  updateNotifications: (notifications) => {},
  updateNotificationsNumber: (number) => {},
  showModal: (modal) => {},
  updateProfileImage: (src) => {},
});

export default WorksContext;
