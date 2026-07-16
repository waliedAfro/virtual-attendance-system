import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faMapMarkerAlt,
  faExpand,
  faCompress,
  faLocationArrow,
  faSearchLocation,
  faCopy,
  faDirections,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import "./css/map-view-modal.css";

const MapViewModal = ({ device, onClose }) => {
  const { t } = useTranslation("device");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const mapRef = useRef(null);
  const iframeRef = useRef(null);

  const latitude = parseFloat(device?.latitude);
  const longitude = parseFloat(device?.longitude);
  const hasValidCoords = !isNaN(latitude) && !isNaN(longitude);

  const getGoogleMapsUrl = () => {
    if (!hasValidCoords) return null;
    const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
    const externalUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    return { embedUrl, externalUrl };
  };

  const getOSMMapsUrl = () => {
    if (!hasValidCoords) return null;
    const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`;
    const externalUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;
    return { embedUrl, externalUrl };
  };

  const [mapProvider, setMapProvider] = useState('google');
  const maps = getGoogleMapsUrl();
  const osmMaps = getOSMMapsUrl();

  const handleFullscreenToggle = () => {
    if (!isFullscreen) {
      if (mapRef.current.requestFullscreen) {
        mapRef.current.requestFullscreen();
      } else if (mapRef.current.webkitRequestFullscreen) {
        mapRef.current.webkitRequestFullscreen();
      } else if (mapRef.current.msRequestFullscreen) {
        mapRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleCopyCoordinates = () => {
    const coords = `${latitude}, ${longitude}`;
    navigator.clipboard.writeText(coords);
  };

  const handleGetDirections = () => {
    const url = maps.externalUrl;
    window.open(url, '_blank');
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
    setMapError(null);
  };

  const handleMapError = () => {
    setMapError(t("mapViewModal.mapError"));
    setMapLoaded(false);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!device) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal map-modal ${isFullscreen ? 'fullscreen' : ''}`}>
        <div className="modal-header">
          <div className="modal-title-section">
            <div className="modal-icon">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <div>
              <h3 className="modal-title">{t("mapViewModal.title")}</h3>
              <p className="modal-subtitle">{device.deviceName}</p>
            </div>
          </div>

          <div className="modal-actions">
            <button
              className="btn-icon"
              onClick={handleFullscreenToggle}
              title={isFullscreen ? t("mapViewModal.exitFullscreenTooltip") : t("mapViewModal.fullscreenTooltip")}
            >
              <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {!hasValidCoords ? (
            <div className="no-coordinates-message">
              <div className="warning-icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <h4>{t("mapViewModal.noCoords.title")}</h4>
              <p>{t("mapViewModal.noCoords.message1")}</p>
              <p>{t("mapViewModal.noCoords.message2")}</p>
            </div>
          ) : (
            <>
              <div className="coordinates-info">
                <div className="coordinates-display">
                  <div className="coordinate-item">
                    <span className="label">{t("mapViewModal.coordinates.latitude")}</span>
                    <span className="value">{latitude.toFixed(6)}</span>
                  </div>
                  <div className="coordinate-item">
                    <span className="label">{t("mapViewModal.coordinates.longitude")}</span>
                    <span className="value">{longitude.toFixed(6)}</span>
                  </div>
                  <button
                    className="btn-icon copy-coordinates"
                    onClick={handleCopyCoordinates}
                    title={t("mapViewModal.copyTooltip")}
                  >
                    <FontAwesomeIcon icon={faCopy} />
                  </button>
                </div>

                <div className="map-controls">
                  <div className="provider-toggle">
                    <button
                      className={`provider-btn ${mapProvider === 'google' ? 'active' : ''}`}
                      onClick={() => setMapProvider('google')}
                    >
                      <FontAwesomeIcon icon={faGlobe} />
                      {t("mapViewModal.providers.google")}
                    </button>
                    <button
                      className={`provider-btn ${mapProvider === 'osm' ? 'active' : ''}`}
                      onClick={() => setMapProvider('osm')}
                    >
                      <FontAwesomeIcon icon={faGlobe} />
                      {t("mapViewModal.providers.osm")}
                    </button>
                  </div>

                  <button
                    className="btn btn-primary get-directions"
                    onClick={handleGetDirections}
                  >
                    <FontAwesomeIcon icon={faDirections} />
                    {t("mapViewModal.getDirections")}
                  </button>
                </div>
              </div>

              <div ref={mapRef} className={`map-container ${!mapLoaded ? 'loading' : ''}`}>
                {mapError ? (
                  <div className="map-error">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <p>{mapError}</p>
                    <button
                      className="btn btn-secondary"
                      onClick={() => window.location.reload()}
                    >
                      {t("mapViewModal.retryButton")}
                    </button>
                  </div>
                ) : (
                  <>
                    {!mapLoaded && (
                      <div className="map-loading">
                        <div className="loading-spinner"></div>
                        <p>{t("mapViewModal.loadingMap")}</p>
                      </div>
                    )}
                    <iframe
                      ref={iframeRef}
                      src={mapProvider === 'google' ? maps.embedUrl : osmMaps.embedUrl}
                      className="map-iframe"
                      title="Device Location Map"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      onLoad={handleMapLoad}
                      onError={handleMapError}
                      style={{ opacity: mapLoaded ? 1 : 0 }}
                    />
                  </>
                )}
              </div>

              <div className="device-location-details">
                <div className="detail-section">
                  <h4>
                    <FontAwesomeIcon icon={faLocationArrow} />
                    {t("mapViewModal.locationDetails.title")}
                  </h4>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">{t("mapViewModal.locationDetails.deviceLabel")}</span>
                      <span className="detail-value">{device.deviceName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">{t("mapViewModal.locationDetails.codeLabel")}</span>
                      <span className="detail-value">{device.deviceCode}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">{t("mapViewModal.locationDetails.addressLabel")}</span>
                      <span className="detail-value">
                        {device.address || t("mapViewModal.locationDetails.noAddress")}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">{t("mapViewModal.locationDetails.accuracyLabel")}</span>
                      <span className="detail-value">
                        {device.locationAccuracy ? `${device.locationAccuracy}m` : t("mapViewModal.locationDetails.unknown")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="location-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={handleGetDirections}
                  >
                    <FontAwesomeIcon icon={faDirections} />
                    {t("mapViewModal.openInMaps")}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCopyCoordinates}
                  >
                    <FontAwesomeIcon icon={faCopy} />
                    {t("mapViewModal.copyCoordinates")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            {t("mapViewModal.closeButton")}
          </button>
          {hasValidCoords && (
            <a
              href={mapProvider === 'google' ? maps.externalUrl : osmMaps.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <FontAwesomeIcon icon={faSearchLocation} />
              {t("mapViewModal.openNewTab")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapViewModal;