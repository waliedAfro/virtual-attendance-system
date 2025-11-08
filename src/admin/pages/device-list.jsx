import React, { useState } from "react";
import "../../assets/css/admin/device-management.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faTimes,
  faArrowUp,
  faArrowDown,
  faEdit,
  faTrash,
  faEye,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const DeviceManagement = () => {
  const icons = {
    ascending: faArrowUp,
    descending: faArrowDown,
  };

  const [formData, setFormData] = useState({
    company: "",
    deviceName: "",
    deviceType: "",
    deviceCode: "",
    latitude: "",
    longitude: "",
    status: "active",
    uuid: "",
    sn: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [showModal, setShowModal] = useState(false);

  const [devices, setDevices] = useState([
    {
      id: 1,
      company: "TechCorp Inc.",
      deviceName: "Main Server",
      deviceType: "Server",
      deviceCode: "DEV-001",
      latitude: "37.7749",
      longitude: "-122.4194",
      status: "active",
    },
    {
      id: 2,
      company: "FinanceLLC",
      deviceName: "Security Camera",
      deviceType: "Camera",
      deviceCode: "DEV-002",
      latitude: "40.7128",
      longitude: "-74.0060",
      status: "inactive",
    },
    {
      id: 3,
      company: "RetailGroup",
      deviceName: "POS Terminal",
      deviceType: "Terminal",
      deviceCode: "DEV-003",
      latitude: "41.8781",
      longitude: "-87.6298",
      status: "maintenance",
    },
    {
      id: 4,
      company: "HealthPlus",
      deviceName: "Patient Monitor",
      deviceType: "Sensor",
      deviceCode: "DEV-004",
      latitude: "42.3601",
      longitude: "-71.0589",
      status: "active",
    },
    {
      id: 5,
      company: "EcoSolutions",
      deviceName: "Environmental Sensor",
      deviceType: "Sensor",
      deviceCode: "DEV-005",
      latitude: "45.5152",
      longitude: "-122.6784",
      status: "active",
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDevice = {
      id: devices.length + 1,
      ...formData,
    };
    setDevices([...devices, newDevice]);
    setFormData({
      company: "",
      deviceName: "",
      deviceType: "",
      deviceCode: "",
      latitude: "",
      longitude: "",
      status: "active",
      uuid: "",
      sn: "",
    });
    setShowModal(false);
    alert("Device added successfully!");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      setDevices(devices.filter((device) => device.id !== id));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "status-active",
      inactive: "status-inactive",
      maintenance: "status-maintenance",
    };

    const statusText = {
      active: "Active",
      inactive: "Inactive",
      maintenance: "Maintenance",
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  // Filter devices based on search term
  const filteredDevices = devices.filter(
    (device) =>
      device.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.deviceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort devices if sortConfig is set
  const sortedDevices = React.useMemo(() => {
    if (!sortConfig.key) return filteredDevices;

    return [...filteredDevices].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredDevices, sortConfig]);

  return (
    <div className="device-management">
      <h2>Device Management</h2>

      {/* Search and Add Button Section */}
      <div className="search-section">
        <div className="search-header">
          <h3>Device List</h3>
          <button className="add-device-btn" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPlus} /> Add New Device
          </button>
        </div>
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Search by device name, company, type, code, or status..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          {searchTerm && (
            <button onClick={clearSearch} className="clear-search-btn">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <button className="search-btn">
            <i className="fas fa-search"></i>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
        <div className="results-count">
          {sortedDevices.length} device(s) found
        </div>
      </div>

      {/* Device List */}
      <div className="device-list-section">
        {sortedDevices.length > 0 ? (
          <div className="devices-table-container">
            <table className="devices-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("deviceName")}>
                    Device Name{" "}
                    {sortConfig.key === "deviceName" && (
                      <FontAwesomeIcon icon={icons[sortConfig.direction]} />
                    )}
                  </th>
                  <th onClick={() => handleSort("company")}>
                    Company{" "}
                    {sortConfig.key === "company" && (
                      <FontAwesomeIcon icon={icons[sortConfig.direction]} />
                    )}
                  </th>
                  <th onClick={() => handleSort("deviceType")}>
                    Type{" "}
                    {sortConfig.key === "deviceType" && (
                      <FontAwesomeIcon icon={icons[sortConfig.direction]} />
                    )}
                  </th>
                  <th onClick={() => handleSort("deviceCode")}>
                    Device Code{" "}
                    {sortConfig.key === "deviceCode" && (
                      <FontAwesomeIcon icon={icons[sortConfig.direction]} />
                    )}
                  </th>
                  <th>Location</th>
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
                {sortedDevices.map((device) => (
                  <tr key={device.id}>
                    <td>
                      <div className="device-name">{device.deviceName}</div>
                      <div className="device-id">ID: {device.id}</div>
                    </td>
                    <td>{device.company}</td>
                    <td>{device.deviceType}</td>
                    <td>{device.deviceCode}</td>
                    <td>
                      <div className="location-coords">
                        <div>Lat: {device.latitude}</div>
                        <div>Lng: {device.longitude}</div>
                      </div>
                      <button className="map-link">
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> View Map
                      </button>
                    </td>
                    <td>{getStatusBadge(device.status)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view-btn" title="View">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button className="action-btn edit-btn" title="Edit">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          title="Delete"
                          onClick={() => handleDelete(device.id)}
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
          <div className="no-devices">
            <i className="fas fa-microchip"></i>
            <p>
              {searchTerm
                ? "No devices match your search."
                : "No devices found. Add a new device to get started."}
            </p>
            <button
              className="add-device-btn"
              onClick={() => setShowModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              Add New Device
            </button>
          </div>
        )}
      </div>

      {/* Add Device Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Device</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="device-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Company *</label>
                  <select
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Company</option>
                    <option value="TechCorp Inc.">TechCorp Inc.</option>
                    <option value="FinanceLLC">FinanceLLC</option>
                    <option value="RetailGroup">RetailGroup</option>
                    <option value="HealthPlus">HealthPlus</option>
                    <option value="EcoSolutions">EcoSolutions</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Device Name *</label>
                  <input
                    type="text"
                    name="deviceName"
                    value={formData.deviceName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Device Type *</label>
                  <select
                    name="deviceType"
                    value={formData.deviceType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="IPS">IPS Terminal</option>
                    <option value="QR">QR Terminal</option>
                    <option value="VD">Virtual Terminal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Device Code *</label>
                  <input
                    type="text"
                    name="deviceCode"
                    value={formData.deviceCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Serial Number </label>
                  <input
                    type="text"
                    name="sn"
                    value={formData.sn}
                    onChange={handleChange}
                    required
                    title="Enter a Serial Number"
                  />
                </div>
                <div className="form-group">
                  <label> UUID *</label>
                  <input
                    type="text"
                    name="uuid"
                    value={formData.uuid}
                    onChange={handleChange}
                    required
                    pattern="^-?\d{1,3}\.\d+$"
                    title="Enter a  uuid"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Latitude *</label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                    pattern="^-?\d{1,3}\.\d+$"
                    title="Enter a valid latitude coordinate"
                  />
                </div>
                <div className="form-group">
                  <label>Longitude *</label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                    pattern="^-?\d{1,3}\.\d+$"
                    title="Enter a valid longitude coordinate"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
