import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FormInput from "../../component/form-input";
import FormSelect from "../../component/form-select";
import FormTextarea from "../../component/form-textarea";
import "../../assets/css/client/location-management.css";

const LocationAdd = ({ onClose, handleAddLocation, loading, formData }) => {
  const [addFormData, setAddFormData] = useState(formData);

  // Sync prop updates into state
  useEffect(() => {
    setAddFormData(formData);
  }, [formData]);

  // Handle changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    addFormData.companyId = 3;
    await handleAddLocation(addFormData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Location</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="location-form">
          <div className="form-row">
            <FormInput
              className="form-group"
              label="Location"
              name="name"
              value={addFormData.name}
              onChange={handleChange}
              placeholder="Doha ... "
              required
            />
            <FormInput
              className="form-group"
              label="Location Code"
              name="code"
              value={addFormData.code}
              onChange={handleChange}
              placeholder="HQ01"
              required
              maxLength="5"
              style={{ textTransform: "uppercase" }}
            />
          </div>
          <div className="form-row">
            <FormInput
              className="form-group"
              label="Location (Arabic)"
              name="nameArabic"
              value={addFormData.nameArabic}
              onChange={handleChange}
              placeholder="الدوحة ... "
              dir="rtl"
            />
            <FormSelect
              className="form-group"
              label="Status"
              name="status"
              value={addFormData.status}
              onChange={handleChange}
              required
              options={[
                { value: "Active", label: "Active" },
                { value: "InActive", label: "Inactive" },
              ]}
            />
          </div>
          <div className="form-group">
            <FormTextarea
              className="form-group"
              label="Description"
              name="descrip"
              value={addFormData.descrip}
              onChange={handleChange}
              rows="3"
              placeholder="Any additional information about the Location..."
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Adding..." : "Add Location"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationAdd;
