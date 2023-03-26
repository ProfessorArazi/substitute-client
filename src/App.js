//
import { Sidebar } from "./Components/Layout/Sidebar";
import { SiteRoutes } from "./SiteRoutes";
import WorksProvider from "./store/WorksProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./scss/App.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
