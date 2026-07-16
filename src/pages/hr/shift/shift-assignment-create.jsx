import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Or your custom translation hook
import { ShiftService } from "../../../services/shiftService";
import { ShiftAssignmentService } from "../../../services/shiftAssignmentService";
import { EmployeeService } from "../../../services/employeeService";
import Pagination from "../../../component/generic-pagination";
import "./css/shift-assignment-create.css";
import useConfirm from "../../../hooks/useConfirm";
import { useNotification } from "../../../context/NotificationContext";

const ShiftAssignmentCreate = () => {
  const { t } = useTranslation("shift");
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    shiftId: "",
    startDate: "",
    endDate: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Shifts state
  const [shifts, setShifts] = useState([]);
  const [loadingShifts, setLoadingShifts] = useState(false);

  // User modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  const { confirm, ModalComponent } = useConfirm();
  const debounceTimer = useRef(null);

  // Fetch shifts on mount
  useEffect(() => {
    const loadShifts = async () => {
      setLoadingShifts(true);
      try {
        const res = await ShiftService.getSearch();
        setShifts(res.data || []);
      } catch (err) {
        console.error("Failed to load shifts:", err);
        setErrorMsg(t("shiftAssignment.common.notifications.errLoadShifts"));
      } finally {
        setLoadingShifts(false);
      }
    };
    loadShifts();
  }, [t]);

  // Fetch users
  const fetchUsers = async (page, term) => {
    setLoadingUsers(true);
    setUsersError("");
    try {
      const response = await EmployeeService.searchLicensedEmployees({
        searchTerm: term,
        active: true,
        page,
        size: pageSize,
      });
      if (response.success) {
        const pageData = response.data;
        setSearchResults(pageData.content || []);
        setTotalElements(pageData.totalElements || 0);
        setTotalPages(pageData.totalPages || 0);
        setCurrentPage(pageData.number ?? 0);
      } else {
        throw new Error(response.message || "Failed to load users");
      }
    } catch (err) {
      console.error(err);
      setUsersError(err.message || t("shiftAssignment.userModal.noUsersFound"));
      setSearchResults([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Open modal: reset search and load first page
  const openUserModal = () => {
    setSearchTerm("");
    setCurrentPage(0);
    fetchUsers(0, "");
    setIsUserModalOpen(true);
  };

  // Debounced search inside modal
  useEffect(() => {
    if (!isUserModalOpen) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchUsers(0, searchTerm);
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm, isUserModalOpen]);

  // Handle page change in modal
  const handlePageChange = (newPageOneBased) => {
    const newPageZeroBased = newPageOneBased - 1;
    if (newPageZeroBased >= 0 && newPageZeroBased < totalPages) {
      fetchUsers(newPageZeroBased, searchTerm);
    }
  };

  // Select user from modal
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setFormData((prev) => ({ ...prev, userId: user.userId }));
    setIsUserModalOpen(false);
    if (formErrors.userId) {
      setFormErrors((prev) => ({ ...prev, userId: undefined }));
    }
  };

  // Remove selected user
  const handleRemoveUser = () => {
    setSelectedUser(null);
    setFormData((prev) => ({ ...prev, userId: "" }));
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!selectedUser) errors.userId = t("shiftAssignment.common.validation.userRequired");
    if (!formData.shiftId) errors.shiftId = t("shiftAssignment.common.validation.shiftRequired");
    if (!formData.startDate) errors.startDate = t("shiftAssignment.common.validation.startDateRequired");
    if (formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = t("shiftAssignment.common.validation.endDateBeforeStart");
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const confirmed = await confirm(
      t("shiftAssignment.create.confirmText", { name: `${selectedUser.firstName} ${selectedUser.lastName}` }),
      t("shiftAssignment.create.confirmTitle")
    );

    if (!confirmed) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        userId: selectedUser.userId,
        shiftId: formData.shiftId,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        active: true,
      };
      const response = await ShiftAssignmentService.createShiftAssign(payload);
      if (response.success) {
        showNotification(t("shiftAssignment.common.notifications.successCreate"), "success");
        setFormData({ shiftId: "", startDate: "", endDate: "" });
        setSelectedUser(null);
        setFormErrors({});
        setTimeout(() => {
          setSuccessMsg(null);
          navigate("/shift-assignment");
        }, 1500);
      } else {
        throw new Error(response.message || "Creation failed");
      }
    } catch (err) {
      setErrorMsg(t("shiftAssignment.common.notifications.errGenericCreate"));
      setTimeout(() => setErrorMsg(null), 4000);
      
      if (err.message === 'USER_ALREADY_HAS_ACTIVE_SHIFT_ASSIGN') {
        showNotification(t("shiftAssignment.common.notifications.errAlreadyHasActive"), "error");
      }
      if (err.message === "START_DATE_CANNOT_BE_IN_PAST") {
        showNotification(t("shiftAssignment.common.notifications.errStartDatePast"), "error");
      }
      if (err.message === "END_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_START_DATE") {
        showNotification(t("shiftAssignment.common.notifications.errEndDateComparison"), "error");
      }
      if (err.message === "END_DATE_CANNOT_BE_IN_THE_PAST") {
        showNotification(t("shiftAssignment.common.notifications.errEndDatePast"), "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isUserModalOpen) {
        setIsUserModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isUserModalOpen]);

  return (
    <div className="shift-assignment-create">
      <div className="create-card">
        <div className="create-header">
          <h2>{t("shiftAssignment.create.title")}</h2>
          <button className="btn btn-secondary" onClick={() => navigate("/shift-assignment")}>
            {t("shiftAssignment.common.buttons.backToSearch")}
          </button>
        </div>

        {successMsg && <div className="alert success">{successMsg}</div>}
        {errorMsg && <div className="alert error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="assignment-form">
          {/* User selection */}
          <div className="form-row">
            <div className="form-group user-selection-group">
              <label>{t("shiftAssignment.common.labels.user")} *</label>
              <div className="user-select-wrapper">
                <input
                  type="text"
                  className={`user-display-input ${formErrors.userId ? "error" : ""}`}
                  value={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ""}
                  placeholder={t("shiftAssignment.create.placeholderSelectUser")}
                  readOnly
                  onClick={openUserModal}
                />
                {selectedUser && (
                  <button type="button" className="remove-user-btn" onClick={handleRemoveUser}>
                    ✕
                  </button>
                )}
                <button type="button" className="select-user-btn btn btn-secondary" onClick={openUserModal}>
                  {t("shiftAssignment.common.buttons.select")}
                </button>
              </div>
              {formErrors.userId && <span className="error-msg">{formErrors.userId}</span>}
            </div>
          </div>

          {/* Selected user details card */}
          {selectedUser && (
            <div className="details-card user-details">
              <h4>{t("shiftAssignment.create.selectedUserDetailsTitle")}</h4>
              <div className="details-grid">
                <span className="detail-label">{t("shiftAssignment.common.labels.fullName")}</span>
                <span>{selectedUser.firstName} {selectedUser.lastName}</span>
                <span className="detail-label">{t("shiftAssignment.common.labels.email")}</span>
                <span>{selectedUser.email || "—"}</span>
                <span className="detail-label">{t("shiftAssignment.common.labels.role")}</span>
                <span className="role-badge">{selectedUser.role || t("shiftAssignment.common.labels.user")}</span>
                {selectedUser.department?.departmentName && (
                  <>
                    <span className="detail-label">{t("shiftAssignment.common.labels.department")}</span>
                    <span>{selectedUser.department?.departmentName}</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Shift selection */}
          <div className="form-row">
            <div className="form-group">
              <label>{t("shiftAssignment.common.labels.shift")} *</label>
              <select
                name="shiftId"
                value={formData.shiftId}
                onChange={handleChange}
                className={formErrors.shiftId ? "error" : ""}
                disabled={loadingShifts}
              >
                <option value="">{t("shiftAssignment.common.labels.selectShift")}</option>
                {shifts.map((shift) => (
                  <option key={shift.shiftId} value={shift.shiftId}>
                    {shift.shiftName} ({shift.startTime} – {shift.endTime})
                  </option>
                ))}
              </select>
              {loadingShifts && <span className="info-msg">{t("shiftAssignment.create.loadingShifts")}</span>}
              {formErrors.shiftId && <span className="error-msg">{formErrors.shiftId}</span>}
            </div>
          </div>

          {/* Date fields */}
          <div className="form-row two-columns">
            <div className="form-group">
              <label>{t("shiftAssignment.common.labels.startDate")} *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={formErrors.startDate ? "error" : ""}
              />
              {formErrors.startDate && <span className="error-msg">{formErrors.startDate}</span>}
            </div>
            <div className="form-group">
              <label>{t("shiftAssignment.common.labels.endDateOptional")}</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={formErrors.endDate ? "error" : ""}
              />
              {formErrors.endDate && <span className="error-msg">{formErrors.endDate}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? t("shiftAssignment.create.btnCreating") : t("shiftAssignment.create.btnCreate")}
            </button>
          </div>
        </form>
      </div>

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="shift-modal-overlay" onClick={() => setIsUserModalOpen(false)}>
          <div className="shift-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="shift-modal-header">
              <h3>{t("shiftAssignment.userModal.title")}</h3>
              <button className="close-btn" onClick={() => setIsUserModalOpen(false)}>
                {t("shiftAssignment.common.buttons.close")}
              </button>
            </div>
            <div className="shift-modal-body">
              <div className="search-box">
                <input
                  type="text"
                  placeholder={t("shiftAssignment.userModal.placeholderSearch")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>

              {loadingUsers && <div className="loading-spinner">{t("shiftAssignment.userModal.loadingUsers")}</div>}
              {usersError && <div className="alert error">{usersError}</div>}

              {!loadingUsers && !usersError && (
                <>
                  <div className="user-table-container">
                    <table className="user-table">
                      <thead>
                        <tr>
                          <th>{t("shiftAssignment.common.labels.sn")}</th>
                          <th>{t("shiftAssignment.common.labels.fullName")}</th>
                          <th>{t("shiftAssignment.common.labels.code")}</th>
                          <th>{t("shiftAssignment.common.labels.mobile")}</th>
                          <th>{t("shiftAssignment.common.labels.email")}</th>
                          <th>{t("shiftAssignment.common.labels.status")}</th>
                          <th>{t("shiftAssignment.common.labels.employeeNo")}</th>
                          <th>{t("shiftAssignment.common.labels.actions")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.map((user, index) => (
                          <tr key={user.userId}>
                            <td>{currentPage * pageSize + index + 1}</td>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.userCode}</td>
                            <td>{user.mobile}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`status-badge ${user.active ? "active" : "inactive"}`}>
                                {user.active ? t("shiftAssignment.common.status.active") : t("shiftAssignment.common.status.inactive")}
                              </span>
                            </td>
                            <td>{user.employeeNo}</td>
                            <td>
                              <button className="select-btn" onClick={() => handleSelectUser(user)}>
                                {t("shiftAssignment.common.buttons.select")}
                              </button>
                            </td>
                          </tr>
                        ))}
                        {searchResults.length === 0 && (
                          <tr>
                            <td colSpan="8" className="no-data">
                              {t("shiftAssignment.userModal.noUsersFound")}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="pagination-wrapper">
                      <div className="pagination-info">
                        {t("shiftAssignment.userModal.paginationInfo", {
                          start: currentPage * pageSize + 1,
                          end: Math.min((currentPage + 1) * pageSize, totalElements),
                          total: totalElements,
                        })}
                      </div>
                      <Pagination currentPage={currentPage + 1} totalPages={totalPages} onPageChange={handlePageChange} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <ModalComponent />
    </div>
  );
};

export default ShiftAssignmentCreate;