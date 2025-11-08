import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faBuilding,
  faMapMarkerAlt,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import ViewCompanyBasicTab from "./company-wedget/view-company-basic-tab";
import ViewCompanyAddress from "./company-wedget/view-comapny-address-tab";
import ViewCompanyContactTab from "./company-wedget/view-company-contact-tab";

const ViewCompany = ({ company, onClose, mode = "modal" }) => {
  const [activeTab, setActiveTab] = useState("basic");

  const tabIcon = {
    faBuilding,
    faMapMarkerAlt,
    faUserTie,
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: "faBuilding" },
    { id: "address", label: "Address", icon: "faMapMarkerAlt" },
    { id: "contact", label: "Contact", icon: "faUserTie" },
  ];

  if (!company) return null;

  return (
    <div className={`view-company ${mode}`}>
      {mode === "modal" && (
        <div className="modal-header">
          <div className="header-content">
            <h2>{company.company}</h2>
            {company.companyArabic && (
              <p className="company-arabic">{company.companyArabic}</p>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      <div className="tabs-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <FontAwesomeIcon icon={tabIcon[tab.icon]} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-content">
        <div className="tab-content-inner">
          <div className="tab-panel">
            {activeTab === "basic" && <ViewCompanyBasicTab company={company} />}
            {activeTab === "address" && (
              <ViewCompanyAddress addressess={company?.addresses} />
            )}
            {activeTab === "contact" && (
              <ViewCompanyContactTab contacts={company?.contacts} />
            )}
            {activeTab === "documents" && (
              <div className="documents-tab">
                <h3>Company Documents</h3>
                <p>Documents content goes here...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewCompany;
