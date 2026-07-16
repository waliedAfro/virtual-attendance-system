// EditLocation.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./css/location-modal.css";

const EditLocation = ({ location, onClose, onSave, onView }) => {
  const { t } = useTranslation("location");

  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    nameAr: "",
    code: "",
    type: "",
    description: "",
    descriptionAr: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    latitude: "",
    longitude: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    area: "",
    active: true
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || "",
        nameEn: location.nameEn || location.name || "",
        nameAr: location.nameAr || "",
        code: location.code || "",
        type: location.type || "",
        description: location.description || "",
        descriptionAr: location.descriptionAr || "",
        address: location.address || "",
        city: location.city || "",
        state: location.state || "",
        country: location.country || "",
        postalCode: location.postalCode || "",
        latitude: location.latitude?.toString() || "",
        longitude: location.longitude?.toString() || "",
        contactPerson: location.contactPerson || "",
        contactEmail: location.contactEmail || "",
        contactPhone: location.contactPhone || "",
        area: location.area?.toString() || "",
        active: location.active !== undefined ? location.active : true
      });
    }
  }, [location]);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
      case "nameEn":
        if (!value?.trim()) return t("editLocation.validation.nameRequired");
        if (value.length < 2) return t("editLocation.validation.nameMinLength");
        if (value.length > 100) return t("editLocation.validation.nameMaxLength");
        break;
      
      case "code":
        if (!value?.trim()) return t("editLocation.validation.codeRequired");
        if (!/^[A-Za-z0-9_-]+$/.test(value)) return t("editLocation.validation.codeInvalid");
        if (value.length > 50) return t("editLocation.validation.codeMaxLength");
        break;
      
      case "contactEmail":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return t("editLocation.validation.emailInvalid");
        }
        break;
      
      case "contactPhone":
        if (value && !/^[\d\s\-+()]+$/.test(value)) {
          return t("editLocation.validation.phoneInvalid");
        }
        break;
      
      case "latitude":
        if (value && (value < -90 || value > 90)) {
          return t("editLocation.validation.latitudeRange");
        }
        break;
      
      case "longitude":
        if (value && (value < -180 || value > 180)) {
          return t("editLocation.validation.longitudeRange");
        }
        break;
      
      case "area":
        if (value && value < 0) {
          return t("editLocation.validation.areaNegative");
        }
        break;
      
      default:
        break;
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const nameValue = formData.nameEn || formData.name;
    if (!nameValue?.trim()) {
      newErrors.name = t("editLocation.validation.nameRequired");
    }
    
    if (!formData.code?.trim()) {
      newErrors.code = t("editLocation.validation.codeRequired");
    }
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allTouched = {};
    Object.keys(formData).forEach(key => allTouched[key] = true);
    setTouched(allTouched);
    
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        const submitData = {
          ...formData,
          id: location.id,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
          area: formData.area ? parseFloat(formData.area) : null,
          name: formData.nameEn || formData.name
        };
        await onSave(submitData);
        
      } catch (error) {
        setErrors({ submit: error.message || t("editLocation.saveError") });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("editLocation.title")}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Basic Information Section */}
          <div className="form-section">
            <h3>{t("editLocation.basicInfo")}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nameEn">
                  {t("editLocation.nameEnLabel")} <span className="required"></span>
                </label>
                <input
                  type="text"
                  id="nameEn"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.nameEn ? "error" : ""}
                  placeholder={t("editLocation.nameEnPlaceholder")}
                />
                {errors.nameEn && <span className="error-message">{errors.nameEn}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="nameAr">{t("editLocation.nameArLabel")}</label>
                <input
                  type="text"
                  id="nameAr"
                  name="nameAr"
                  value={formData.nameAr}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`arabic-input ${errors.nameAr ? "error" : ""}`}
                  placeholder={t("editLocation.nameArPlaceholder")}
                  dir="rtl"
                />
                {errors.nameAr && <span className="error-message">{errors.nameAr}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="code">
                  {t("editLocation.codeLabel")} <span className="required"></span>
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.code ? "error" : ""}
                  placeholder={t("editLocation.codePlaceholder")}
                />
                {errors.code && <span className="error-message">{errors.code}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="type">{t("editLocation.typeLabel")}</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.type ? "error" : ""}
                >
                  <option value="">{t("editLocation.typePlaceholder")}</option>
                  <option value="WAREHOUSE">{t("editLocation.typeOptions.warehouse")}</option>
                  <option value="OFFICE">{t("editLocation.typeOptions.office")}</option>
                  <option value="RETAIL">{t("editLocation.typeOptions.retail")}</option>
                  <option value="FACTORY">{t("editLocation.typeOptions.factory")}</option>
                  <option value="BRANCH">{t("editLocation.typeOptions.branch")}</option>
                  <option value="OTHER">{t("editLocation.typeOptions.other")}</option>
                </select>
                {errors.type && <span className="error-message">{errors.type}</span>}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="form-section">
            <h3>{t("editLocation.descriptionSection")}</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="description">{t("editLocation.descriptionEnLabel")}</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="3"
                  placeholder={t("editLocation.descriptionEnPlaceholder")}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="descriptionAr">{t("editLocation.descriptionArLabel")}</label>
                <textarea
                  id="descriptionAr"
                  name="descriptionAr"
                  value={formData.descriptionAr}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows="3"
                  className="arabic-input"
                  placeholder={t("editLocation.descriptionArPlaceholder")}
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="form-section">
            <h3>{t("editLocation.addressSection")}</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="address">{t("editLocation.streetAddressLabel")}</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t("editLocation.streetAddressPlaceholder")}
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">{t("editLocation.cityLabel")}</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={t("editLocation.cityPlaceholder")}
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">{t("editLocation.stateLabel")}</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder={t("editLocation.statePlaceholder")}
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">{t("editLocation.countryLabel")}</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder={t("editLocation.countryPlaceholder")}
                />
              </div>

              <div className="form-group">
                <label htmlFor="postalCode">{t("editLocation.postalCodeLabel")}</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder={t("editLocation.postalCodePlaceholder")}
                />
              </div>
            </div>
          </div>

          {/* Geographic Coordinates */}
          <div className="form-section">
            <h3>{t("editLocation.coordinatesSection")}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="latitude">{t("editLocation.latitudeLabel")}</label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  step="0.000001"
                  min="-90"
                  max="90"
                  placeholder={t("editLocation.latitudePlaceholder")}
                  className={errors.latitude ? "error" : ""}
                />
                {errors.latitude && <span className="error-message">{errors.latitude}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="longitude">{t("editLocation.longitudeLabel")}</label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  step="0.000001"
                  min="-180"
                  max="180"
                  placeholder={t("editLocation.longitudePlaceholder")}
                  className={errors.longitude ? "error" : ""}
                />
                {errors.longitude && <span className="error-message">{errors.longitude}</span>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3>{t("editLocation.contactSection")}</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="contactPerson">{t("editLocation.contactPersonLabel")}</label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder={t("editLocation.contactPersonPlaceholder")}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactEmail">{t("editLocation.contactEmailLabel")}</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("editLocation.contactEmailPlaceholder")}
                  className={errors.contactEmail ? "error" : ""}
                />
                {errors.contactEmail && <span className="error-message">{errors.contactEmail}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="contactPhone">{t("editLocation.contactPhoneLabel")}</label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("editLocation.contactPhonePlaceholder")}
                  className={errors.contactPhone ? "error" : ""}
                />
                {errors.contactPhone && <span className="error-message">{errors.contactPhone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="area">{t("editLocation.areaLabel")}</label>
                <input
                  type="number"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="0"
                  step="0.01"
                  placeholder={t("editLocation.areaPlaceholder")}
                  className={errors.area ? "error" : ""}
                />
                {errors.area && <span className="error-message">{errors.area}</span>}
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="form-section">
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="active"
                  checked={formData.active}
                  onChange={handleChange}
                />
                <span className="checkbox-text">{t("editLocation.activeLabel")}</span>
              </label>
            </div>
          </div>

          {errors.submit && (
            <div className="error-banner">
              {errors.submit}
            </div>
          )}
        </form>

        <div className="modal-footer">
          <div className="footer-left">
            {onView && (
              <button type="button" className="view-button" onClick={() => onView(location)}>
                {t("editLocation.viewButton")}
              </button>
            )}
          </div>
          <div className="footer-right">
            <button type="button" className="cancel-button" onClick={onClose}>
              {t("editLocation.cancelButton")}
            </button>
            <button 
              type="submit" 
              className="save-button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("editLocation.savingButton") : t("editLocation.saveButton")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLocation;