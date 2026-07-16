import React from "react";
import { useTranslation } from "react-i18next";
import "./css/view-device.css";

const ViewDevice = ({ device, onClose, deviceType }) => {
  const { t } = useTranslation("device");

  if (!device) return null;

  const formatDate = (dateString) => {
    if (!dateString) return t("viewDevice.notAvailable");
    return new Date(dateString).toLocaleString();
  };

  const getStatusClass = (status) => {
    return status?.toLowerCase() === "active" ? "status-active" : "status-inactive";
  };

  return (
    <div className="modal-overlay">
      <div className="view-modal-container view-device-modal">
        <div className="modal-header">
          <h2>{t("viewDevice.title")}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="device-info-grid">
            <div className="info-section">
              <h3>{t("viewDevice.sections.basicInformation")}</h3>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.deviceName")}</span>
                <span className="info-value">{device.deviceName}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.deviceCode")}</span>
                <span className="info-value">{device.deviceCode}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.status")}</span>
                <span className={`info-value status-badge ${getStatusClass(device.status)}`}>
                  {device.status || t("viewDevice.unknown")}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.deviceType")}</span>
                <span className="info-value">{deviceType[device.deviceType] || t("viewDevice.notAvailable")}</span>
              </div>
            </div>

            <div className="info-section">
              <h3>{t("viewDevice.sections.locationInformation")}</h3>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.location")}</span>
                <span className="info-value">{device.locationName || t("viewDevice.notAvailable")}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.floorLevel")}</span>
                <span className="info-value">{device.floorLevel || t("viewDevice.notAvailable")}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.building")}</span>
                <span className="info-value">{device.buildingName || t("viewDevice.notAvailable")}</span>
              </div>
            </div>

            <div className="info-section">
              <h3>{t("viewDevice.sections.geographicCoordinates")}</h3>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.latitude")}</span>
                <span className="info-value">{device.latitude || t("viewDevice.notAvailable")}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.longitude")}</span>
                <span className="info-value">{device.longitude || t("viewDevice.notAvailable")}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.altitude")}</span>
                <span className="info-value">{device.altitude ? `${device.altitude}m` : t("viewDevice.notAvailable")}</span>
              </div>
            </div>

            <div className="info-section">
              <h3>{t("viewDevice.sections.geofenceSettings")}</h3>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.radius")}</span>
                <span className="info-value">{device.radiusMeter ? `${device.radiusMeter}m` : t("viewDevice.notAvailable")}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.accuracy")}</span>
                <span className="info-value">{device.accuracy ? `±${device.accuracy}m` : t("viewDevice.notAvailable")}</span>
              </div>
            </div>

            <div className="info-section">
              <h3>{t("viewDevice.sections.additionalInformation")}</h3>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.manufacturer")}</span>
                <span className="info-value">{device.manufacturer || t("viewDevice.notAvailable")}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.model")}</span>
                <span className="info-value">{device.model || t("viewDevice.notAvailable")}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.firmware")}</span>
                <span className="info-value">{device.firmwareVersion || t("viewDevice.notAvailable")}</span>
              </div>
            </div>

            <div className="info-section">
              <h3>{t("viewDevice.sections.timestamps")}</h3>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.createdAt")}</span>
                <span className="info-value">{formatDate(device.createdAt)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.updatedAt")}</span>
                <span className="info-value">{formatDate(device.updatedAt)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{t("viewDevice.lastCommunication")}</span>
                <span className="info-value">{formatDate(device.lastCommunication)}</span>
              </div>
            </div>
          </div>

          {device.description && (
            <div className="description-section">
              <h3>{t("viewDevice.sections.description")}</h3>
              <p className="description-text">{device.description}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            {t("viewDevice.closeButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDevice;