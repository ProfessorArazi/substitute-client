//
import { Sidebar } from "./Components/Layout/Sidebar";
import { SiteRoutes } from "./SiteRoutes";
import WorksProvider from "./store/WorksProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import "./scss/App.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Components/Layout/Footer";
import { Helmet } from "react-helmet";

function App() {
  return (<>
    <Helmet>
        <title>Substitutes</title>
      </Helmet>
    <WorksProvider>
      <ToastContainer />

      <div className="layout">
        <div className="body">
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
        <Footer />
      </div>
    </WorksProvider>
    </>
  );
}

export default App;
