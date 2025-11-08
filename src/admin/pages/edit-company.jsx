import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faBuilding,
  faMapMarkerAlt,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import EditCompanyAddressTab from "./company-wedget/edit-company-address-tab";
import EditCompanyContactPersonTab from "./company-wedget/edit-company-contact-person-tab";
import EditCompanyBasicTab from "./company-wedget/edit-company-basic-tab";
import { companyService } from "../../services/companyService";

const EditCompany = ({ company, onClose, mode = "modal" }) => {
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

  const handleEditBasicData = async (basicData) => {
    try {
      await companyService.updateCompany(basicData.id, basicData);
      return true;
    } catch (error) {
      console.error("Failed to update Company Basic Info:", error);

      return false;
    }
  };

  const handleEditAddressData = async (address) => {
    try {
      await companyService.updateCompanyAddress(address);
      return true;
    } catch (error) {
      console.error("Failed to update Company Address:", error);

      return false;
    }
  };

  const handleEditContact = async (contact) => {
    try {
      await companyService.updateCompanyContact(contact);
      return true;
    } catch (error) {
      console.error("Failed to update Company Contact:", error);

      return false;
    }
  };

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
            {activeTab === "basic" && (
              <EditCompanyBasicTab
                company={company}
                handleEditBasicData={handleEditBasicData}
              />
            )}
            {activeTab === "address" && (
              <EditCompanyAddressTab
                addressess={company?.addresses}
                handleEditAddressData={handleEditAddressData}
              />
            )}
            {activeTab === "contact" && (
              <EditCompanyContactPersonTab
                contacts={company?.contacts}
                handleEditContact={handleEditContact}
              />
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
export default EditCompany;
