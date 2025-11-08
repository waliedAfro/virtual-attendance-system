import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FormInput from "../../component/form-input";
import FormSelect from "../../component/form-select";
import FormTextarea from "../../component/form-textarea";

const LocationDelete = ({
  formData,
  onClose,
  loading,
  handleDeleteLocation,
}) => {
  // Local state for editing
  const [deleteFormData, setDeleteFormData] = useState(formData);

  // Sync prop updates into state
  useEffect(() => {
    setDeleteFormData(formData);
  }, [formData]);

  // Handle changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeleteFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    deleteFormData.companyId = 3;
    handleDeleteLocation(deleteFormData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3> Delete Location </h3>
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
              value={deleteFormData.name}
              readOnly
            />
            <FormInput
              className="form-group"
              label="Location Code"
              name="code"
              value={deleteFormData.code}
              readOnly
            />
          </div>
          <div className="form-row">
            <FormInput
              className="form-group"
              label="Location (Arabic)"
              name="nameArabic"
              value={deleteFormData.nameArabic}
              readOnly
            />
            <FormSelect
              className="form-group"
              label="Status"
              name="status"
              value={deleteFormData.status || ""}
              readOnly
              options={[
                { value: "Active", label: "Active" },
                { value: "InActive", label: "Inactive" },
              ]}
            />
          </div>
          <div className="form-group">
            <FormTextarea
              className="form-group"
              label="Delete Reason"
              name="descrip"
              value={deleteFormData.descrip || ""}
              onChange={handleChange}
              rows="3"
              required
              placeholder="Add Delete Reason ..."
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="delete-btn" disabled={loading}>
              {loading ? "Deleting ..." : "Delete Location"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationDelete;
