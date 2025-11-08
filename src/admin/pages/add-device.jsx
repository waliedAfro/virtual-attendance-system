import React, { useState } from "react";
import FormInput from "../../component/form-input";
import FormSelect from "../../component/form-select";
import FormTextarea from "../../component/form-textarea";
import "../../assets/css/admin/add-device.css";
import { deviceService } from "../../services/deviceService";
import { LocationService } from "../../services/locationService";
import { faLariSign } from "@fortawesome/free-solid-svg-icons";

const AddDevice = () => {
  const [locationList, setLocationList] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  const getlocations = async (companyId) => {
    try {
      if (!companyId) {
        setLocationList([]);
        return;
      }
      const response = await LocationService.getLocationsByCompany(companyId);
      setLocationList(response.data);
      setIsLoadingLocations(true);
    } catch (error) {
      console.error("❌ Error fetching locations:", error);
      showNotification("Error retrieving locations: " + error.message, "error");
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const [deviceForm, setDeviceForm] = useState({
    id: 0,
    deviceName: "",
    deviceType: "",
    deviceCode: "",
    serialNumber: "",
    uuid: "",
    deviceStatus: "ACTIVE",
    latitude: 0,
    longitude: 0,
    altitude: 0,
    accuracy: 0,
    radiusMeters: 0,
    companyId: null,
    locationId: null,
    status: false,
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

  const deviceTypes = ["IPS TERMINAL", "QR TERMINAL", "VIRTUAL TERMINAL"];
  const deviceStatuses = ["ACTIVE", "INACTIVE", "MAINTENANCE", "RETIRED"];

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setDeviceForm((prev) => ({
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

  const handleCompanySelect = async (company) => {
    setSelectedCompany(company);
    setDeviceForm((prev) => ({ ...prev, companyId: company.id }));
    getlocations(company.id);
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
      // Convert empty strings to null for number fields

      deviceForm.companyId = selectedCompany.id;
      console.log(deviceForm);

      await deviceService.createDevice(deviceForm);
      showNotification("Device created successfully!", "success");

      // Reset form
      setDeviceForm({
        id: 0,
        deviceName: "",
        deviceType: "",
        deviceCode: "",
        serialNumber: "",
        uuid: "",
        deviceStatus: "ACTIVE",
        latitude: 0,
        longitude: 0,
        altitude: 0,
        accuracy: 0,
        radiusMeters: 0,
        companyId: null,
        locationId: null,
        status: true,
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
          <h2>Add New Device</h2>
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
                label="Device Name"
                id="deviceName"
                name="deviceName"
                value={deviceForm.deviceName}
                onChange={handleInputChange}
                required
              />

              <FormSelect
                className="form-group"
                label="Location"
                id="locationId"
                name="locationId"
                value={deviceForm.locationId || ""} // ensure controlled value
                onChange={handleInputChange}
                options={locationList?.map((location) => ({
                  key: location.id,
                  value: location.id,
                  label: location.name,
                }))}
                disabled={locationList?.length === 0}
                loading={isLoadingLocations}
                required
              ></FormSelect>
            </div>

            <div className="form-row">
              <FormSelect
                className="form-group"
                label="Device Type"
                id="deviceType"
                name="deviceType"
                value={deviceForm.deviceType}
                onChange={handleInputChange}
                options={deviceTypes.map((type, index) => ({
                  key: index,
                  value: type,
                  label: type,
                }))}
              />

              <FormInput
                className="form-group"
                label="Device Code"
                id="deviceCode"
                name="deviceCode"
                value={deviceForm.deviceCode}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <FormInput
                className="form-group"
                label="Serial Number"
                type="text"
                id="serialNumber"
                name="serialNumber"
                value={deviceForm.serialNumber}
                onChange={handleInputChange}
              />

              <FormInput
                className="form-group"
                label="UUID"
                id="uuid"
                name="uuid"
                value={deviceForm.uuid}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <FormSelect
                className="form-group"
                label="Device Status"
                id="deviceStatus"
                name="deviceStatus"
                value={deviceForm.deviceStatus}
                onChange={handleInputChange}
                options={deviceStatuses.map((status, index) => ({
                  key: index,
                  value: status,
                  label: status,
                }))}
              ></FormSelect>

              <FormInput
                className="form-group"
                label="Latitude"
                type="number"
                id="latitude"
                name="latitude"
                value={deviceForm.latitude}
                onChange={handleInputChange}
                step="any"
              />
            </div>

            <div className="form-row">
              <FormInput
                className="form-group"
                label="Longitude"
                type="number"
                id="longitude"
                name="longitude"
                value={deviceForm.longitude}
                onChange={handleInputChange}
                step="any"
              />

              <FormInput
                className="form-group"
                label="Altitude"
                id="altitude"
                name="altitude"
                value={deviceForm.altitude}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <FormInput
                className="form-group"
                label="Accuracy"
                id="accuracy"
                name="accuracy"
                value={deviceForm.accuracy}
                onChange={handleInputChange}
              />

              <FormInput
                className="form-group"
                label="Radius Meters"
                id="radiusMeters"
                name="radiusMeters"
                value={deviceForm.radiusMeters}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-actions">
              {!!selectedCompany && (
                <button type="submit" className="btn-primary">
                  Create Device
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

export default AddDevice;
