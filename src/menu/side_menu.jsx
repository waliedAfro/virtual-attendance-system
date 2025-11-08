import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faSearch,
  faPlus,
  faChartBar,
  faCog,
  faQuestionCircle,
  faHome,
  faUserPlus,
  faBuilding,
  faLocationCrosshairs,
  faPeopleRoof,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";

import "../assets/css/menu/menu.css";

// Side Menu Component
const SideMenue = ({ isOpen, activeView, setActiveView }) => {
  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`}>
      <div className="menu-items">
        <div
          className={`menu-item ${activeView === "home" ? "active" : ""}`}
          onClick={() => setActiveView("home")}
        >
          <FontAwesomeIcon icon={faHome} /> Home
        </div>

        {/* Divider between Home and Company */}
        <div className="menu-divider"></div>

        <div
          className={`menu-item ${activeView === "addCompany" ? "active" : ""}`}
          onClick={() => setActiveView("addCompany")}
        >
          <FontAwesomeIcon icon={faPlusCircle} /> Add Company
        </div>

        <div
          className={`menu-item ${
            activeView === "searchCompany" ? "active" : ""
          }`}
          onClick={() => setActiveView("searchCompany")}
        >
          <FontAwesomeIcon icon={faSearch} /> Search Company
        </div>

        {/* Divider between Company and Device sections */}
        <div className="menu-divider"></div>

        <div
          className={`menu-item ${
            activeView === "deviceManager" ? "active" : ""
          }`}
          onClick={() => setActiveView("deviceManager")}
        >
          <FontAwesomeIcon icon={faBuilding} /> Device Manager
        </div>

        <div
          className={`menu-item ${activeView === "addDevice" ? "active" : ""}`}
          onClick={() => setActiveView("addDevice")}
        >
          <FontAwesomeIcon icon={faPlusCircle} /> Add Device
        </div>

        <div
          className={`menu-item ${
            activeView === "addLocation" ? "active" : ""
          }`}
          onClick={() => setActiveView("addLocation")}
        >
          <FontAwesomeIcon icon={faLocationCrosshairs} /> Add Location
        </div>

        <div
          className={`menu-item ${
            activeView === "addDepartment" ? "active" : ""
          }`}
          onClick={() => setActiveView("addDepartment")}
        >
          <FontAwesomeIcon icon={faPeopleRoof} /> Add Department
        </div>

        {/* Divider between Device and Employee sections */}
        <div className="menu-divider"></div>

        <div
          className={`menu-item ${
            activeView === "addEmployee" ? "active" : ""
          }`}
          onClick={() => setActiveView("addEmployee")}
        >
          <FontAwesomeIcon icon={faUserGroup} /> Employee Manger
        </div>

        <div
          className={`menu-item ${
            activeView === "searchEmployee" ? "active" : ""
          }`}
          onClick={() => setActiveView("searchEmployee")}
        >
          <FontAwesomeIcon icon={faSearch} /> Search
        </div>

        {/* Divider between Employee and Department sections */}
        <div className="menu-divider"></div>

        <div
          className={`menu-item ${
            activeView === "addclientDepartment" ? "active" : ""
          }`}
          onClick={() => setActiveView("addclientDepartment")}
        >
          <FontAwesomeIcon icon={faPeopleRoof} /> Add Department
        </div>

        <div
          className={`menu-item ${
            activeView === "addclientLocation" ? "active" : ""
          }`}
          onClick={() => setActiveView("addclientLocation")}
        >
          <FontAwesomeIcon icon={faLocationCrosshairs} /> Add Location
        </div>

        <div
          className={`menu-item ${
            activeView === "addClientDevice" ? "active" : ""
          }`}
          onClick={() => setActiveView("addClientDevice")}
        >
          <FontAwesomeIcon icon={faBuilding} /> Device Manager
        </div>

        <div
          className={`menu-item ${
            activeView === "addClientEmployee" ? "active" : ""
          }`}
          onClick={() => setActiveView("addClientEmployee")}
        >
          <FontAwesomeIcon icon={faUserPlus} /> Employee
        </div>

        {/* Divider between Device and Report */}
        <div className="menu-divider"></div>

        <div className="menu-item">
          <FontAwesomeIcon icon={faChartBar} /> Reports
        </div>
        <div className="menu-item">
          <FontAwesomeIcon icon={faCog} /> Settings
        </div>

        <div className="menu-item">
          <FontAwesomeIcon icon={faQuestionCircle} /> Help
        </div>
      </div>
    </div>
  );
};

export default SideMenue;
