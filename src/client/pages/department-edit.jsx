import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FormInput from "../../component/form-input";
import FormSelect from "../../component/form-select";
import FormTextarea from "../../component/form-textarea";

const DepartmentEdit = ({
  formData,
  onClose,
  loading,
  handleEditDepartment,
}) => {
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
    handleEditDepartment(updateFormData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3> Edit Department </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="department-form">
          <div className="form-row">
            <FormInput
              className="form-group"
              label="Department Name"
              name="departmentName"
              value={updateFormData.departmentName}
              onChange={handleChange}
              placeholder="Human Resource"
              required
            />
            <FormInput
              className="form-group"
              label="Department Code"
              name="departmentCode"
              value={updateFormData.departmentCode}
              onChange={handleChange}
              placeholder="HR"
              required
              maxLength="5"
              style={{ textTransform: "uppercase" }}
            />
          </div>
          <div className="form-row">
            <FormInput
              className="form-group"
              label="Department Name Arabic"
              name="departmentNameAra"
              value={updateFormData.departmentNameAra}
              onChange={handleChange}
              placeholder="الموارد البشرية"
              dir="rtl"
            />
            <FormSelect
              className="form-group"
              label="Status"
              name="departmentStatus"
              value={updateFormData.departmentStatus}
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
              name="note"
              value={updateFormData.note || ""}
              onChange={handleChange}
              rows="3"
              placeholder="Any additional information about the Department..."
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Updating..." : "Update Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentEdit;
