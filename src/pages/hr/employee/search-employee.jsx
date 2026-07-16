import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EmployeeService } from "../../../services/employeeService";
import Pagination from "../../../component/generic-pagination";
import LoadingSpinner from "../../../component/loading-spinner";
import ViewEmployee from "./view-employee";
import EditEmployee from "./edit-employee";

import "./css/search-employee.css";
import { useTranslation } from "react-i18next";

const SearchEmployee = () => {
  const { t } = useTranslation("employee");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [employeePhotos, setEmployeePhotos] = useState({});

  const handleViewEmployee = (userId) => {
    const employee = searchResults.find((emp) => emp.userId === userId);
    setSelectedEmployee(employee);
    setModalMode("view");
  };

  const [imageLoaded, setImageLoaded] = useState({});
  const handleImageLoad = (userId) => {
    setImageLoaded((prev) => ({ ...prev, [userId]: true }));
  };
  const handleImageError = (userId) => {
    setImageLoaded((prev) => ({ ...prev, [userId]: false }));
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      const photos = {};
      for (const employee of searchResults) {
        try {
          if (employee.photo) {
            const photo = await loadPhoto(employee.userId);
            photos[employee.userId] = photo;
          }
        } catch (err) {
          photos[employee.userId] = null;
        }
      }
      setEmployeePhotos(photos);
    };

    if (searchResults?.length > 0) {
      fetchPhotos();
    }
  }, [searchResults]);

  const loadPhoto = async (employeeId) => {
    try {
      return await EmployeeService.getUserPhoto(employeeId);
    } catch (error) {
      return null;
    }
  };

  const handleEditEmployee = (userId) => {
    const employee = searchResults.find((emp) => emp.userId === userId);
    setSelectedEmployee(employee);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setModalMode(null);
  };

  const handleSaveEmployee = (updatedData) => {
    setSearchResults((prevResults) =>
      prevResults.map((emp) =>
        emp.userId === selectedEmployee.userId
          ? { ...emp, ...updatedData }
          : emp
      )
    );
    handleCloseModal();
  };

  const getFullName = (employee) => {
    return `${employee.firstName || ""} ${employee.middleName || ""} ${
      employee.lastName || ""
    }`.trim();
  };

  const navigate = useNavigate();

  const loadUsers = useCallback(
    async (pageToLoad, search = searchTerm) => {
      try {
        setLoading(true);
        setError("");

        const response = await EmployeeService.searchEmployees({
          searchTerm: search,
          active,
          page: pageToLoad,
          size: pageSize,
        });

        if (response.success) {
          const pageData = response.data;
          setSearchResults(pageData.content || []);
          setTotalElements(pageData.totalElements || 0);
          setTotalPages(pageData.totalPages || 0);
          setCurrentPage(pageData.number ?? 0);
        } else {
          setSearchResults([]);
          setTotalElements(0);
          setTotalPages(0);
          setCurrentPage(0);
        }
      } catch (err) {
        setError(t('searchEmployee.errorLoading'));
      } finally {
        setLoading(false);
      }
    },
    [pageSize, searchTerm, active, t]
  );

  useEffect(() => {
    loadUsers(currentPage, searchTerm);
  }, [currentPage, pageSize, active, loadUsers, searchTerm]);

  const handlePageChange = useCallback(
    async (newPage) => {
      const zeroBasedPage = newPage - 1;
      if (zeroBasedPage >= 0 && zeroBasedPage < totalPages) {
        setCurrentPage(zeroBasedPage);
      }
    },
    [loadUsers, totalPages]
  );

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(0);
    await loadUsers(0);
  };

  const handleReset = () => {
    setSearchTerm("");
    setCurrentPage(0);
    loadUsers(0);
  };

  return (
    <div className="search-employee-container">
      <div className="company-logo">
        <h1 className="text-logo">{t('searchEmployee.title')}</h1>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-main">
          <div className="input-group search-input-group">
            <input
              type="text"
              placeholder={t('searchEmployee.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? t('searchEmployee.searchingButton') : t('searchEmployee.searchButton')}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="error-message">
          {error}
          <button
            onClick={() => loadUsers(currentPage)}
            className="retry-button"
          >
            {t('searchEmployee.retryButton')}
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {searchResults.length > 0 && (
            <div className="search-results">
              <h2>{t('searchEmployee.resultsHeader', { count: searchResults.length })}</h2>
              <div className="results-grid">
                {searchResults.map((employee) => (
                  <div key={employee.userId} className="employee-card">
                    <div className="employee-header">
                      <div className="employee-avatar">
                        {employeePhotos[employee.userId] ? (
                          <div className="image-container">
                            {!imageLoaded[employee.userId] && (
                              <div className="spinner-container">
                                <div className="spinner"></div>
                              </div>
                            )}
                            <img
                              src={employeePhotos[employee.userId]}
                              alt={getFullName(employee)}
                              onLoad={() => handleImageLoad(employee.userId)}
                              onError={() => handleImageError(employee.userId)}
                              style={{
                                display: imageLoaded[employee.userId]
                                  ? "block"
                                  : "none",
                              }}
                            />
                          </div>
                        ) : (
                          <div className="avatar-placeholder">
                            {employee.firstName?.charAt(0)}
                            {employee.lastName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="employee-title">
                        <h3>{getFullName(employee)}</h3>
                        <p className="arabic-name">
                          {employee.firstNameAr +
                            "   " +
                            employee.middleNameAr ||
                            "" + "  " + employee.lastNameAr ||
                            "N/A"}
                        </p>
                      </div>
                      <span
                        className={`status-badge status-${
                          employee.status?.toLowerCase() || "active"
                        }`}
                      >
                        {employee.status || t('editEmployee.sections.employmentInfo.statusOptions.active')}
                      </span>
                    </div>

                    <div className="employee-details">
                      <div className="detail-row">
                        <span className="detail-label">{t('searchEmployee.employeeCard.employeeNo')}</span>
                        <span className="detail-value">
                          {employee.employeeNo}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">{t('searchEmployee.employeeCard.department')}</span>
                        <span className="detail-value">
                          {employee.userCode || "N/A"}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">{t('searchEmployee.employeeCard.email')}</span>
                        <span className="detail-value">{employee.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">{t('searchEmployee.employeeCard.mobile')}</span>
                        <span className="detail-value">{employee.mobile}</span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">{t('searchEmployee.employeeCard.departmentName')}</span>
                        <span className="detail-value">
                          {employee.department?.departmentName || "N/A"}
                        </span>
                      </div>

                      {employee.position && (
                        <div className="detail-row">
                          <span className="detail-label">{t('searchEmployee.employeeCard.position')}</span>
                          <span className="detail-value">
                            {employee.position}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="employee-stats">
                      <div className="stat-item">
                        <span className="stat-label">{t('searchEmployee.employeeCard.stats.devicesAssigned')}</span>
                        <span className="stat-value">
                          {employee.deviceCount || 0}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">{t('searchEmployee.employeeCard.stats.lastActive')}</span>
                        <span className="stat-value">
                          {employee.lastActive
                            ? new Date(employee.lastActive).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="employee-actions">
                      <Link
                        to={`/employee/${employee.userId}/view`}
                        className="view-button"
                      >
                        {t('searchEmployee.employeeCard.actions.viewProfile')}
                      </Link>

                      <Link
                        to={`/employee/${employee.userId}/edit`}
                        className="edit-button"
                      >
                        {t('searchEmployee.employeeCard.actions.edit')}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && searchResults.length > 0 && (
            <div className="pagination-section">
              {totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    {t('searchEmployee.pagination.showingPage', { currentPage: currentPage + 1, totalPages })}
                    ({t('searchEmployee.pagination.range', {
                      start: Math.min(currentPage * pageSize + 1, totalElements),
                      end: Math.min((currentPage + 1) * pageSize, totalElements),
                      total: totalElements
                    })})
                  </div>

                  <Pagination
                    currentPage={currentPage + 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}

          {!loading && searchResults.length === 0 && searchTerm && (
            <div className="no-results">
              {t('searchEmployee.noResults')}
            </div>
          )}
        </>
      )}
      <div className="quick-actions">
        <Link to="/add-employee" className="add-employee-link">
          {t('searchEmployee.quickAdd')}
        </Link>
      </div>

      {/* Modals */}
      {modalMode === "view" && (
        <ViewEmployee
          employee={selectedEmployee}
          onClose={handleCloseModal}
          onEdit={() => setModalMode("edit")}
          loadPhoto={loadPhoto}
        />
      )}

      {modalMode === "edit" && (
        <EditEmployee
          employee={selectedEmployee}
          onClose={handleCloseModal}
          onSave={handleSaveEmployee}
          onView={() => setModalMode("view")}
          loadPhoto={loadPhoto}
        />
      )}
    </div>
  );
};

export default SearchEmployee;