import { Sidebar } from "./Components/Layout/Sidebar";
import { SiteRoutes } from "./SiteRoutes";
import WorksProvider from "./store/WorksProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./scss/App.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  return (
    <WorksProvider>
      <ToastContainer />

      <div className="layout">
        {window.innerWidth > 768 ? (
          <>
            <Sidebar />
            <SiteRoutes />
          </>
        ) : (
          <Sidebar>
            <SiteRoutes />
          </Sidebar>
        )}
      </div>
    </WorksProvider>
  );
}

export default App;
