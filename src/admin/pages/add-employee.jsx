import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faTimes,
  faArrowUp,
  faArrowDown,
  faEdit,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import "../../assets/css/admin/department-management.css";
import { deviceService } from "../../services/deviceService";
import FormInput from "../../component/form-input";
import FormSelect from "../../component/form-select";
import FormTextarea from "../../component/form-textarea";
import { departmentService } from "../../services/departmentService";
import { employeeService } from "../../services/employeeService";

const AddEmployee = () => {
  const icons = { ascending: faArrowUp, descending: faArrowDown };
  const getStatusBadge = (status) => {
    const isActive = status === "Active" || status === true;
    return (
      <span
        className={`status-badge ${
          isActive ? "status-active" : "status-inactive"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

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

  const [departmentList, setDepartmentList] = useState([]);
  const fetchDepartments = async (companyId) => {
    if (companyId > 0) {
      const response = await departmentService.getDepartmentsbyComapny(
        companyId
      );
      setDepartmentList(response || []);
    }
  };

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
    fetchDepartments(company?.id || 0);
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

  const [formData, setFormData] = useState({
    Id: "",
    firstName: "",
    middleName: "",
    firstNameAr: "",
    middleNameAr: "",
    lastName: "",
    lastNameAr: "",
    jobId: "",
    mobile: "",
    email: "",
    companyId: "",
    departmentId: "",
  });

  const [showModal, setShowModal] = useState(false);

  const [departments, setDepartments] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      formData.companyId = selectedCompany.id;
      console.log(formData);

      const response = await employeeService.createEmployee(formData);
      fetchDepartments(selectedCompany.id);
      showNotification("Employee added successfully!");
    } catch (error) {
      console.error(error);
    }

    setFormData({
      Id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      firstNameAr: "",
      middleNameAr: "",
      lastNameAr: "",
      jobId: "",
      mobile: "",
      email: "",
      companyId: "",
      departmentId: "",
    });

    setShowModal(false);
  };

  return (
    <div className="department-management">
      <h2>Employee Management</h2>

      {/* Search and Add Button Section */}
      <div className="search-section">
        <div className="search-header">
          <h3>Add Employee</h3>
        </div>

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
                  setDepartmentList([]);
                  setFormData((prev) => ({ ...prev, id: null }));
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
      </div>

      {/* Department List */}
      <div className="department-list-section">
        <form onSubmit={handleSubmit} className="department-form">
          <div className="form-row">
            <FormInput
              className="form-group"
              label="First Name"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              required
            />

            <FormInput
              className="form-group"
              label="Middle Name"
              name="middleName"
              value={formData.middleName || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <FormInput
              className="form-group"
              label="Last Name"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              required
            />

            <FormInput
              className="form-group"
              label="First Name (Arabic)"
              name="firstNameAr"
              value={formData.firstNameAr || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <FormInput
              className="form-group"
              label="Middle Name (Arabic)"
              name="middleNameAr"
              value={formData.middleNameAr || ""}
              onChange={handleChange}
              required
            />

            <FormInput
              className="form-group"
              label="Last Name (Arabic)"
              name="lastNameAr"
              value={formData.lastNameAr || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <FormInput
              className="form-group"
              label="Job ID"
              name="jobId"
              value={formData.jobId || ""}
              onChange={handleChange}
            />

            <FormSelect
              className="form-group"
              label="Department"
              name="departmentId"
              value={formData.departmentId || ""}
              onChange={handleChange} // 👈 update parent
              options={departmentList?.map((dep) => ({
                key: dep.id,
                value: dep.id,
                label: dep.departmentName,
              }))}
            />
          </div>

          <div className="form-row">
            <FormInput
              className="form-group"
              label="Mobile No"
              name="mobile"
              value={formData.mobile || ""}
              onChange={handleChange}
              required
            />

            <FormInput
              className="form-group"
              label="Email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>

            {!!selectedCompany && (
              <button type="submit" className="btn-primary">
                Add Employee
              </button>
            )}
          </div>
        </form>
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

export default AddEmployee;
