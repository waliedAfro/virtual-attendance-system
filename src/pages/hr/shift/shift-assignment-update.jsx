import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShiftAssignmentService } from "../../../services/shiftAssignmentService";
import { ShiftService } from "../../../services/shiftService";
import "./css/shift-assignment-create.css";
import useApi from "../../../hooks/useApi";
import useConfirm from "../../../hooks/useConfirm";
import { useNotification } from "../../../context/NotificationContext";

const ShiftAssignmentUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation("shift");
  
  const { showNotification } = useNotification();
  const { confirm, ModalComponent } = useConfirm();

  const [formData, setFormData] = useState({
    userId: "",
    shiftId: "",
    startDate: "",
    endDate: "",
    active: false,
    version: 0,
  });
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});

  const {
    data: shifts,
    loading: loadingShifts,
    error: ShiftsError,
  } = useApi(ShiftService.getSearch, [], true); // auto-fetch on mount

  // Fetch assignment data
  const loadShiftAssign = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ShiftAssignmentService.getShiftAssign(id);
      let data;
      if (response && response.success) {
        data = response.data;
      } else if (response && response.data) {
        data = response.data;
      } else {
        data = response;
      }

      if (!data || !data.user) {
        throw new Error("Invalid assignment data received");
      }

      setFormData({
        userId: data.user.userId,
        shiftId: data.shift?.shiftId || "",
        startDate: data.startDate?.split("T")[0] || "",
        endDate: data.endDate?.split("T")[0] || "",
        active: data.active ?? true,
        version: data.version || 0,
      });

      setUserDetails({
        fullName:
          data.user.fullName ||
          `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim(),
        email: data.user.email || "—",
        department: data.user.department?.departmentName || "",
      });
    } catch (err) {
      console.error("Load error:", err);
      setError(err.message || t("shiftAssignment.common.notifications.errLoadAssignment"));
    } finally {
      setLoading(false);
    }
  };

  // Initial loads
  useEffect(() => {
    loadShiftAssign();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.shiftId) newErrors.shiftId = t("shiftAssignment.common.validation.shiftRequired");
    if (!formData.startDate) newErrors.startDate = t("shiftAssignment.common.validation.startDateRequired");
    if (
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      newErrors.endDate = t("shiftAssignment.common.validation.endDateBeforeStart");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const confirmed = await confirm(
      t("shiftAssignment.update.confirmText", { name: userDetails.fullName }),
      t("shiftAssignment.update.confirmTitle")
    );

    if (!confirmed) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        id: parseInt(id, 10),
        userId: formData.userId,
        shiftId: formData.shiftId,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        active: formData.active,
        version: formData.version,
      };
      const response = await ShiftAssignmentService.updateShiftAssign(
        id,
        payload,
      );
      if (response && (response.success || response.status === 200)) {
        showNotification(t("shiftAssignment.common.notifications.successUpdate"), "success");
        setTimeout(() => {
          navigate("/shift-assignment");
        }, 1500);
      } else {
        throw new Error(response?.message || "Update failed");
      }
    } catch (err) {
      if (err.message === 'SHIFT_ASSIGN_NOT_FOUND') {
        showNotification(t("shiftAssignment.common.notifications.errNotFound"), "error");
      } else if (err.message === 'SHIFT_ASSIGNMENT_ALREADY_EXISTS_FOR_THIS_USER_ON_THE_GIVEN_START_DATE') {
        showNotification(t("shiftAssignment.common.notifications.errAlreadyExistsDate"), "error");
      } else if (err.message === "START_DATE_CANNOT_BE_IN_PAST") {
        showNotification(t("shiftAssignment.common.notifications.errStartDatePast"), "error");
      } else if (err.message === "END_DATE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_START_DATE") {
        showNotification(t("shiftAssignment.common.notifications.errEndDateComparison"), "error");
      } else if (err.message === "END_DATE_CANNOT_BE_IN_THE_PAST") {
        showNotification(t("shiftAssignment.common.notifications.errEndDatePast"), "error");
      } else {
        showNotification(t("shiftAssignment.common.notifications.errGenericUpdate"), "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading only while fetching initial data
  if (loading && !userDetails.fullName) {
    return (
      <div className="shift-assignment-create">
        <div className="create-card">
          <div className="loading-spinner">{t("shiftAssignment.update.loadingAssignment")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="shift-assignment-create">
      <div className="create-card">
        <div className="create-header">
          <h2>{t("shiftAssignment.update.title")}</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/shift-assignment")}
          >
            {t("shiftAssignment.common.buttons.backToSearch")}
          </button>
        </div>

        {success && <div className="alert success">{success}</div>}
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* User Details Card */}
          <div className="details-card user-details">
            <h4>{t("shiftAssignment.update.userDetailsTitle")}</h4>
            <div className="details-grid">
              <span className="detail-label">{t("shiftAssignment.common.labels.fullName")}</span>
              <span>{userDetails.fullName || "—"}</span>
              <span className="detail-label">{t("shiftAssignment.common.labels.email")}</span>
              <span>{userDetails.email}</span>
              {userDetails.department && (
                <>
                  <span className="detail-label">{t("shiftAssignment.common.labels.department")}</span>
                  <span>{userDetails.department}</span>
                </>
              )}
            </div>
          </div>

          {/* Shift Selection */}
          <div className="form-row">
            <div className="form-group">
              <label>{t("shiftAssignment.common.labels.shift")} *</label>
              <select
                name="shiftId"
                value={formData.shiftId}
                onChange={handleChange}
                disabled={loadingShifts || loading}
                className={errors.shiftId ? "error" : ""}
              >
                <option value="">{t("shiftAssignment.common.labels.selectShift")}</option>
                {loadingShifts && <option disabled>{t("shiftAssignment.common.labels.loading")}</option>}
                {shifts && shifts.map((s) => (
                  <option key={s.shiftId} value={s.shiftId}>
                    {s.shiftName} ({s.startTime} – {s.endTime})
                  </option>
                ))}
              </select>
              {errors.shiftId && (
                <span className="error-msg">{errors.shiftId}</span>
              )}
            </div>
          </div>

          {/* Date Fields */}
          <div className="form-row two-columns">
            <div className="form-group">
              <label>{t("shiftAssignment.common.labels.startDate")} *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={errors.startDate ? "error" : ""}
                disabled={loading}
              />
              {errors.startDate && (
                <span className="error-msg">{errors.startDate}</span>
              )}
            </div>
            <div className="form-group">
              <label>{t("shiftAssignment.common.labels.endDateOptional")}</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={errors.endDate ? "error" : ""}
                disabled={loading}
              />
              {errors.endDate && (
                <span className="error-msg">{errors.endDate}</span>
              )}
            </div>
          </div>

          {/* Active Checkbox */}
          <div className="form-row checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                disabled={loading}
              />
              {t("shiftAssignment.common.labels.active")}
            </label>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? t("shiftAssignment.update.btnUpdating") : t("shiftAssignment.update.btnUpdate")}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/shift-assignment")}
              disabled={loading}
            >
              {t("shiftAssignment.common.buttons.cancel")}
            </button>
          </div>
        </form>
      </div>
      <ModalComponent />
    </div>
  );
};

export default ShiftAssignmentUpdate;