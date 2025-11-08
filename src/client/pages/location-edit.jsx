import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FormInput from "../../component/form-input";
import FormSelect from "../../component/form-select";
import FormTextarea from "../../component/form-textarea";

const LocationEdit = ({ formData, onClose, loading, handleEditLocation }) => {
  // Local state for editing
  const [updateFormData, setUpdateFormData] = useState(formData);

  // Sync prop updates into state
  useEffect(() => {
    setUpdateFormData(formData);
  }, [formData]);

  // Handle changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    updateFormData.companyId = 3;
    handleEditLocation(updateFormData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3> Edit Location </h3>
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
              value={updateFormData.name}
              onChange={handleChange}
              required
            />
            <FormInput
              className="form-group"
              label="Location Code"
              name="code"
              value={updateFormData.code}
              onChange={handleChange}
              required
              maxLength="5"
              style={{ textTransform: "uppercase" }}
            />
          </div>
          <div className="form-row">
            <FormInput
              className="form-group"
              label="Location Arabic"
              name="nameArabic"
              value={updateFormData.nameArabic}
              onChange={handleChange}
              dir="rtl"
            />
            <FormSelect
              className="form-group"
              label="Status"
              name="status"
              value={updateFormData.status}
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
              value={updateFormData.descrip || ""}
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
              {loading ? "Updating..." : "Update Location"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationEdit;
