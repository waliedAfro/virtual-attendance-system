import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./css/edit-device.css";
import useApi from "../../hooks/useApi";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useConfirm from "../../hooks/useConfirm";
import { LocationService } from "../../services/locationService";

const EditDevice = ({ device, onClose, onSave, onView, deviceType }) => {
  const { t } = useTranslation("device");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirm, ModalComponent } = useConfirm();

  const [formData, setFormData] = useState({
    deviceName: "",
    deviceCode: "",
    status: "ACTIVE",
    deviceType: "",
    locationId: "",
    floorLevel: "",
    buildingName: "",
    latitude: "",
    longitude: "",
    altitude: "",
    radiusMeter: "",
    accuracy: "",
    manufacturer: "",
    model: "",
    firmwareVersion: "",
    description: "",
    deviceId: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: locations,
    loading: locationLoading,
    error: locationError,
    execute: referish,
  } = useApi(LocationService.getLocations, [], true);

  useEffect(() => {
    if (device) {
      setFormData({
        deviceName: device.deviceName || "",
        deviceCode: device.deviceCode || "",
        status: device.status || "ACTIVE",
        deviceType: device.deviceType || "",
        locationId: device.locationId || "",
        floorLevel: device.floorLevel || "",
        buildingName: device.buildingName || "",
        latitude: device.latitude || "",
        longitude: device.longitude || "",
        altitude: device.altitude || "",
        radiusMeter: device.radiusMeter || "",
        accuracy: device.accuracy || "",
        manufacturer: device.manufacturer || "",
        model: device.model || "",
        firmwareVersion: device.firmwareVersion || "",
        description: device.description || "",
        deviceId: device.deviceId,
      });
    }
  }, [device]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.deviceName.trim()) {
      newErrors.deviceName = t("editDevice.errors.deviceNameRequired");
    }
    if (!formData.deviceCode.trim()) {
      newErrors.deviceCode = t("editDevice.errors.deviceCodeRequired");
    }
    if (!formData.status) {
      newErrors.status = t("editDevice.errors.statusRequired");
    }
    if (formData.latitude && (formData.latitude < -90 || formData.latitude > 90)) {
      newErrors.latitude = t("editDevice.errors.latitudeRange");
    }
    if (formData.longitude && (formData.longitude < -180 || formData.longitude > 180)) {
      newErrors.longitude = t("editDevice.errors.longitudeRange");
    }
    if (formData.radiusMeter && formData.radiusMeter < 0) {
      newErrors.radiusMeter = t("editDevice.errors.radiusPositive");
    }
    if (formData.accuracy && formData.accuracy < 0) {
      newErrors.accuracy = t("editDevice.errors.accuracyPositive");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await Swal.fire({
      title: t("editDevice.swal.title"),
      text: t("editDevice.swal.text"),
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#cacdd0",
      confirmButtonText: t("editDevice.swal.confirmButton"),
    });

    if (!result.isConfirmed) return;

    const loadingToastId = toast.loading(t("editDevice.toast.updating"));
    setError(null);
    setIsSubmitting(true);

    try {
      const submissionData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        altitude: formData.altitude ? parseFloat(formData.altitude) : null,
        radiusMeter: formData.radiusMeter ? parseInt(formData.radiusMeter) : null,
        accuracy: formData.accuracy ? parseFloat(formData.accuracy) : null,
      };

      await onSave(submissionData);
      toast.dismiss(loadingToastId);
      onClose();
    } catch (err) {
      setErrors({ submit: error.message || t("editDevice.toast.failed") });
      toast.dismiss(loadingToastId);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        t("editDevice.toast.failed");
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="edit-modal-container edit-device-modal">
        <div className="modal-header">
          <h2>{t("editDevice.title")}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="modal-body">
              {errors.submit && <div className="error-message">{errors.submit}</div>}

              <div className="form-section">
                <h3>{t("editDevice.sections.basicInformation")}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="deviceName">{t("editDevice.deviceNameLabel")}</label>
                    <input
                      type="text"
                      id="deviceName"
                      name="deviceName"
                      value={formData.deviceName}
                      onChange={handleChange}
                      className={errors.deviceName ? "error" : ""}
                    />
                    {errors.deviceName && <span className="field-error">{errors.deviceName}</span>}
                  </div>

                  <div className="form-group">
                    <span className="info-label">{t("editDevice.deviceCodeLabel")}</span>
                    <span className="info-value-edit">{device.deviceCode}</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="status">{t("editDevice.statusLabel")}</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={errors.status ? "error" : ""}
                    >
                      <option value="ACTIVE">{t("editDevice.statusOptions.active")}</option>
                      <option value="INACTIVE">{t("editDevice.statusOptions.inactive")}</option>
                      <option value="RETIRED">{t("editDevice.statusOptions.retired")}</option>
                    </select>
                    {errors.status && <span className="field-error">{errors.status}</span>}
                  </div>
                  <div className="form-group">
                    <span className="info-label">{t("editDevice.deviceTypeLabel")}</span>
                    <span className="info-value-edit">
                      {deviceType[formData.deviceType]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>{t("editDevice.sections.locationInformation")}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="locationId">{t("editDevice.locationLabel")}</label>
                    <select
                      id="locationId"
                      name="locationId"
                      value={formData.locationId}
                      onChange={handleChange}
                    >
                      <option value="">{t("editDevice.locationSelectDefault")}</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="floorLevel">{t("editDevice.floorLevelLabel")}</label>
                    <input
                      type="text"
                      id="floorLevel"
                      name="floorLevel"
                      value={formData.floorLevel}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="buildingName">{t("editDevice.buildingLabel")}</label>
                    <input
                      type="text"
                      id="buildingName"
                      name="buildingName"
                      value={formData.buildingName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>{t("editDevice.sections.geographicCoordinates")}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <span className="info-label">{t("editDevice.latitudeLabel")}</span>
                    <span className="info-value-edit">{formData.latitude}</span>
                  </div>

                  <div className="form-group">
                    <span className="info-label">{t("editDevice.longitudeLabel")}</span>
                    <span className="info-value-edit">{formData.longitude}</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <span className="info-label">{t("editDevice.altitudeLabel")}</span>
                    <span className="info-value-edit">{formData.altitude}</span>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>{t("editDevice.sections.geofenceSettings")}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="radiusMeter">{t("editDevice.radiusLabel")}</label>
                    <input
                      type="number"
                      id="radiusMeter"
                      name="radiusMeter"
                      min="0"
                      value={formData.radiusMeter}
                      onChange={handleChange}
                      className={errors.radiusMeter ? "error" : ""}
                    />
                    {errors.radiusMeter && <span className="field-error">{errors.radiusMeter}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="accuracy">{t("editDevice.accuracyLabel")}</label>
                    <input
                      type="number"
                      id="accuracy"
                      name="accuracy"
                      min="0"
                      step="any"
                      value={formData.accuracy}
                      onChange={handleChange}
                      className={errors.accuracy ? "error" : ""}
                    />
                    {errors.accuracy && <span className="field-error">{errors.accuracy}</span>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>{t("editDevice.sections.technicalDetails")}</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="manufacturer">{t("editDevice.manufacturerLabel")}</label>
                    <input
                      type="text"
                      id="manufacturer"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="model">{t("editDevice.modelLabel")}</label>
                    <input
                      type="text"
                      id="model"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firmwareVersion">{t("editDevice.firmwareLabel")}</label>
                    <input
                      type="text"
                      id="firmwareVersion"
                      name="firmwareVersion"
                      value={formData.firmwareVersion}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>{t("editDevice.sections.description")}</h3>
                <div className="form-group">
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={t("editDevice.descriptionPlaceholder")}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={onClose}>
                {t("editDevice.cancelButton")}
              </button>

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("editDevice.savingButton") : t("editDevice.saveButton")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDevice;