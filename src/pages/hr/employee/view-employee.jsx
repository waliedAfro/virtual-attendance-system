import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EmployeeService } from "../../../services/employeeService";
import LoadingSpinner from "../../../component/loading-spinner";
import { useNotification } from "../../../context/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faIdCard,
  faBuilding,
  faEdit,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import './css/view-employee.css';
import { useTranslation } from "react-i18next";

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { t } = useTranslation("employee");

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const getFullName = (emp) => {
    return `${emp.firstName || ""} ${emp.middleName || ""} ${emp.lastName || ""}`.trim();
  };

  const getArabicFullName = (emp) => {
    return (
      `${emp.firstNameAr || ""} ${emp.middleNameAr || ""} ${emp.lastNameAr || ""}`.trim() ||
      "N/A"
    );
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const response = await EmployeeService.getEmployeeById(id);
        const data = response.data;
        setEmployee(data);

        const imageUrl = await EmployeeService.getUserPhoto(id);
        setPhotoPreview(imageUrl || null);
      } catch (err) {
        showNotification(t('viewEmployee.errors.loadEmployeeFailed'), "error");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id, showNotification, t]);

  if (loading) return <LoadingSpinner />;
  if (!employee) return <div className="error-message">{t('viewEmployee.errors.employeeNotFound')}</div>;

  return (
    <div className="view-container">
      <div className="view-header-actions">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /> {t('viewEmployee.backButton')}
        </button>
        <h5>{t('viewEmployee.title')}</h5>
      </div>

      <div className="view-content">
        {/* Photo Section */}
        <div className="info-section photo-section">
          <h3>{t('viewEmployee.photoHeading')}</h3>
          <div className="photo-display">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="profile-photo" />
            ) : (
              <div className="photo-placeholder">
                <FontAwesomeIcon icon={faUser} size="3x" />
              </div>
            )}
          </div>
        </div>

        {/* Employee Information */}
        <div className="info-section">
          <h3>
            <FontAwesomeIcon icon={faIdCard} /> {t('viewEmployee.sections.employeeInfo.heading')}
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <label>{t('viewEmployee.sections.employeeInfo.labels.employeeNo')}</label>
              <p>{employee.employeeNo || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>{t('viewEmployee.sections.employeeInfo.labels.userCode')}</label>
              <p>{employee.userCode || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>{t('viewEmployee.sections.employeeInfo.labels.position')}</label>
              <p>{employee.position || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>{t('viewEmployee.sections.employeeInfo.labels.department')}</label>
              <p>{employee.department?.departmentName || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>{t('viewEmployee.sections.employeeInfo.labels.status')}</label>
              <p
                className={`status-badge status-${employee.active ? "active" : "inactive"}`}
              >
                {employee.active
                  ? t('viewEmployee.sections.employeeInfo.status.active')
                  : t('viewEmployee.sections.employeeInfo.status.inactive')}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="info-section">
          <h3>
            <FontAwesomeIcon icon={faUser} /> {t('viewEmployee.sections.personalInfo.heading')}
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <label>{t('viewEmployee.sections.personalInfo.labels.fullNameEn')}</label>
              <p>{getFullName(employee)}</p>
            </div>
            <div className="info-item">
              <label>{t('viewEmployee.sections.personalInfo.labels.fullNameAr')}</label>
              <p>{getArabicFullName(employee)}</p>
            </div>
            <div className="info-item">
              <label>{t('viewEmployee.sections.personalInfo.labels.dob')}</label>
              <p>
                {employee.dob
                  ? new Date(employee.dob).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="info-item">
              <label>{t('viewEmployee.sections.personalInfo.labels.gender')}</label>
              <p>{employee.gender || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="info-section">
          <h3>
            <FontAwesomeIcon icon={faEnvelope} /> {t('viewEmployee.sections.contactInfo.heading')}
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <label>{t('viewEmployee.sections.contactInfo.labels.email')}</label>
              <p>{employee.email || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>{t('viewEmployee.sections.contactInfo.labels.mobile')}</label>
              <p>{employee.mobile || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>{t('viewEmployee.sections.contactInfo.labels.phone')}</label>
              <p>{employee.phone || "N/A"}</p>
            </div>
            <div className="info-item full-width">
              <label>{t('viewEmployee.sections.contactInfo.labels.address')}</label>
              <p>{employee.address || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="info-section">
          <h3>
            <FontAwesomeIcon icon={faBuilding} /> {t('viewEmployee.sections.employmentDetails.heading')}
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <label>{t('viewEmployee.sections.employmentDetails.labels.joinDate')}</label>
              <p>
                {employee.joinDate
                  ? new Date(employee.joinDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div className="info-item">
              <label>{t('viewEmployee.sections.employmentDetails.labels.employmentType')}</label>
              <p>{employee.employmentType || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>{t('viewEmployee.sections.employmentDetails.labels.workLocation')}</label>
              <p>{employee.workLocation || "N/A"}</p>
            </div>
            <div className="info-item">
              <label>{t('viewEmployee.sections.employmentDetails.labels.manager')}</label>
              <p>{employee.manager || "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;