import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FormInput from "../../component/form-input";
import FormSelect from "../../component/form-select";
import FormTextarea from "../../component/form-textarea";

const DepartmentAdd = ({
  handleChange,
  onClose,
  handleAddDepartment,
  loading,
  formData,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Department</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form onSubmit={handleAddDepartment} className="department-form">
          <div className="form-row">
            <FormInput
              className="form-group"
              label="Department Name"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
              placeholder="Human Resource"
              required
            />
            <FormInput
              className="form-group"
              label="Department Code"
              name="departmentCode"
              value={formData.departmentCode}
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
              value={formData.departmentNameAra}
              onChange={handleChange}
              placeholder="الموارد البشرية"
              dir="rtl"
            />
            <FormSelect
              className="form-group"
              label="Status"
              name="departmentStatus"
              value={formData.departmentStatus}
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
              value={formData.note}
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
              {loading ? "Adding..." : "Add Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentAdd;
