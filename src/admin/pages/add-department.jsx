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

const AddDepartmentManagement = () => {
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
    id: null,
    departmentCode: "",
    departmentName: "",
    departmentNameAra: "",
    note: "",
    departmentStatus: "Active",
    companyId: null, // reference to CompanyEntity
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

      const response = await departmentService.createDepartment(formData);
      fetchDepartments(selectedCompany.id);
      showNotification("Department added successfully!");
    } catch (error) {
      console.error(error);
    }

    setFormData({
      id: null,
      departmentCode: "",
      departmentName: "",
      departmentNameAra: "",
      note: "",
      departmentStatus: "Active",
      companyId: null, // reference to CompanyEntity
    });

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      setDepartments(departments.filter((department) => department.id !== id));
    }
  };

  return (
    <div className="department-management">
      <h2>Department Management</h2>

      {/* Search and Add Button Section */}
      <div className="search-section">
        <div className="search-header">
          <h3>Department List</h3>

          {!!selectedCompany && (
            <button
              className="add-department-btn"
              onClick={() => setShowModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> Add New Department
            </button>
          )}
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
        {departmentList.length > 0 ? (
          <div className="departments-table-container">
            <table className="departments-table">
              <thead>
                <tr>
                  <th>index </th>
                  <th>Department </th>
                  <th>Code </th>
                  <th>Department (Arabic) </th>
                  <th>Status </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departmentList.map((department, index) => (
                  <tr key={department.id}>
                    <td>{index + 1} </td>

                    <td>
                      {" "}
                      <div className="department-name">
                        {" "}
                        {department.departmentName}{" "}
                      </div>
                    </td>
                    <td>
                      {" "}
                      <div className="department-code">
                        {" "}
                        {department.departmentCode}{" "}
                      </div>{" "}
                    </td>
                    <td>
                      {" "}
                      <div className="department-name">
                        {department.departmentName || "Not assigned"}{" "}
                      </div>
                    </td>
                    <td>{getStatusBadge(department.departmentStatus)}</td>

                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view-btn" title="View">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button className="action-btn edit-btn" title="Edit">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          title="Delete"
                          onClick={() => handleDelete(department.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-departments">
            <i className="fas fa-building"></i>
            <p>No departments found. Add a new department to get started.</p>
          </div>
        )}
      </div>

      {/* Add Department Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Department</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="department-form">
              <div className="form-row">
                <FormInput
                  className="form-group"
                  label="Department Name"
                  name="departmentName"
                  value={formData.departmentName || ""}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  className="form-group"
                  label="Department Name"
                  name="departmentNameAra"
                  value={formData.departmentNameAra || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <FormInput
                  className="form-group"
                  label="Department Code"
                  name="departmentCode"
                  value={formData.departmentCode || ""}
                  onChange={handleChange}
                  required
                  maxLength="5"
                  style={{ textTransform: "uppercase" }}
                />

                <FormSelect
                  className="form-group"
                  label="Status"
                  name="departmentStatus"
                  value={formData.departmentStatus || ""}
                  onChange={handleChange}
                  required
                  options={[
                    { value: "Active", label: "Active" },
                    { value: "InActive", label: "Inactive" },
                  ]}
                />

                <FormTextarea
                  className="form-group"
                  label="Description"
                  name="note"
                  value={formData.note || ""}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="submit-btn">
                  Add Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

export default AddDepartmentManagement;
