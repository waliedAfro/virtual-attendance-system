import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DeviceService } from "../../services/deviceService";
import { LocationService } from "../../services/locationService";
import useApi from "../../hooks/useApi";
import { useNotification } from "../../context/NotificationContext";
import LoadingSpinner from "../../component/loading-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useConfirm from "../../hooks/useConfirm";
import "./css/add-device.css";

const AddDevice = () => {
  const { t } = useTranslation("device");

  // Initial empty form state
  const initialFormState = {
    deviceName: "",
    deviceCode: "",
    deviceStatus: "",
    latitude: 25.285447,
    longitude: 51.531040,
    altitude: 12,
    accuracy: 15,
    radiusMeter: 20,
    floorLevel: "",
    locationId: "",
    deviceType: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [saveState, setSaveState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const { showNotification } = useNotification();
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { confirm, ModalComponent } = useConfirm();

  const {
    data: locations,
    loading: locationLoading,
    error: locationError,
    execute: referish,
  } = useApi(LocationService.getLocations, [], true);

  const handleReset = () => {
    setResetting(true);
    setSaveState(false);
    setTimeout(() => {
      setFormData(initialFormState);
      setErrors({});
      setResetting(false);
    }, 300);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await Swal.fire({
      title: t("addDevice.swal.title"),
      text: t("addDevice.swal.text"),
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "rgb(51, 221, 190)",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("addDevice.swal.confirmButton"),
    });

    if (!result.isConfirmed) return;

    setError(null);
    setLoading(true);
    setSaveState(true);

    try {
      const response = await DeviceService.createDevice(formData);
      showNotification(t("addDevice.notifications.success"), "success");
    } catch (error) {
      showNotification(t("addDevice.notifications.error"), "error");
      setSaveState(false);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.deviceName) newErrors.deviceName = t("addDevice.errors.deviceNameRequired");
    if (!formData.latitude) newErrors.latitude = t("addDevice.errors.latitudeRequired");
    if (!formData.longitude) newErrors.longitude = t("addDevice.errors.longitudeRequired");
    if (!formData.altitude || formData.altitude) {
      if (formData.altitude === "") {
        newErrors.altitude = t("addDevice.errors.altitudeRequired");
      }
      const num = Number(formData.altitude);
      if (!Number.isInteger(num)) {
        newErrors.altitude = t("addDevice.errors.altitudeInteger");
      }
      if (num <= 0) {
        newErrors.altitude = t("addDevice.errors.altitudePositive");
      }
    }
    if (!formData.accuracy || formData.accuracy) {
      if (formData.accuracy === "") {
        newErrors.accuracy = t("addDevice.errors.accuracyRequired");
      }
      const num = Number(formData.altitude);
      if (!Number.isInteger(num)) {
        newErrors.accuracy = t("addDevice.errors.accuracyInteger");
      }
      if (num <= 0) {
        newErrors.accuracy = t("addDevice.errors.accuracyPositive");
      }
    }
    if (!formData.radiusMeter) newErrors.radiusMeter = t("addDevice.errors.radiusRequired");
    if (!formData.locationId) newErrors.locationId = t("addDevice.errors.locationRequired");
    if (!formData.deviceType) newErrors.deviceType = t("addDevice.errors.deviceTypeRequired");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="device-container">
      <div className="company-logo">
        <h1 className="text-logo">{t("addDevice.title")}</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          <label htmlFor="deviceName">{t("addDevice.deviceNameLabel")}</label>
          <input
            name="deviceName"
            placeholder={t("addDevice.deviceNamePlaceholder")}
            maxLength={100}
            onChange={handleChange}
            value={formData.deviceName || ""}
            required
            className={errors.deviceName ? "error-input" : ""}
          />
          {errors.deviceName && <span className="error-message">{errors.deviceName}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="deviceCode">{t("addDevice.deviceTypeLabel")}</label>
          <select
            name="deviceType"
            value={formData.deviceType}
            onChange={handleChange}
            required
            className={errors.deviceType ? "error-input" : ""}
          >
            <option value="">{t("addDevice.deviceTypeSelectDefault")}</option>
            <option value="QR">{t("addDevice.deviceTypeOptions.qr")}</option>
            <option value="VR">{t("addDevice.deviceTypeOptions.vr")}</option>
            <option value="IPS">{t("addDevice.deviceTypeOptions.ips")}</option>
          </select>
          {errors.deviceName && <span className="error-message">{errors.deviceName}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="locationId">{t("addDevice.locationLabel")}</label>
          <select
            name="locationId"
            value={formData.locationId}
            onChange={handleChange}
            required
            className={errors.locationId ? "error-input" : ""}
            disabled={locationLoading}
            style={{ opacity: locationLoading ? 0.7 : 1 }}
          >
            <option value="">
              {locationLoading
                ? t("addDevice.locationLoading")
                : t("addDevice.locationSelectDefault")}
            </option>
            {!locationLoading &&
              locations?.map((local) => (
                <option key={local.id} value={local.id}>
                  {local.name}
                </option>
              ))}
          </select>
          {errors.locationId && <span className="error-message">{errors.locationId}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="latitude">{t("addDevice.latitudeLabel")}</label>
          <input
            type="number"
            name="latitude"
            placeholder={t("addDevice.latitudePlaceholder")}
            onChange={handleChange}
            value={formData.latitude}
            step="any"
            min="-90"
            max="90"
            required
            className={errors.latitude ? "error-input" : ""}
          />
          {errors.latitude && <span className="error-message">{errors.latitude}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="longitude">{t("addDevice.longitudeLabel")}</label>
          <input
            type="number"
            name="longitude"
            placeholder={t("addDevice.longitudePlaceholder")}
            onChange={handleChange}
            value={formData.longitude}
            required
            step="any"
            min="-180"
            max="180"
            className={errors.longitude ? "error-input" : ""}
          />
          {errors.longitude && <span className="error-message">{errors.longitude}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="altitude">{t("addDevice.altitudeLabel")}</label>
          <input
            type="number"
            name="altitude"
            placeholder={t("addDevice.altitudePlaceholder")}
            onChange={handleChange}
            value={formData.altitude}
            required
            className={errors.altitude ? "error-input" : ""}
            step="0.1"
          />
          {errors.altitude && <span className="error-message">{errors.altitude}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="accuracy">{t("addDevice.accuracyLabel")}</label>
          <input
            type="number"
            name="accuracy"
            placeholder={t("addDevice.accuracyPlaceholder")}
            onChange={handleChange}
            value={formData.accuracy}
            required
            className={errors.accuracy ? "error-input" : ""}
            step="1"
          />
          {errors.accuracy && <span className="error-message">{errors.accuracy}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="radiusMeter">{t("addDevice.radiusLabel")}</label>
          <input
            type="number"
            name="radiusMeter"
            placeholder={t("addDevice.radiusPlaceholder")}
            onChange={handleChange}
            value={formData.radiusMeter}
            className={errors.radiusMeter ? "error-input" : ""}
            required
            step="0.1"
            min="1"
          />
          {errors.radiusMeter && <span className="error-message">{errors.radiusMeter}</span>}
        </div>

        <div className="input-group">
          <label htmlFor="floorLevel">{t("addDevice.floorLevelLabel")}</label>
          <input
            name="floorLevel"
            placeholder={t("addDevice.floorLevelPlaceholder")}
            onChange={handleChange}
            value={formData.floorLevel}
          />
        </div>

        <div className="device-button-group">
          <button type="submit" disabled={saveState}>
            {loading ? (
              <>
                <LoadingSpinner size="small" /> {t("addDevice.addingButton")}
              </>
            ) : (
              t("addDevice.addButton")
            )}
          </button>

          <button type="button" onClick={handleReset} disabled={!saveState}>
            <FontAwesomeIcon icon={faRedoAlt} />
            {"      "}
            {t("addDevice.resetButton")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDevice;