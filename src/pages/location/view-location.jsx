import React from "react";
import { useTranslation } from "react-i18next"; // ADDED
import "./css/location-modal.css";

const ViewLocation = ({ location, onClose, onEdit }) => {
  const { t } = useTranslation("location"); // ADDED
  if (!location) return null;

  const formatDate = (dateString) => {
    // ... unchanged ...
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container view-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t('viewLocation.title')}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className={`status-banner ${location.active ? 'active' : 'inactive'}`}>
            <span className="status-indicator"></span>
            {location.active ? t('viewLocation.activeBanner') : t('viewLocation.inactiveBanner')}
          </div>

          <div className="detail-section">
            <h3>{t('viewLocation.basicInfo')}</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">{t('viewLocation.nameEn')}</span>
                <span className="detail-value">{location.nameEn || location.name || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('viewLocation.nameAr')}</span>
                <span className="detail-value arabic-text">{location.nameAr || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('viewLocation.code')}</span>
                <span className="detail-value code">{location.code || "N/A"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{t('viewLocation.type')}</span>
                <span className="detail-value">{location.type || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {(location.description || location.descriptionAr) && (
            <div className="detail-section">
              <h3>{t('viewLocation.descriptionSection')}</h3>
              <div className="description-content">
                {location.description && (
                  <div className="description-item">
                    <span className="detail-label">{t('viewLocation.descriptionEn')}</span>
                    <p className="detail-value">{location.description}</p>
                  </div>
                )}
                {location.descriptionAr && (
                  <div className="description-item">
                    <span className="detail-label arabic-text">{t('viewLocation.descriptionAr')}</span>
                    <p className="detail-value arabic-text">{location.descriptionAr}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Address */}
          {(location.address || location.city || location.country) && (
            <div className="detail-section">
              <h3>{t('viewLocation.addressSection')}</h3>
              <div className="detail-grid">
                {location.address && (
                  <div className="detail-item full-width">
                    <span className="detail-label">{t('viewLocation.streetAddress')}</span>
                    <span className="detail-value">{location.address}</span>
                  </div>
                )}
                {location.city && (
                  <div className="detail-item">
                    <span className="detail-label">{t('viewLocation.city')}</span>
                    <span className="detail-value">{location.city}</span>
                  </div>
                )}
                {location.state && (
                  <div className="detail-item">
                    <span className="detail-label">{t('viewLocation.state')}</span>
                    <span className="detail-value">{location.state}</span>
                  </div>
                )}
                {location.country && (
                  <div className="detail-item">
                    <span className="detail-label">{t('viewLocation.country')}</span>
                    <span className="detail-value">{location.country}</span>
                  </div>
                )}
                {location.postalCode && (
                  <div className="detail-item">
                    <span className="detail-label">{t('viewLocation.postalCode')}</span>
                    <span className="detail-value">{location.postalCode}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Coordinates */}
          {(location.latitude || location.longitude) && (
            <div className="detail-section">
              <h3>{t('viewLocation.coordinatesSection')}</h3>
              <div className="coordinates-display">
                <div className="coordinate-item">
                  <span className="detail-label">{t('viewLocation.latitude')}</span>
                  <span className="detail-value">{location.latitude?.toFixed(6) || "N/A"}</span>
                </div>
                <div className="coordinate-item">
                  <span className="detail-label">{t('viewLocation.longitude')}</span>
                  <span className="detail-value">{location.longitude?.toFixed(6) || "N/A"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Contact */}
          {(location.contactPerson || location.contactEmail || location.contactPhone) && (
            <div className="detail-section">
              <h3>{t('viewLocation.contactSection')}</h3>
              <div className="detail-grid">
                {location.contactPerson && (
                  <div className="detail-item">
                    <span className="detail-label">{t('viewLocation.contactPerson')}</span>
                    <span className="detail-value">{location.contactPerson}</span>
                  </div>
                )}
                {location.contactEmail && (
                  <div className="detail-item">
                    <span className="detail-label">{t('viewLocation.email')}</span>
                    <span className="detail-value"><a href={`mailto:${location.contactEmail}`}>{location.contactEmail}</a></span>
                  </div>
                )}
                {location.contactPhone && (
                  <div className="detail-item">
                    <span className="detail-label">{t('viewLocation.phone')}</span>
                    <span className="detail-value"><a href={`tel:${location.contactPhone}`}>{location.contactPhone}</a></span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Statistics */}
          <div className="detail-section">
            <h3>{t('viewLocation.statistics')}</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-value-large">{location.deviceCount || 0}</span>
                <span className="stat-label">{t('viewLocation.devices')}</span>
              </div>
              <div className="stat-card">
                <span className="stat-value-large">{location.employeeCount || 0}</span>
                <span className="stat-label">{t('viewLocation.employees')}</span>
              </div>
              <div className="stat-card">
                <span className="stat-value-large">{location.area || "N/A"}</span>
                <span className="stat-label">{t('viewLocation.area')}</span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="detail-section metadata">
            <h3>{t('viewLocation.systemInfo')}</h3>
            <div className="metadata-grid">
              <div className="metadata-item">
                <span className="metadata-label">{t('viewLocation.createdBy')}</span>
                <span className="metadata-value">{location.createdBy || "System"}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">{t('viewLocation.createdDate')}</span>
                <span className="metadata-value">{formatDate(location.createdAt)}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">{t('viewLocation.lastModifiedBy')}</span>
                <span className="metadata-value">{location.updatedBy || "System"}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">{t('viewLocation.lastModified')}</span>
                <span className="metadata-value">{formatDate(location.updatedAt)}</span>
              </div>
              <div className="metadata-item">
                <span className="metadata-label">{t('viewLocation.locationId')}</span>
                <span className="metadata-value id">{location.id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {onEdit && (
            <button className="edit-button" onClick={() => onEdit(location)}>
              {t('viewLocation.editButton')}
            </button>
          )}
          <button className="close-button" onClick={onClose}>
            {t('viewLocation.closeButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewLocation;