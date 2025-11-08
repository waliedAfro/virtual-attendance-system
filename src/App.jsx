import { useState } from "react";
import AddCompany from "./admin/pages/add-company";
import HomeAdmin from "./admin/pages/home-admin";
import SideMenu from "./menu/side_menu";
import TopNavbar from "./menu/top_nav_bar";
import SearchCompany from "./admin/pages/search-company";
import DeviceManagement from "./admin/pages/device-list";
import AddEmployee from "./admin/pages/add-employee";
import AddDepartmentManagement from "./admin/pages/add-department";
import Employee from "./client/pages/employee";
import DepartmentList from "./client/pages/department-list";
import LocationList from "./client/pages/location-list";
import AddDevice from "./admin/pages/add-device";
import AddLocation from "./admin/pages/add-location";

import "./App.css";

// Main App Component
function App() {
  const [sideMenuOpen, setSideMenuOpen] = useState(true);
  const [activeView, setActiveView] = useState("homeAdmin");

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  return (
    <div className="app">
      <TopNavbar toggleSideMenu={toggleSideMenu} />
      <div className="main-content">
        <SideMenu
          isOpen={sideMenuOpen}
          activeView={activeView}
          setActiveView={setActiveView}
        />
        <div className="content-area">
          {activeView === "home" && <HomeAdmin />}

          {activeView === "addCompany" && <AddCompany />}
          {activeView === "searchCompany" && <SearchCompany />}

          {activeView === "deviceManager" && <DeviceManagement />}
          {activeView === "addDevice" && <AddDevice />}
          {activeView === "addLocation" && <AddLocation />}
          {activeView === "addDepartment" && <AddDepartmentManagement />}

          {activeView === "addEmployee" && <AddEmployee />}

          {activeView === "addclientDepartment" && <DepartmentList />}
          {activeView == "addclientLocation" && <LocationList />}
          {activeView === "addClientEmployee" && <Employee />}
        </div>
      </div>
    </div>
  );
}

export default App;
