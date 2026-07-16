import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShiftService } from "../../../services/shiftService";
import "./css/shift-manager.css";

const calculateCrossDay = (startTime, endTime) => {
  return endTime <= startTime;
};

const calculateWorkingMinutes = (startTime, endTime, breakMinutes) => {
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);
  let startTotal = startHour * 60 + startMin;
  let endTotal = endHour * 60 + endMin;
  let duration = endTotal - startTotal;
  if (duration < 0) duration += 24 * 60;
  duration -= breakMinutes;
  return Math.max(0, duration);
};

const ShiftForm = () => {
  const { id } = useParams(); // if id exists → edit mode
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const { t } = useTranslation("shift");

  const SHIFT_TYPE_OPTIONS = [
    { value: "MORNING", label: t("shiftManagement.form.types.morning") },
    { value: "EVENING", label: t("shiftManagement.form.types.evening") },
    { value: "NIGHT", label: t("shiftManagement.form.types.night") },
    { value: "GENERAL", label: t("shiftManagement.form.types.general") },
    { value: "FLEXIBLE", label: t("shiftManagement.form.types.flexible") },
    { value: "ROTATIONAL", label: t("shiftManagement.form.types.rotational") },
  ];

  const [formData, setFormData] = useState({
    shiftName: "",
    shiftType: "MORNING",
    startTime: "09:00",
    endTime: "17:00",
    gracePeriodMinutes: 0,
    breakMinutes: 0,
    overtimeAllowed: false,
    maxOvertimeMinutes: "",
    flexibleStart: false,
    earlyCheckinMinutes: "",
    lateCheckoutMinutes: "",
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [error, setError] = useState(null);

  // Fetch existing shift if in edit mode
  const fetchShift = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ShiftService.getShift(id);
      if (response.success) {
        const shift = response.data;
        setFormData({
          shiftName: shift.shiftName || "",
          shiftType: shift.shiftType || "MORNING",
          startTime: shift.startTime?.substring(0, 5) || "09:00",
          endTime: shift.endTime?.substring(0, 5) || "17:00",
          gracePeriodMinutes: shift.gracePeriodMinutes || 0,
          breakMinutes: shift.breakMinutes || 0,
          overtimeAllowed: shift.overtimeAllowed || false,
          maxOvertimeMinutes: shift.maxOvertimeMinutes || "",
          flexibleStart: shift.flexibleStart || false,
          earlyCheckinMinutes: shift.earlyCheckinMinutes || "",
          lateCheckoutMinutes: shift.lateCheckoutMinutes || "",
        });
      } else {
        setError(t("shiftManagement.form.notifications.errLoadDetails"));
      }
    } catch (err) {
      setError(err.message || t("shiftManagement.form.notifications.errFetchGeneric"));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    if (isEditMode) {
      fetchShift();
    }
  }, [isEditMode, fetchShift]);

  // Computed previews
  const computedCrossDay = calculateCrossDay(formData.startTime, formData.endTime);
  const computedWorkingMinutes = calculateWorkingMinutes(
    formData.startTime,
    formData.endTime,
    formData.breakMinutes || 0
  );

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.shiftName.trim()) errors.shiftName = t("shiftManagement.form.validation.nameRequired");
    if (!formData.startTime) errors.startTime = t("shiftManagement.form.validation.startRequired");
    if (!formData.endTime) errors.endTime = t("shiftManagement.form.validation.endRequired");

    if (computedWorkingMinutes <= 0) {
      errors.workingMinutes = t("shiftManagement.form.validation.invalidDuration");
    }

    if (formData.gracePeriodMinutes < 0)
      errors.gracePeriodMinutes = t("shiftManagement.form.validation.graceNegative");
    if (formData.breakMinutes < 0)
      errors.breakMinutes = t("shiftManagement.form.validation.breakNegative");

    if (formData.overtimeAllowed) {
      const maxOvertime = parseInt(formData.maxOvertimeMinutes, 10);
      if (isNaN(maxOvertime) || maxOvertime <= 0)
        errors.maxOvertimeMinutes = t("shiftManagement.form.validation.overtimeRequired");
    }

    if (formData.flexibleStart) {
      const earlyCheckin = parseInt(formData.earlyCheckinMinutes, 10);
      const lateCheckout = parseInt(formData.lateCheckoutMinutes, 10);
      if (isNaN(earlyCheckin) || earlyCheckin < 0)
        errors.earlyCheckinMinutes = t("shiftManagement.form.validation.earlyCheckinRequired");
      if (isNaN(lateCheckout) || lateCheckout < 0)
        errors.lateCheckoutMinutes = t("shiftManagement.form.validation.lateCheckoutRequired");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitSuccess(null);
    setError(null);

    const payload = {
      shiftName: formData.shiftName.trim(),
      shiftType: formData.shiftType,
      startTime: formData.startTime,
      endTime: formData.endTime,
      gracePeriodMinutes: parseInt(formData.gracePeriodMinutes, 10) || 0,
      breakMinutes: parseInt(formData.breakMinutes, 10) || 0,
      overtimeAllowed: formData.overtimeAllowed,
      maxOvertimeMinutes: formData.overtimeAllowed
        ? parseInt(formData.maxOvertimeMinutes, 10)
        : null,
      flexibleStart: formData.flexibleStart,
      earlyCheckinMinutes: formData.flexibleStart
        ? parseInt(formData.earlyCheckinMinutes, 10)
        : null,
      lateCheckoutMinutes: formData.flexibleStart
        ? parseInt(formData.lateCheckoutMinutes, 10)
        : null,
    };

    try {
      let response;
      if (isEditMode) {
        response = await ShiftService.updateShift(id, payload);
      } else {
        response = await ShiftService.createShift(payload);
      }

      if (response.success) {
        setSubmitSuccess(
          isEditMode 
            ? t("shiftManagement.form.notifications.successUpdate") 
            : t("shiftManagement.form.notifications.successCreate")
        );
        setTimeout(() => {
          navigate("/settings/shift");
        }, 1500);
      } else {
        setError(response.message || (isEditMode ? t("shiftManagement.form.notifications.errUpdate") : t("shiftManagement.form.notifications.errCreate")));
      }
    } catch (err) {
      setError(err.message || (isEditMode ? t("shiftManagement.form.notifications.errUpdate") : t("shiftManagement.form.notifications.errCreate")));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">{t("shiftManagement.form.loadingData")}</div>;

  return (
    <div className="shift-manager">
      <div className="form-container card">
        <div className="form-header">
          <h1>{isEditMode ? t("shiftManagement.form.titleEdit") : t("shiftManagement.form.titleAdd")}</h1>
          <button className="btn btn-secondary" onClick={() => navigate("/settings/shift")}>
            {t("shiftManagement.form.buttons.back")}
          </button>
        </div>

        {submitSuccess && <div className="alert success">{submitSuccess}</div>}
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="shift-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="shiftName">{t("shiftManagement.form.labels.shiftName")} *</label>
              <input
                type="text"
                id="shiftName"
                name="shiftName"
                value={formData.shiftName}
                onChange={handleFormChange}
                className={formErrors.shiftName ? "error" : ""}
              />
              {formErrors.shiftName && <span className="error-msg">{formErrors.shiftName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="shiftType">{t("shiftManagement.form.labels.shiftType")}</label>
              <select
                id="shiftType"
                name="shiftType"
                value={formData.shiftType}
                onChange={handleFormChange}
              >
                {SHIFT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">{t("shiftManagement.form.labels.startTime")} *</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleFormChange}
                className={formErrors.startTime ? "error" : ""}
              />
              {formErrors.startTime && <span className="error-msg">{formErrors.startTime}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endTime">{t("shiftManagement.form.labels.endTime")} *</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleFormChange}
                className={formErrors.endTime ? "error" : ""}
              />
              {formErrors.endTime && <span className="error-msg">{formErrors.endTime}</span>}
            </div>
          </div>

          <div className="form-row preview-row">
            <div className="preview-item">
              <span className="preview-label">{t("shiftManagement.form.previews.crossesMidnight")}</span>
              <span className="preview-value">
                {computedCrossDay ? t("shiftManagement.form.previews.yes") : t("shiftManagement.form.previews.no")}
              </span>
            </div>
            <div className="preview-item">
              <span className="preview-label">{t("shiftManagement.form.previews.workingMinutes")}</span>
              <span className="preview-value">{computedWorkingMinutes}</span>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gracePeriodMinutes">{t("shiftManagement.form.labels.gracePeriod")}</label>
              <input
                type="number"
                id="gracePeriodMinutes"
                name="gracePeriodMinutes"
                min="0"
                value={formData.gracePeriodMinutes}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="breakMinutes">{t("shiftManagement.form.labels.break")}</label>
              <input
                type="number"
                id="breakMinutes"
                name="breakMinutes"
                min="0"
                value={formData.breakMinutes}
                onChange={handleFormChange}
              />
              {formErrors.breakMinutes && <span className="error-msg">{formErrors.breakMinutes}</span>}
            </div>
          </div>

          <div className="form-row checkbox-row">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="overtimeAllowed"
                  checked={formData.overtimeAllowed}
                  onChange={handleFormChange}
                />
                {t("shiftManagement.form.labels.allowOvertime")}
              </label>
            </div>
            {formData.overtimeAllowed && (
              <div className="form-group">
                <label htmlFor="maxOvertimeMinutes">{t("shiftManagement.form.labels.maxOvertime")}</label>
                <input
                  type="number"
                  id="maxOvertimeMinutes"
                  name="maxOvertimeMinutes"
                  min="1"
                  value={formData.maxOvertimeMinutes}
                  onChange={handleFormChange}
                  className={formErrors.maxOvertimeMinutes ? "error" : ""}
                />
                {formErrors.maxOvertimeMinutes && (
                  <span className="error-msg">{formErrors.maxOvertimeMinutes}</span>
                )}
              </div>
            )}
          </div>

          <div className="form-row checkbox-row">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="flexibleStart"
                  checked={formData.flexibleStart}
                  onChange={handleFormChange}
                />
                {t("shiftManagement.form.labels.flexibleStartEnd")}
              </label>
            </div>
            {formData.flexibleStart && (
              <>
                <div className="form-group">
                  <label htmlFor="earlyCheckinMinutes">{t("shiftManagement.form.labels.earlyCheckin")}</label>
                  <input
                    type="number"
                    id="earlyCheckinMinutes"
                    name="earlyCheckinMinutes"
                    min="0"
                    value={formData.earlyCheckinMinutes}
                    onChange={handleFormChange}
                    className={formErrors.earlyCheckinMinutes ? "error" : ""}
                  />
                  {formErrors.earlyCheckinMinutes && (
                    <span className="error-msg">{formErrors.earlyCheckinMinutes}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="lateCheckoutMinutes">{t("shiftManagement.form.labels.lateCheckout")}</label>
                  <input
                    type="number"
                    id="lateCheckoutMinutes"
                    name="lateCheckoutMinutes"
                    min="0"
                    value={formData.lateCheckoutMinutes}
                    onChange={handleFormChange}
                    className={formErrors.lateCheckoutMinutes ? "error" : ""}
                  />
                  {formErrors.lateCheckoutMinutes && (
                    <span className="error-msg">{formErrors.lateCheckoutMinutes}</span>
                  )}
                </div>
              </>
            )}
          </div>

          {formErrors.workingMinutes && <div className="alert error">{formErrors.workingMinutes}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting 
                ? (isEditMode ? t("shiftManagement.form.buttons.updating") : t("shiftManagement.form.buttons.adding")) 
                : (isEditMode ? t("shiftManagement.form.buttons.updateShift") : t("shiftManagement.form.buttons.addShift"))}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/settings/shift")}>
              {t("shiftManagement.form.buttons.cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShiftForm;