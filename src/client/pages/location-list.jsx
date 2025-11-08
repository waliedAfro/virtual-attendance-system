import React, { useState, useMemo, useEffect } from "react";
import "../../assets/css/client/location-management.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useApi from "../../hooks/useApi";
import LocationAdd from "./location-add";
import LocationDelete from "./location-delete";
import LocationEdit from "./location-edit";
import LocationView from "./location-view";

import { LocationService } from "../../services/locationService";
import {
  faPlus,
  faSearch,
  faTimes,
  faArrowUp,
  faArrowDown,
  faEdit,
  faTrash,
  faEye,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const LocationList = () => {
  const icons = {
    ascending: faArrowUp,
    descending: faArrowDown,
  };

  const companyId = 3;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [localLocations, setLocalLocations] = useState([]);

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    nameArabic: "",
    code: "",
    status: "Active",
    descip: "",
    deleteReason: "",
    companyId,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Fetch departments
  const {
    data: locations = [],
    loading: locationLoading,
    error: locationsError,
    execute: refreshLocations,
  } = useApi(() => LocationService.getLocationsByCompany(companyId), [], true);

  // Sync local state with API result
  useEffect(() => {
    setLocalLocations(locations);
  }, [locations]);

  useEffect(() => {
    if (isUpdated) {
      scrollToTop();
      // Reset the saved state after scrolling
      const timer = setTimeout(() => setIsUpdated(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isUpdated]);

  // Go to the Top Page
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameArabic,
      code,
      status: "Active",
      descip,
      deleteReason,
    });
  };

  const showMessage = (message, isSuccess = true) => {
    if (isSuccess) {
      setSuccessMessage(message);
    } else {
      setErrorMessage(message);
    }

    // Auto-hide message after 5 seconds
    setTimeout(() => {
      if (isSuccess) {
        setSuccessMessage("");
      } else {
        setErrorMessage("");
      }
    }, 5000);
  };

  const handleAddLocation = async (addFormData) => {
    try {
      setLoading(true);
      await LocationService.createLocation(addFormData);
      showMessage("Location  successfully created!");
      setShowModal(false);
      resetForm();
      await refreshLocations(); // refresh list automatically

      return true;
    } catch (error) {
      console.error("Failed to create Location:", error);
      showMessage(error.message || "Failed to create Location", false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleEditLocation = async (updateFormData) => {
    try {
      await LocationService.updateLocation(updateFormData);
      showMessage("Location successfully updated!");
      setShowEditModal(false);
      await refreshLocations(); // refresh list automatically
      return true;
    } catch (error) {
      console.error("Failed to update Location:", error);
      showMessage(error.message || "Failed to update Location", false);
      return false;
    }
  };

  const handleDeleteLocation = async (delDateFormData) => {
    try {
      await LocationService.deleteLocation(delDateFormData);
      showMessage("Location  successfully deleted!");
      setShowDelModal(false);
      await refreshLocations(); // refresh list automatically
      return true;
    } catch (error) {
      console.error("Failed to delete Location:", error);
      showMessage(error.message || "Failed to delete Location", false);
      return false;
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status) => {
    const isActive = status === "Active" || status === true;
    return (
      <span
        className={`status-badge ${
          isActive ? "status-active" : "status-inactive"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  // Filter and sort
  const filteredLocations = localLocations.filter((location) =>
    [location.name, location.nameArabic, location.code, location.status].some(
      (field) =>
        field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedLocations = useMemo(() => {
    if (!sortConfig.key) return filteredLocations;
    return [...filteredLocations].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredLocations, sortConfig]);

  return (
    <div className="location-management">
      {/* Success message */}
      {successMessage && (
        <div className="form-success-banner">
          <FontAwesomeIcon icon={faCheckCircle} />
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage("")}
            aria-label="Dismiss success message"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      <h2>Location Management</h2>
      {/* Search Section */}
      <div className="search-section">
        <div className="search-header">
          <h3>Location List</h3>
          <button
            className="add-location-btn"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Add New Location
          </button>
        </div>
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search ...."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="clear-search-btn"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <button className="search-btn">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div className="results-count">
          {sortedLocations.length} Location(s) found
        </div>
      </div>

      {/* Location List */}
      <div className="location-list-section">
        {sortedLocations.length > 0 ? (
          <div className="locations-table-container">
            <table className="location-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")}>
                    Location{" "}
                    {sortConfig.key === "name" && (
                      <FontAwesomeIcon icon={icons[sortConfig.direction]} />
                    )}
                  </th>
                  <th onClick={() => handleSort("nameArabic")}>
                    Location (Arabic){" "}
                    {sortConfig.key === "nameArabic" && (
                      <FontAwesomeIcon icon={icons[sortConfig.direction]} />
                    )}
                  </th>
                  <th onClick={() => handleSort("status")}>
                    Status{" "}
                    {sortConfig.key === "status" && (
                      <FontAwesomeIcon icon={icons[sortConfig.direction]} />
                    )}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedLocations.map((location) => (
                  <tr key={location.id}>
                    <td>
                      <div className="location-name">{location.name}</div>
                      <div className="location-code">{location.code}</div>
                      <div className="location-description">
                        {location.descip}
                      </div>
                    </td>
                    <td>{location.nameArabic || "Not assigned"}</td>
                    <td>{getStatusBadge(location.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view-btn"
                          onClick={() => {
                            setSelectedLocation(location);
                            setShowViewModal(true);
                          }}
                          title="View"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLocation(location);
                            setShowEditModal(true);
                          }}
                          className="action-btn edit-btn"
                          title="Edit"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          title="Delete"
                          onClick={() => {
                            setSelectedLocation(location);
                            setShowDelModal(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-locations">
            <i className="fas fa-building"></i>
            <p>
              {searchTerm
                ? "No Locations match your search."
                : "No Locations found. Add a new Location to get started."}
            </p>
          </div>
        )}
      </div>

      {/* Edit Location Modal */}
      {showEditModal && (
        <LocationEdit
          formData={selectedLocation}
          onClose={() => setShowEditModal(false)}
          loading={loading}
          handleEditLocation={handleEditLocation}
        />
      )}

      {/* View Location Modal */}
      {showViewModal && (
        <LocationView
          formData={selectedLocation}
          onClose={() => setShowViewModal(false)}
          //onSave={selectedDepartment ? onEditDepartment : onAddDepartment}
        />
      )}

      {/* Add Location Modal */}
      {showModal && (
        <LocationAdd
          onClose={() => setShowModal(false)}
          handleAddLocation={handleAddLocation}
          loading={loading}
          formData={formData}
        />
      )}

      {/* Delete Location Modal */}
      {showDelModal && (
        <LocationDelete
          handleChange={handleChange}
          onClose={() => setShowDelModal(false)}
          handleDeleteLocation={handleDeleteLocation}
          loading={loading}
          formData={selectedLocation}
        />
      )}

      {/* Error message */}
      {errors.submit && (
        <div className="form-error-banner">
          <i className="fas fa-exclamation-circle"></i>
          <span>{errors.submit}</span>
          <button
            onClick={() => setErrors((prev) => ({ ...prev, submit: null }))}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationList;
