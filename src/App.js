import { Sidebar } from "./Pages/Layout/Sidebar";
import { SiteRoutes } from "./SiteRoutes";
import WorksProvider from "./store/WorksProvider";
import "./scss/App.scss";

/* 
todo:
1.notifications - finished
2.profile image - finished
3.update profile
4.see profile - finished
5.work view
6.mailing list
7.avoid clashes - finished
8.age group
9. error handling
10.styling
*/

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
