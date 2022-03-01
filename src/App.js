import { Sidebar } from "./Pages/Layout/Sidebar";
import { SiteRoutes } from "./SiteRoutes";
import WorksProvider from "./store/WorksProvider";
import "./scss/App.scss";

function App() {
  return (
    <WorksProvider>
      <div className="layout">
        <Sidebar />

        <SiteRoutes />
      </div>
    </WorksProvider>
  );
}

export default App;
