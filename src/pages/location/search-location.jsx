import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LocationService } from "../../services/locationService";
import Pagination from "../../component/generic-pagination";
import { useNotification } from "../../context/NotificationContext";
import LoadingSpinner from "../../component/loading-spinner";
import ViewLocation from "./view-location";
import EditLocation from "./edit-location";
import DeleteLocation from "./delete-location";
import "./css/search-location.css";

const SearchLocation = () => {
  const { t } = useTranslation("location"); // or useTranslation("location") if namespaced
  const { showNotification } = useNotification();

  const [filterOptions, setFilterOptions] = useState({
    status: "",
    code: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [active, setActive] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [modalMode, setModalMode] = useState(null);

  const navigate = useNavigate();

  const loadLocation = useCallback(
    async (pageToLoad, search = searchTerm) => {
      try {
        setLoading(true);
        setError("");

        const response = await LocationService.searchLocations({
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
        setError(t("searchLocation.loadError"));
      } finally {
        setLoading(false);
      }
    },
    [pageSize, searchTerm, active, t]
  );

  useEffect(() => {
    loadLocation(currentPage, searchTerm);
  }, [currentPage, pageSize, loadLocation, searchTerm]);

  const handlePageChange = useCallback(
    async (newPage) => {
      const zeroBasedPage = newPage - 1;
      if (zeroBasedPage >= 0 && zeroBasedPage < totalPages) {
        setCurrentPage(zeroBasedPage);
      }
    },
    [totalPages]
  );

  const handleDeleteSuccess = (deletedLocationId) => {
    setSearchResults((prev) =>
      prev.filter((loc) => loc.id !== deletedLocationId)
    );
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterOptions({
      ...filterOptions,
      [e.target.name]: e.target.value,
    });
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

      // ⚠️ Ensure you're using the correct service – I kept your original logic
      const response = await authService.searchLocations(searchParams);
      setSearchResults(response?.data || []);

      if (response?.data?.length === 0) {
        setError(t("searchLocation.noResults"));
      }
    } catch (error) {
      console.error("Search error:", error);
      setError(error?.message || t("searchLocation.searchError"));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterOptions({
      status: "",
      code: "",
    });
    setSearchResults([]);
    setError("");
  };

  const handleViewLocation = (locationId) => {
    const location = searchResults.find((loc) => loc.id === locationId);
    setSelectedLocation(location);
    setModalMode("view");
  };

  const handleEditLocation = (locationId) => {
    const location = searchResults.find((loc) => loc.id === locationId);
    setSelectedLocation(location);
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setSelectedLocation(null);
    setModalMode(null);
  };

  const handleDeleteLocation = (locationId) => {
    const location = searchResults.find((loc) => loc.id === locationId);
    setSelectedLocation(location);
    setModalMode("delete");
  };

  const handleSaveLocation = async (editData) => {
    try {
      const response = await LocationService.updateLocation(
        editData.id,
        editData
      );
      if (response.success) {
        showNotification(t("searchLocation.updateSuccess"), "success");
      }
    } catch (error) {
      showNotification(t("searchLocation.updateError"), "error");
    }
  };

  return (
    <div className="search-location-container">
      <div className="company-logo">
        <h1 className="text-logo">{t("searchLocation.title")}</h1>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="search-main">
          <div className="input-group search-input-group">
            <input
              type="text"
              placeholder={t("searchLocation.searchPlaceholder")}
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading
                ? t("searchLocation.searchingButton")
                : t("searchLocation.searchButton")}
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
            <div className="search-results">
              <h2>
                {t("searchLocation.resultsTitle", {
                  count: searchResults.length,
                })}
              </h2>
              <div className="results-grid">
                {searchResults.map((location) => (
                  <div key={location.id} className="location-card">
                    <div className="location-header">
                      <h3>{location.name}</h3>
                      <span
                        className={`status-badge status-${
                          location.active ? "active" : "inactive"
                        }`}
                      >
                        {location.active
                          ? t("searchLocation.statusActive")
                          : t("searchLocation.statusInactive")}
                      </span>
                    </div>

                    <div className="location-details">
                      <p>
                        <strong>{t("searchLocation.locationCode")}</strong>{" "}
                        {location.code}
                      </p>
                      <p>
                        <strong>{t("searchLocation.nameAr")}</strong>{" "}
                        {location.nameAr || "N/A"}
                      </p>
                      <p>
                        <strong>{t("searchLocation.status")}</strong>{" "}
                        {location.active
                          ? t("searchLocation.statusActive")
                          : t("searchLocation.statusInactive")}
                      </p>
                      {location.descrip && (
                        <p className="description">
                          <strong>{t("searchLocation.description")}</strong>{" "}
                          {location.description}
                        </p>
                      )}
                    </div>

                    <div className="location-stats">
                      <div className="stat-item">
                        <span className="stat-label">
                          {t("searchLocation.devices")}
                        </span>
                        <span className="stat-value">
                          {location.deviceCount || 0}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">
                          {t("searchLocation.lastUpdated")}
                        </span>
                        <span className="stat-value">
                          {location.updatedAt
                            ? new Date(location.updatedAt).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="location-actions">
                      <button
                        onClick={() => handleViewLocation(location.id)}
                        className="view-button"
                        title={t("searchLocation.viewButton")}
                      >
                        {t("searchLocation.viewButton")}
                      </button>
                      <button
                        onClick={() => handleEditLocation(location.id)}
                        className="edit-button"
                        title={t("searchLocation.editButton")}
                      >
                        {t("searchLocation.editButton")}
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(location.id)}
                        className="delete-button"
                        title={t("searchLocation.deleteButton")}
                      >
                        <span className="btn-icon">🗑️</span>
                        {t("searchLocation.deleteButton")}
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
                    {t("searchLocation.paginationInfo", {
                      current: currentPage + 1,
                      total: totalPages,
                      start: Math.min(currentPage * pageSize + 1, totalElements),
                      end: Math.min((currentPage + 1) * pageSize, totalElements),
                      totalElements: totalElements,
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
            <div className="no-results">{t("searchLocation.noResults")}</div>
          )}
        </>
      )}

      <div className="quick-actions">
        <Link to="/add-location" className="add-location-link">
          {t("searchLocation.addNewLink")}
        </Link>
      </div>

      {/* Modals */}
      {modalMode === "view" && selectedLocation && (
        <ViewLocation location={selectedLocation} onClose={handleCloseModal} />
      )}

      {modalMode === "edit" && selectedLocation && (
        <EditLocation
          location={selectedLocation}
          onClose={handleCloseModal}
          onSave={handleSaveLocation}
          onView={() => setModalMode("view")}
        />
      )}

      {modalMode === "delete" && selectedLocation && (
        <DeleteLocation
          location={selectedLocation}
          onClose={handleCloseModal}
          onDeleteSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default SearchLocation;