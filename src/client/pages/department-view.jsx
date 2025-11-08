import React, { useState, useMemo } from "react";
import "../../assets/css/client/department-management.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormOutput from "../../component/form-output";
import {
  faPlus,
  faSearch,
  faTimes,
  faArrowUp,
  faArrowDown,
  faEdit,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import DepartmentEdit from "./department-edit";

const DepartmentView = ({ formData, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>View Department</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form className="department-form">
          <div className="form-row">
            <FormOutput
              className="form-group"
              label="Department Name"
              value={formData.departmentName}
              required
            />
            <FormOutput
              className="form-group"
              label="Department Code"
              value={formData.departmentCode}
              required
            />
          </div>

          <div className="form-row">
            <FormOutput
              className="form-group"
              label="Department Name Arabic"
              value={formData.departmentNameAra}
            />

            <FormOutput
              className="form-group"
              label="Status"
              value={formData.departmentStatus}
              required
            />
          </div>
          <div className="form-group">
            <FormOutput
              className="form-group"
              label="Description"
              value={formData.note}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default DepartmentView;
