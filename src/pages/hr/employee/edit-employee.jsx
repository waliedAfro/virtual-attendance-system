import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EmployeeService } from "../../../services/employeeService";
import LoadingSpinner from "../../../component/loading-spinner";
import { useNotification } from "../../../context/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useApi from "../../../hooks/useApi";
import useConfirm from "../../../hooks/useConfirm";
import { DepartmentService } from "../../../services/departmentService";
import {
  faUser,
  faSave,
  faTimesCircle,
  faCamera,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import './css/edit-employee.css';
import { useTranslation } from "react-i18next";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { confirm, ModalComponent } = useConfirm();
  const { t } = useTranslation("employee");

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [changePhoto, setChangePhoto] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    firstNameAr: "",
    middleNameAr: "",
    lastNameAr: "",
    employeeNo: "",
    userCode: "",
    email: "",
    mobile: "",
    phone: "",
    position: "",
    departmentId: "",
    active: "Active",
    dob: "",
    gender: "",
    address: "",
    joinDate: "",
    employmentType: "",
    workLocation: "",
    manager: "",
    photo: null,
    userId: "",
  });

  const {
    data: departments,
    loading: departLoading,
    error: departError,
  } = useApi(DepartmentService.getDepartments, [], true);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await EmployeeService.getEmployeeById(id);
      const data = response.data;
      setEmployee(data);

      const imageUrl = await EmployeeService.getUserPhoto(id);
      setPhotoPreview(imageUrl || null);

      setFormData({
        firstName: data.firstName || "",
        middleName: data.middleName || "",
        lastName: data.lastName || "",
        firstNameAr: data.firstNameAr || "",
        middleNameAr: data.middleNameAr || "",
        lastNameAr: data.lastNameAr || "",
        employeeNo: data.employeeNo || "",
        userCode: data.userCode || "",
        email: data.email || "",
        mobile: data.mobile || "",
        phone: data.phone || "",
        position: data.position || "",
        departmentId: data.department?.id || "",
        active: data.active || "Active",
        dob: data.dob ? data.dob.split("T")[0] : "",
        gender: data.gender || "",
        address: data.address || "",
        joinDate: data.joinDate ? data.joinDate.split("T")[0] : "",
        employmentType: data.employmentType || "",
        workLocation: data.workLocation || "",
        manager: data.manager || "",
        photo: data.photo || null,
        userId: data.userId || "",
      });
    } catch (err) {
      showNotification(t('editEmployee.errors.loadEmployeeFailed'), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChangePhoto(true);
      if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
        showNotification(t('editEmployee.errors.invalidImageFormat'), "error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showNotification(t('editEmployee.errors.fileSizeExceeded'), "error");
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setChangePhoto(true);
    setFormData((prev) => ({ ...prev, photo: null }));
    const fileInput = document.getElementById("photo-upload");
    if (fileInput) fileInput.value = "";
  };

  const uploadPhoto = async () => {
    if (!photoFile) return null;
    setUploadingPhoto(true);
    try {
      const photoUrl = await EmployeeService.uploadEmployeePhoto(formData.userId, photoFile);
      return photoUrl;
    } catch (error) {
      showNotification(t('editEmployee.errors.uploadPhotoFailed'), "error");
      return null;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = t('editEmployee.errors.firstNameRequired');
    if (!formData.lastName.trim()) newErrors.lastName = t('editEmployee.errors.lastNameRequired');
    if (!formData.email.trim()) newErrors.email = t('editEmployee.errors.emailRequired');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('editEmployee.errors.emailInvalid');
    if (!formData.mobile.trim()) newErrors.mobile = t('editEmployee.errors.mobileRequired');
    if (!formData.departmentId) newErrors.departmentId = t('editEmployee.errors.departmentRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const confirmed = await confirm(
      t('editEmployee.confirm.message', { firstName: formData.firstName, lastName: formData.lastName }),
      t('editEmployee.confirm.title')
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      let updatedPhotoUrl = formData.photo;
      if (changePhoto && photoFile) {
        const uploadedUrl = await uploadPhoto();
        if (uploadedUrl) updatedPhotoUrl = uploadedUrl;
      }
      const updatedData = { ...formData, photo: updatedPhotoUrl };
      const response = await EmployeeService.updateEmployee(updatedData);
      if (response.success) {
        showNotification(t('editEmployee.notifications.updateSuccess'), "success");
        fetchEmployee();
      } else {
        throw new Error(response.message || t('editEmployee.notifications.updateFailed'));
      }
    } catch (error) {
      showNotification(error.message || t('editEmployee.notifications.updateFailed'), "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !employee) return <LoadingSpinner />;
  if (!employee) return <div className="error-message">{t('editEmployee.errors.employeeNotFound')}</div>;

  return (
    <div className="edit-container">
      <div className="edit-header-actions">
        <button className="back-button" onClick={() => navigate(-1)}>
          {t('editEmployee.backButton')}
        </button>
        <h5>{t('editEmployee.title')}</h5>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="edit-form-container">
          {/* Photo Upload Section */}
          <div className="form-section photo-section">
            <h3>{t('editEmployee.sections.photo.heading')}</h3>
            <div className="photo-upload-container">
              <div className="current-photo">
                {photoPreview ? (
                  <img src={photoPreview} alt="Profile Preview" className="profile-preview" />
                ) : (
                  <div className="photo-placeholder">
                    <FontAwesomeIcon icon={faUser} size="3x" />
                  </div>
                )}
              </div>
              <div className="photo-actions">
                <div className="photo-upload-buttons">
                  <label htmlFor="photo-upload" className="upload-button">
                    <FontAwesomeIcon icon={faCamera} />
                    {photoPreview ? t('editEmployee.sections.photo.changePhoto') : t('editEmployee.sections.photo.uploadPhoto')}
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={handlePhotoChange}
                    style={{ display: "none" }}
                    disabled={loading || uploadingPhoto}
                  />
                  {photoPreview && (
                    <button
                      type="button"
                      className="remove-photo-button"
                      onClick={handleRemovePhoto}
                      disabled={loading || uploadingPhoto}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      {t('editEmployee.sections.photo.removePhoto')}
                    </button>
                  )}
                </div>
                {uploadingPhoto && (
                  <div className="uploading-indicator">
                    <LoadingSpinner size="small" />
                    <span>{t('editEmployee.sections.photo.uploading')}</span>
                  </div>
                )}
                <p className="photo-hint">{t('editEmployee.sections.photo.supportedFormats')}</p>
              </div>
            </div>
          </div>

          {/* Personal Information (English) */}
          <div className="form-section">
            <h3>{t('editEmployee.sections.personalInfoEn.heading')}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{t('editEmployee.sections.personalInfoEn.labels.firstName')}</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? "error" : ""}
                  disabled={loading}
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label>{t('editEmployee.sections.personalInfoEn.labels.middleName')}</label>
                <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} disabled={loading} />
              </div>
              <div className="form-group">
                <label>{t('editEmployee.sections.personalInfoEn.labels.lastName')}</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "error" : ""}
                  disabled={loading}
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>
            </div>
          </div>

          {/* Personal Information (Arabic) */}
          <div className="form-section">
            <h3>{t('editEmployee.sections.personalInfoAr.heading')}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{t('editEmployee.sections.personalInfoAr.labels.firstNameAr')}</label>
                <input type="text" name="firstNameAr" value={formData.firstNameAr} onChange={handleChange} disabled={loading} />
              </div>
              <div className="form-group">
                <label>{t('editEmployee.sections.personalInfoAr.labels.middleNameAr')}</label>
                <input type="text" name="middleNameAr" value={formData.middleNameAr} onChange={handleChange} disabled={loading} />
              </div>
              <div className="form-group">
                <label>{t('editEmployee.sections.personalInfoAr.labels.lastNameAr')}</label>
                <input type="text" name="lastNameAr" value={formData.lastNameAr} onChange={handleChange} disabled={loading} />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3>{t('editEmployee.sections.contactInfo.heading')}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{t('editEmployee.sections.contactInfo.labels.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  disabled={loading}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>{t('editEmployee.sections.contactInfo.labels.mobile')}</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={errors.mobile ? "error" : ""}
                  disabled={loading}
                />
                {errors.mobile && <span className="error-message">{errors.mobile}</span>}
              </div>
              <div className="form-group">
                <label>{t('editEmployee.sections.contactInfo.labels.phone')}</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={loading} />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="form-section">
            <h3>{t('editEmployee.sections.employmentInfo.heading')}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{t('editEmployee.sections.employmentInfo.labels.employeeNo')}</label>
                <input type="text" name="employeeNo" value={formData.employeeNo} onChange={handleChange} disabled={loading} />
              </div>
              <div className="form-group">
                <label>{t('editEmployee.sections.employmentInfo.labels.userCode')}</label>
                <input type="text" name="userCode" value={formData.userCode} onChange={handleChange} disabled={loading} />
              </div>
              <div className="form-group">
                <label>{t('editEmployee.sections.employmentInfo.labels.position')}</label>
                <input type="text" name="position" value={formData.position} onChange={handleChange} disabled={loading} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('editEmployee.sections.employmentInfo.labels.department')}</label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  disabled={departLoading || loading}
                  className={errors.departmentId ? "error" : ""}
                >
                  <option value="">
                    {departLoading
                      ? t('editEmployee.sections.employmentInfo.loadingDepartments')
                      : t('editEmployee.sections.employmentInfo.selectDepartmentPlaceholder')}
                  </option>
                  {!departLoading &&
                    departments?.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.departmentName}
                      </option>
                    ))}
                </select>
                {errors.departmentId && <span className="error-message">{errors.departmentId}</span>}
                {departError && <span className="error-message">{t('editEmployee.errors.loadDepartmentsFailed')}</span>}
              </div>
              <div className="form-group">
                <label>{t('editEmployee.sections.employmentInfo.labels.employmentType')}</label>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange} disabled={loading}>
                  <option value="">{t('editEmployee.sections.employmentInfo.selectTypePlaceholder')}</option>
                  <option value="Full-time">{t('editEmployee.sections.employmentInfo.employmentTypes.fullTime')}</option>
                  <option value="Part-time">{t('editEmployee.sections.employmentInfo.employmentTypes.partTime')}</option>
                  <option value="Contract">{t('editEmployee.sections.employmentInfo.employmentTypes.contract')}</option>
                  <option value="Intern">{t('editEmployee.sections.employmentInfo.employmentTypes.intern')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t('editEmployee.sections.employmentInfo.labels.status')}</label>
                <select name="active" value={formData.active} onChange={handleChange} disabled={loading}>
                  <option value="true">{t('editEmployee.sections.employmentInfo.statusOptions.active')}</option>
                  <option value="false">{t('editEmployee.sections.employmentInfo.statusOptions.inactive')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-section">
            <h3>{t('editEmployee.sections.additionalInfo.heading')}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>{t('editEmployee.sections.additionalInfo.labels.dob')}</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} disabled={loading} />
              </div>
              <div className="form-group">
                <label>{t('editEmployee.sections.additionalInfo.labels.gender')}</label>
                <select name="gender" value={formData.gender} onChange={handleChange} disabled={loading}>
                  <option value="">{t('editEmployee.sections.additionalInfo.selectGenderPlaceholder')}</option>
                  <option value="Male">{t('editEmployee.sections.additionalInfo.genderOptions.male')}</option>
                  <option value="Female">{t('editEmployee.sections.additionalInfo.genderOptions.female')}</option>
                  <option value="Other">{t('editEmployee.sections.additionalInfo.genderOptions.other')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t('editEmployee.sections.additionalInfo.labels.joinDate')}</label>
                <input type="date" name="joinDate" value={formData.joinDate} onChange={handleChange} disabled={loading} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group full-width">
                <label>{t('editEmployee.sections.additionalInfo.labels.address')}</label>
                <textarea name="address" value={formData.address} onChange={handleChange} rows="3" disabled={loading} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>{t('editEmployee.sections.additionalInfo.labels.workLocation')}</label>
                <input type="text" name="workLocation" value={formData.workLocation} onChange={handleChange} disabled={loading} />
              </div>
              <div className="form-group">
                <label>{t('editEmployee.sections.additionalInfo.labels.manager')}</label>
                <input type="text" name="manager" value={formData.manager} onChange={handleChange} disabled={loading} />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={() => navigate(-1)} disabled={loading}>
            <FontAwesomeIcon icon={faTimesCircle} /> {t('editEmployee.buttons.cancel')}
          </button>
          <button type="submit" className="save-button" disabled={loading || uploadingPhoto}>
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                {t('editEmployee.buttons.saving')}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} />
                {t('editEmployee.buttons.save')}
              </>
            )}
          </button>
        </div>
      </form>
      <ModalComponent />
    </div>
  );
};

export default EditEmployee;