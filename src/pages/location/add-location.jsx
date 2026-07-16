import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next"; // ADDED
import { LocationService } from "../../services/locationService";
import { useNotification } from "../../context/NotificationContext";
import LoadingSpinner from "../../component/loading-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useConfirm from "../../hooks/useConfirm";
import {
  faLocationDot,
  faRedoAlt
} from "@fortawesome/free-solid-svg-icons";
import "./css/add-location.css";

const AddLocation = () => {
  const { t } = useTranslation("location"); // ADDED
  const { showNotification } = useNotification();

  const initialFormState = {
    name: "",
    nameAr: "",
    code: "",
    description: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [errors, setErrors] = useState({});
  const [saveState, setSaveState] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirm, ModalComponent } = useConfirm();

  const handleReset = () => {
    setResetting(true);
    setSaveState(false);
    setTimeout(() => {
      setFormData(initialFormState);
      setErrors({});
      setResetting(false);
    }, 300);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return !value ? t('addLocation.validation.nameRequired') : ''; // optional validation keys
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = t('addLocation.validation.nameRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await Swal.fire({
      title: t('addLocation.confirmTitle'),
      text: t('addLocation.confirmText'),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "rgb(51, 221, 190)",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t('addLocation.confirmButton'),
    });

    if (!result.isConfirmed) return;

    setError(null);
    setLoading(true);
    setSaveState(true);

    try {
      const response = await LocationService.createLocation(formData);
      if (response.success)
        showNotification(t('addLocation.successMessage'), "success");
    } catch (error) {
      const message = error?.message || "Network error. Please check your connection";
      showNotification(t('addLocation.errorMessage'), "error");
      setErrors(true);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || resetting;

  return (
    <div className="location-container">
      <div className="company-logo">
        <h1 className="text-logo">{t('addLocation.title')}</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          <label htmlFor="name">{t('addLocation.nameLabel')}</label>
          <input
            name="name"
            placeholder={t('addLocation.namePlaceholder')}
            onChange={handleChange}
            value={formData.name || ""}
            required
            className={errors.name ? 'error-input' : ''}
          />
          {errors.name && (
            <span className="error-message">{errors.name}</span>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="nameAr">{t('addLocation.nameArLabel')}</label>
          <input
            name="nameAr"
            placeholder={t('addLocation.nameArPlaceholder')}
            onChange={handleChange}
            value={formData.nameAr || ""}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="description">{t('addLocation.descriptionLabel')}</label>
          <textarea
            rows="5"
            name="description"
            placeholder={t('addLocation.descriptionPlaceholder')}
            onChange={handleChange}
            value={formData.description || ""}
          />
        </div>

        <div className="button-group">
          <button
            type="submit"
            disabled={saveState}
            className="submit-button"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                {t('addLocation.submitLoading')}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faLocationDot} />
                {"      "}
                {t('addLocation.submitButton')}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="reset-button"
            disabled={!saveState}
          >
            <FontAwesomeIcon icon={faRedoAlt} />
            {"      "}
            {t('addLocation.resetButton')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLocation;