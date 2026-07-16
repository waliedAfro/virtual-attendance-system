import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // ADDED
import "./css/location-modal.css";
import { LocationService } from "../../services/locationService";
import toast from "react-hot-toast";
import useConfirm from "../../hooks/useConfirm";

const DeleteLocation = ({ location, onClose, onDeleteSuccess }) => {
  const { t } = useTranslation("location"); // ADDED
  const [deleteReason, setDeleteReason] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { confirm, ModalComponent } = useConfirm();

  useEffect(() => {
    if (location) {
      setDeleteReason(location.deleteReason || "");
    }
  }, [location]);

  const validateForm = () => {
    const newErrors = {};
    if (!deleteReason?.trim()) {
      newErrors.deleteReason = t('deleteLocation.reasonRequired');
    } else if (deleteReason.trim().length < 3) {
      newErrors.deleteReason = t('deleteLocation.reasonMinLength');
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const confirmed = await confirm(
      t('deleteLocation.confirmMessage', { locationName: location.name }),
      t('deleteLocation.confirmTitle')
    );
    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      const response = await LocationService.deleteLocation({
        locationId: location.id,
        deleteReason: deleteReason.trim(),
      });

      if (response.success) {
        toast.success(t('deleteLocation.successMessage'));
        if (onDeleteSuccess) onDeleteSuccess(location.id);
        onClose();
      } else {
        throw new Error(response.message || t('deleteLocation.submitError'));
      }
    } catch (err) {
      toast.error(err.message || t('deleteLocation.submitError'));
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('deleteLocation.title')}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-section">
            <h3>{t('deleteLocation.sectionTitle')}</h3>
            <div className="form-group full-width">
              <label htmlFor="deleteReason">{t('deleteLocation.reasonLabel')}</label>
              <textarea
                id="deleteReason"
                name="deleteReason"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                rows="3"
                placeholder={t('deleteLocation.reasonPlaceholder')}
              />
              {errors.deleteReason && (
                <span className="error-message">{errors.deleteReason}</span>
              )}
            </div>
            {errors.submit && (
              <div className="error-message submit-error">{errors.submit}</div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              {t('deleteLocation.cancelButton')}
            </button>
            <button
              type="submit"
              className="delete-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('deleteLocation.deletingButton') : t('deleteLocation.deleteButton')}
            </button>
          </div>
        </form>
        <ModalComponent />
      </div>
    </div>
  );
};

export default DeleteLocation;