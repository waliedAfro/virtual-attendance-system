import React, { useState, useMemo, useEffect } from "react";
import "../../assets/css/client/department-management.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useApi from "../../hooks/useApi";
import DepartmentView from "./department-view";
import DepartmentEdit from "./department-edit";
import DepartmentAdd from "./department-add";
import DepartmentDelete from "./department-delete";
import { departmentService } from "../../services/departmentService";
import {
  faPlus,
  faSearch,
  faTimes,
  faArrowUp,
  faArrowDown,
  faEdit,
  faTrash,
  faEye,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const DepartmentList = () => {
  const icons = {
    ascending: faArrowUp,
    descending: faArrowDown,
  };

  const companyId = 3;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [isUpdated, setIsUpdated] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [localDepartments, setLocalDepartments] = useState([]);

  const [formData, setFormData] = useState({
    id: 0,
    departmentCode: "",
    departmentName: "",
    departmentNameAra: "",
    departmentStatus: "Active",
    note: "",
    deleteReason: "",
    companyId,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Fetch departments
  const {
    data: departments = [],
    loading: departmentsLoading,
    error: departmentsError,
    refresh: refreshDepartments,
  } = useApi(
    () => departmentService.getDepartmentsbyComapny(companyId),
    [],
    true
  );

  // Sync local state with API result
  useEffect(() => {
    setLocalDepartments(departments);
  }, [departments]);

  useEffect(() => {
    if (isUpdated) {
      scrollToTop();
      // Reset the saved state after scrolling
      const timer = setTimeout(() => setIsUpdated(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isUpdated]);

  const updateList = () => {
    const {
      data: departments = [],
      loading: departmentsLoading,
      error: departmentsError,
      refresh: refreshDepartments,
    } = useApi(
      () => departmentService.getDepartmentsbyComapny(companyId),
      [],
      true
    );
  };
  // Go to the Top Page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      departmentCode: "",
      departmentName: "",
      departmentNameAra: "",
      departmentStatus: "Active",
      note: "",
      companyId,
    });
  };

  const showMessage = (message, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMessage(message);
    } else {
      setErrorMessage(message);
    }

    // Auto-hide message after 5 seconds
    setTimeout(() => {
      if (isSuccess) {
        setSuccessMessage("");
      } else {
        setErrorMessage("");
      }
    }, 5000);
  };

  const handleAddDepartment = async (e) => {
    try {
      e.preventDefault();
      await departmentService.createDepartment(formData);
      showMessage("Department successfully created!");
      refreshDepartments;
      setShowModal(false);
      updateList();
      return true;
    } catch (error) {
      console.error("Failed to create department:", error);
      showMessage(error.message || "Failed to create department", false);
      return false;
    }
  };

  const handleEditDepartment = async (updateFormData) => {
    try {
      await departmentService.updateDepartments(updateFormData);
      showMessage("Department successfully updated!");
      refreshDepartments;
      setShowEditModal(false);
      return true;
    } catch (error) {
      console.error("Failed to update department:", error);
      showMessage(error.message || "Failed to update department", false);
      return false;
    }
  };

  const handleDeleteDepartment = async (delDateFormData) => {
    try {
      await departmentService.deleteDepartments(delDateFormData);
      showMessage("Department successfully deleted!");
      setShowDelModal(false);
      setIsUpdated(true);
      refreshDepartments;
      return true;
    } catch (error) {
      console.error("Failed to delete department:", error);
      showMessage(error.message || "Failed to delete department", false);
      return false;
    }
  };

  const handleOpenEditModal = (department = null) => {
    setSelectedDepartment(department);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedDepartment(null);
  };

  const handleOpenViewModal = (department = null) => {
    setSelectedDepartment(department);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedDepartment(null);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

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

  // Filter and sort
  const filteredDepartments = localDepartments.filter((department) =>
    [
      department.departmentName,
      department.departmentCode,
      department.departmentNameAra,
      department.departmentStatus,
    ].some((field) =>
      field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedDepartments = useMemo(() => {
    if (!sortConfig.key) return filteredDepartments;
    return [...filteredDepartments].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredDepartments, sortConfig]);

  return (
    <div className="department-management">
      {/* Success message */}
      {successMessage && (
        <div className="form-success-banner">
          <FontAwesomeIcon icon={faCheckCircle} />
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage("")}
            aria-label="Dismiss success message"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      <h2>Department Management</h2>
      {/* Search Section */}
      <div className="search-section">
        <div className="search-header">
          <h3>Department List</h3>
          <button
            className="add-department-btn"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Add New Department
          </button>
        </div>
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search ...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="clear-search-btn"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <button className="search-btn">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div className="results-count">
          {sortedDepartments.length} department(s) found
        </div>
      </div>

      {/* Department List */}
      <div className="department-list-section">
        {sortedDepartments.length > 0 ? (
          <div className="departments-table-container">
            <table className="departments-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("departmentName")}>
                    Department{" "}
                    {sortConfig.key === "departmentName" && (
                      <FontAwesomeIcon icon={icons[sortConfig.direction]} />
                    )}
                  </th>
                  <th onClick={() => handleSort("departmentNameAra")}>
                    Department (Arabic){" "}
                    {sortConfig.key === "departmentNameAra" && (
                      <FontAwesomeIcon icon={icons[sortConfig.direction]} />
                    )}
                  </th>
                  <th onClick={() => handleSort("departmentStatus")}>
                    Status{" "}
                    {sortConfig.key === "departmentStatus" && (
                      <FontAwesomeIcon icon={icons[sortConfig.direction]} />
                    )}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedDepartments.map((department) => (
                  <tr key={department.id}>
                    <td>
                      <div className="department-name">
                        {department.departmentName}
                      </div>
                      <div className="department-code">
                        {department.departmentCode}
                      </div>
                      <div className="department-description">
                        {department.note}
                      </div>
                    </td>
                    <td>{department.departmentNameAra || "Not assigned"}</td>
                    <td>{getStatusBadge(department.departmentStatus)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() => {
                            setSelectedDepartment(department);
                            setShowViewModal(true);
                          }}
                          title="View"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDepartment(department);
                            setShowEditModal(true);
                          }}
                          className="action-btn edit-btn"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          title="Delete"
                          onClick={() => {
                            setSelectedDepartment(department);
                            setShowDelModal(true);
                          }}
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
            <p>
              {searchTerm
                ? "No departments match your search."
                : "No departments found. Add a new department to get started."}
            </p>
          </div>
        )}
      </div>

      {/* Edit/Add Department Modal */}
      {showEditModal && (
        <DepartmentEdit
          formData={selectedDepartment}
          onClose={() => setShowEditModal(false)}
          loading={loading}
          handleEditDepartment={handleEditDepartment}
        />
      )}

      {/* View Department Modal */}
      {showViewModal && (
        <DepartmentView
          formData={selectedDepartment}
          onClose={() => setShowViewModal(false)}
          //onSave={selectedDepartment ? onEditDepartment : onAddDepartment}
        />
      )}

      {/* Add Department Modal */}
      {showModal && (
        <DepartmentAdd
          handleChange={handleChange}
          onClose={() => setShowModal(false)}
          handleAddDepartment={handleAddDepartment}
          loading={loading}
          formData={formData}
        />
      )}

      {/* Delete Department Modal */}
      {showDelModal && (
        <DepartmentDelete
          handleChange={handleChange}
          onClose={() => setShowDelModal(false)}
          handleDeleteDepartment={handleDeleteDepartment}
          loading={loading}
          formData={selectedDepartment}
        />
      )}

      {/* Error message */}
      {errors.submit && (
        <div className="form-error-banner">
          <i className="fas fa-exclamation-circle"></i>
          <span>{errors.submit}</span>
          <button
            onClick={() => setErrors((prev) => ({ ...prev, submit: null }))}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
