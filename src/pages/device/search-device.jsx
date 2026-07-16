import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { DeviceService } from "../../services/deviceService";
import { useNotification } from "../../context/NotificationContext";
import Pagination from "../../component/generic-pagination";
import LoadingSpinner from "../../component/loading-spinner";
import EditDevice from "./edit-device";
import ViewDevice from "./view-device";
import ViewDeviceQR from "./view-device-qr";
import "./css/search-device.css";

const SearchDevice = () => {
  const { t } = useTranslation("device");
  const deviceType = {
    QR: t("addDevice.deviceTypeOptions.qr"),
    VR: t("addDevice.deviceTypeOptions.vr"),
    IPS: t("addDevice.deviceTypeOptions.ips"),
  };

  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    status: "",
    locationId: "",
    minRadius: "",
    maxRadius: "",
    floorLevel: "",
  });
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [active, setActive] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const loadDevice = useCallback(
    async (pageToLoad, search = searchTerm) => {
      try {
        setLoading(true);
        setError("");

        const response = await DeviceService.searchDevice({
          searchTerm: search,
          active,
          page: pageToLoad,
          size: pageSize,
        });

        if (response.success) {
          const pageData = response.data;
          setSearchResults(pageData.content || []);
          setTotalElements(pageData.totalElements || 0);
          setTotalPages(pageData.totalPages || 0);
          setCurrentPage(pageData.number ?? 0);
        } else {
          setSearchResults([]);
          setTotalElements(0);
          setTotalPages(0);
          setCurrentPage(0);
        }
      } catch (err) {
        setError(t("searchDevice.loadError"));
      } finally {
        setLoading(false);
      }
    },
    [pageSize, searchTerm, active, t],
  );

  useEffect(() => {
    loadDevice(currentPage, searchTerm);
  }, [currentPage, pageSize, loadDevice, searchTerm]);

  const handlePageChange = useCallback(
    async (newPage) => {
      const zeroBasedPage = newPage - 1;
      if (zeroBasedPage >= 0 && zeroBasedPage < totalPages) {
        setCurrentPage(zeroBasedPage);
      }
    },
    [loadDevice, totalPages],
  );

  const fetchLocations = async () => {
    try {
      const response = await authService.getLocations();
      setLocations(response?.data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const searchParams = {
        keyword: searchTerm,
        ...filterOptions,
      };
      Object.keys(searchParams).forEach((key) => {
        if (!searchParams[key]) {
          delete searchParams[key];
        }
      });
      loadDevice();
    } catch (error) {
      console.error("Search error:", error);
      setError(error?.message || "Failed to perform search");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterOptions({
      status: "",
      locationId: "",
      minRadius: "",
      maxRadius: "",
      floorLevel: "",
    });
    setSearchResults([]);
    setError("");
  };

  const handleViewDevice = (deviceId) => {
    const device = searchResults.find((device) => device.deviceId === deviceId);
    setSelectedDevice(device);
    setModalMode("view");
  };

  const handleEditDevice = async (deviceId) => {
    const device = searchResults.find((device) => device.deviceId === deviceId);
    setSelectedDevice(device);
    setModalMode("edit");
  };

  const handleQrDevice = async (deviceId) => {
    const device = searchResults.find((device) => device.deviceId === deviceId);
    setSelectedDevice(device);
    setModalMode("QR");
  };

  const handleCloseModal = () => {
    setSelectedDevice(null);
    setModalMode(null);
  };

  const handleSaveDevice = async (editDate) => {
    try {
      const response = await DeviceService.updateDevice(
        editDate.deviceId,
        editDate,
      );
      if (response.success) {
        showNotification("Device Updated successfully!", "success");
      }
    } catch (error) {
      showNotification("Device Updated Fail!", "error");
    }
  };

  return (
    <div className="device-search-container">
      <div className="company-logo">
        <h1 className="text-logo">{t("searchDevice.title")}</h1>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-main">
          <div className="input-group search-input-group">
            <input
              type="text"
              placeholder={t("searchDevice.searchPlaceholder")}
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? t("searchDevice.searchingButton") : t("searchDevice.searchButton")}
            </button>
          </div>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {searchResults.length > 0 && (
            <div className="device-search-results">
              <h2>{t("searchDevice.resultsHeading", { count: searchResults.length })} </h2>
              <div className="device-results-grid">
                {searchResults.map((device) => (
                  <div key={device.deviceId} className="device-card">
                    <div className="device-header">
                      <h3>{device.deviceName}</h3>
                      <span
                        className={`status-badge status-${device.status?.toLowerCase()}`}
                      >
                        {device.status || t("searchDevice.card.statusUnknown")}
                      </span>
                    </div>

                    <div className="device-details">
                      <p>
                        <strong>{t("searchDevice.card.deviceCode")}</strong> {device.deviceCode}
                      </p>
                      <p>
                        <strong>{t("searchDevice.card.location")}</strong>{" "}
                        {device.locationName || "N/A"}
                      </p>
                      <p>
                        <strong>{t("searchDevice.card.floorLevel")}</strong>{" "}
                        {device.floorLevel || "N/A"}
                      </p>
                      <p>
                        <strong>{t("searchDevice.card.coordinates")}</strong> {device.latitude},{" "}
                        {device.longitude}
                      </p>
                      <p>
                        <strong>{t("searchDevice.card.altitude")}</strong> {device.altitude}M
                      </p>
                      <p>
                        <strong>{t("searchDevice.card.accuracy")}</strong> ±{device.accuracy}M
                      </p>
                      <p>
                        <strong>{t("searchDevice.card.radius")}</strong> {device.radiusMeter}M
                      </p>
                    </div>

                    <div className="device-actions">
                      <button
                        onClick={() => handleViewDevice(device.deviceId)}
                        className="search-view-button"
                      >
                        {t("searchDevice.viewDetails")}
                      </button>
                      <button
                        onClick={() => handleEditDevice(device.deviceId)}
                        className="search-edit-button"
                      >
                        {t("searchDevice.edit")}
                      </button>
                      <button
                        onClick={() => handleQrDevice(device.deviceId)}
                        className="search-qr-button"
                      >
                        {t("searchDevice.generateQR")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && searchResults.length > 0 && (
            <div className="pagination-section">
              {totalPages > 1 && (
                <div className="pagination-container">
                  <div className="pagination-info">
                    {t("searchDevice.paginationInfo", {
                      current: currentPage + 1,
                      total: totalPages,
                      start: Math.min(currentPage * pageSize + 1, totalElements),
                      end: Math.min((currentPage + 1) * pageSize, totalElements),
                      totalElements,
                    })}
                  </div>
                  <Pagination
                    currentPage={currentPage + 1}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}

          {!loading && searchResults.length === 0 && searchTerm && (
            <div className="no-results">
              {t("searchDevice.noResults")}
            </div>
          )}
        </>
      )}

      <div className="quick-actions">
        <Link to="/add-device" className="add-device-link">
          {t("searchDevice.addNew")}
        </Link>
      </div>

      {modalMode === "view" && selectedDevice && (
        <ViewDevice
          device={selectedDevice}
          onClose={handleCloseModal}
          deviceType={deviceType}
        />
      )}

      {modalMode === "edit" && selectedDevice && (
        <EditDevice
          device={selectedDevice}
          onClose={handleCloseModal}
          onSave={handleSaveDevice}
          onView={() => setModalMode("view")}
          deviceType={deviceType}
        />
      )}

      {modalMode === "QR" && selectedDevice && (
        <ViewDeviceQR
          deviceId={selectedDevice.deviceId}
          onClose={handleCloseModal}
          deviceName={selectedDevice.deviceName}
        />
      )}
    </div>
  );
};

export default SearchDevice;