import React, { useState } from "react";
import FormInput from "../../component/form-input";
import FormSelect from "../../component/form-select";
import FormTextarea from "../../component/form-textarea";
import "../../assets/css/admin/add-device.css";
import { deviceService } from "../../services/deviceService";
import { LocationService } from "../../services/locationService";

const AddLocation = () => {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    nameArabic: "",
    code: "",
    status: "Active",
    descip: "",
    deleteReason: "",
    companyId: null,
  });

  const [companySearch, setCompanySearch] = useState({
    open: false,
    searchTerm: "",
    filters: {},
    companies: [],
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    loading: false,
  });

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const searchCompanies = async (page = 0) => {
    setCompanySearch((prev) => ({ ...prev, loading: true }));
    try {
      const response = await deviceService.searchCompanies(
        {
          companyName: "",
          companyNameArabic: "",
          email: "",
          phone: "",
          companyId: 0,
          searchTerm: companySearch.searchTerm,
        },
        page,
        5
      );

      setCompanySearch((prev) => ({
        ...prev,
        companies: response.content,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        loading: false,
      }));
    } catch (error) {
      console.error("Error searching companies:", error);
      setCompanySearch((prev) => ({ ...prev, loading: false }));
      showNotification("Error searching companies", "error");
    }
  };

  const openCompanySearch = () => {
    setCompanySearch((prev) => ({ ...prev, open: true, searchTerm: "" }));
    searchCompanies(0);
  };

  const closeCompanySearch = () => {
    setCompanySearch((prev) => ({ ...prev, open: false }));
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setFormData((prev) => ({ ...prev, companyId: company.id }));
    closeCompanySearch();
  };

  const handleCompanySearchChange = (e) => {
    setCompanySearch((prev) => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleCompanySearchSubmit = (e) => {
    e.preventDefault();
    searchCompanies(0);
  };

  const handlePageChange = (page) => {
    searchCompanies(page - 1);
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      LocationService.createLocation(formData);
      showNotification("Device created successfully!", "success");

      // Reset form
      setFormData({
        id: 0,
        name: "",
        nameArabic: "",
        code: "",
        status: "Active",
        descip: "",
        deleteReason: "",
        companyId: null,
      });
      setSelectedCompany(null);
    } catch (error) {
      showNotification(
        "Error creating device: " + (error.response?.data || error.message),
        "error"
      );
    }
  };

  const renderPagination = () => {
    if (companySearch.totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= companySearch.totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${
            companySearch.currentPage + 1 === i ? "active" : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return <div className="pagination">{pages}</div>;
  };

  return (
    <div className="add-device-container">
      <div className="card">
        <div className="card-header">
          <h2>Add New Location</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="device-form">
            {/* Company Selection */}
            <div className="form-section">
              <h3>Company</h3>
              {selectedCompany ? (
                <div className="selected-company">
                  <div className="company-info">
                    <p>
                      <strong>Name:</strong> {selectedCompany.company}
                    </p>
                    <p>
                      <strong>Company Id:</strong> {selectedCompany.id}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedCompany.email}
                    </p>
                    {selectedCompany.phone && (
                      <p>
                        <strong>Phone:</strong> {selectedCompany.phone}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn-change"
                    onClick={() => {
                      setSelectedCompany(null);
                      setDeviceForm((prev) => ({ ...prev, id: null }));
                    }}
                  >
                    Change Company
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-select-company"
                  onClick={openCompanySearch}
                >
                  Select Company
                </button>
              )}
            </div>
            <div className="form-row">
              <FormInput
                className="form-group"
                label="Location"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Doha ... "
                required
              />
              <FormInput
                className="form-group"
                label="Location Code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="HQ01"
                required
                maxLength="5"
                style={{ textTransform: "uppercase" }}
              />
            </div>
            <div className="form-row">
              <FormInput
                className="form-group"
                label="Location (Arabic)"
                name="nameArabic"
                value={formData.nameArabic}
                onChange={handleInputChange}
                placeholder="الدوحة ... "
                dir="rtl"
              />
              <FormSelect
                className="form-group"
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
                options={[
                  { value: "Active", label: "Active" },
                  { value: "InActive", label: "Inactive" },
                ]}
              />
            </div>
            <div className="form-group">
              <FormTextarea
                className="form-group"
                label="Description"
                name="descrip"
                value={formData.descip}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any additional information about the Location..."
              />
            </div>

            <div className="form-actions">
              {!!selectedCompany && (
                <button type="submit" className="btn-primary">
                  Create Location
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Company Search Modal */}
      {companySearch.open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Select Company</h3>
              <button className="modal-close" onClick={closeCompanySearch}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={handleCompanySearchSubmit}
                className="search-form"
              >
                <FormInput
                  placeholder="Search by company name or code..."
                  value={companySearch.searchTerm}
                  onChange={handleCompanySearchChange}
                  className="search-input"
                />
                <button type="submit" className="btn-search">
                  Search
                </button>
              </form>

              {companySearch.loading ? (
                <div className="loading">Loading companies...</div>
              ) : (
                <>
                  <div className="company-list">
                    {companySearch.companies?.length === 0 ? (
                      <div className="no-results">No companies found</div>
                    ) : (
                      companySearch.companies?.map((company) => (
                        <div
                          key={company.id}
                          className="company-item"
                          onClick={() => handleCompanySelect(company)}
                        >
                          <div className="company-details">
                            <h4>{company.company}</h4>
                            <p>
                              <strong>Company ID:</strong> {company.id}
                            </p>
                            <p>
                              <strong>Email:</strong> {company.email}
                            </p>
                            {company.phone && (
                              <p>
                                <strong>Phone:</strong> {company.phone}
                              </p>
                            )}
                            <p>
                              <strong>Status:</strong>
                              <span
                                className={`status ${
                                  company.status ? "active" : "inactive"
                                }`}
                              >
                                {company.status ? "Active" : "Inactive"}
                              </span>
                            </p>
                          </div>
                          <button className="btn-select">Select</button>
                        </div>
                      ))
                    )}
                  </div>

                  {renderPagination()}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button
            className="notification-close"
            onClick={() =>
              setNotification({ show: false, message: "", type: "" })
            }
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AddLocation;
