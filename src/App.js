import { useEffect } from "react";
import { Sidebar } from "./Components/Layout/Sidebar";
import { SiteRoutes } from "./SiteRoutes";
import WorksProvider from "./store/WorksProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./scss/App.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
/* 
todo:
1.notifications - finished
2.profile image - finished
3.update profile - finished
4.see profile - finished
5.work view
6.mailing list - finished
7.avoid clashes - finished
8.age group - finished
9.forms - finished
10. error handling - finished
11.styling
*/

function App() {
  useEffect(() => {
    axios(process.env.REACT_APP_SERVER);
    document.title = "Substitutes";
  }, []);

  return (
    <WorksProvider>
      <ToastContainer />
      <div className="layout">
        <Sidebar />
        <SiteRoutes />
      </div>
    </WorksProvider>
  );
}

export default App;
