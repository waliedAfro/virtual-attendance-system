import { useState } from "react";
import { EmployeeService } from "../../../services/employeeService";
import LoadingSpinner from "../../../component/loading-spinner";
import { useNotification } from "../../../context/NotificationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useApi from "../../../hooks/useApi";
import { DepartmentService } from "../../../services/departmentService";
import useConfirm from "../../../hooks/useConfirm";
import { useTranslation } from "react-i18next";

import {
  faUserCog,
  faRedoAlt
} from "@fortawesome/free-solid-svg-icons";

import "./css/add-employee.css";



const AddEmployee = () => {
  const { showNotification } = useNotification();
  const { t } = useTranslation("employee");

  // Initial empty form state
  const initialFormState = {
    firstName: "",
    middleName: "",
    lastName: "",
    fullNameAr: "",
    employeeNo: "",
    email: "",
    mobile: "",
    departmentId: ""
  };

  const [formData, setFormData] = useState(initialFormState);
  const [resetting, setResetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { confirm, ModalComponent } = useConfirm();

  // Reset form function
  const handleReset = () => {
    setResetting(true);
    setTimeout(() => {
      setFormData(initialFormState);
      setErrors({});
      setResetting(false);
    }, 300);
  };

  const {
    data: departments,
    loading: departLoading,
    error: departError,
    execute: referish,
  } = useApi(DepartmentService.getDepartments, [], true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = t('addEmployee.errors.firstNameRequired');
    if (!formData.lastName) newErrors.lastName = t('addEmployee.errors.lastNameRequired');
    if (!formData.email) newErrors.email = t('addEmployee.errors.emailRequired');
    if (!formData.mobile) newErrors.mobile = t('addEmployee.errors.mobileRequired');

    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = t('addEmployee.errors.emailInvalid');
      }
    }

    if (formData.mobile) {
      const mobileRegex = /^[0-9+\-\s()]{8,}$/;
      if (!mobileRegex.test(formData.mobile)) {
        newErrors.mobile = t('addEmployee.errors.mobileInvalid');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const confirmed = await confirm(
      t('addEmployee.confirm.message', { firstName: formData.firstName, lastName: formData.lastName }),
      t('addEmployee.confirm.title')
    );
    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await EmployeeService.addEmployee(formData);
      if (response.success) {
        showNotification(t('addEmployee.notifications.success'), "success");
      } else {
        throw new Error(response.message || t('addEmployee.notifications.deletionFailed'));
      }
    } catch (error) {
      showNotification(t('addEmployee.notifications.fail'), "error");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || resetting;

  return (
    <div className="employee-container">
      <div className="company-logo">
        <h1 className="text-logo">{t('addEmployee.title')}</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          <label htmlFor="firstName">{t('addEmployee.labels.firstName')}</label>
          <input
            name="firstName"
            placeholder={t('addEmployee.placeholders.firstName')}
            maxLength={100}
            onChange={handleChange}
            value={formData.firstName || ""}
            className={errors.firstName ? 'error-input' : ''}
            disabled={isDisabled}
            required
          />
          {errors.firstName && (
            <span className="error-message">{errors.firstName}</span>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="middleName">{t('addEmployee.labels.middleName')}</label>
          <input
            name="middleName"
            placeholder={t('addEmployee.placeholders.middleName')}
            onChange={handleChange}
            value={formData.middleName || ""}
            disabled={isDisabled}
          />
        </div>

        <div className="input-group">
          <label htmlFor="lastName">{t('addEmployee.labels.lastName')}</label>
          <input
            name="lastName"
            placeholder={t('addEmployee.placeholders.lastName')}
            onChange={handleChange}
            value={formData.lastName}
            disabled={isDisabled}
            required
          />
          {errors.lastName && (
            <span className="error-message">{errors.lastName}</span>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="fullNameAr">{t('addEmployee.labels.fullNameAr')}</label>
          <input
            name="fullNameAr"
            placeholder={t('addEmployee.placeholders.fullNameAr')}
            onChange={handleChange}
            value={formData.fullNameAr}
            disabled={isDisabled}
          />
        </div>

        <div className="input-group">
          <label htmlFor="department">{t('addEmployee.labels.department')}</label>
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            required
            className={errors.departmentId ? 'error-input' : ''}
            style={{ opacity: departLoading ? 0.7 : 1 }}
          >
            <option value="">
              {departLoading
                ? t('addEmployee.loadingDepartments')
                : t('addEmployee.selectPlaceholder')}
            </option>
            {!departLoading &&
              departments?.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.departmentName}
                </option>
              ))}
          </select>
          {errors.departmentId && (
            <span className="error-message">{errors.departmentId}</span>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="employeeNo">{t('addEmployee.labels.employeeNo')}</label>
          <input
            name="employeeNo"
            placeholder={t('addEmployee.placeholders.employeeNo')}
            onChange={handleChange}
            value={formData.employeeNo}
            disabled={isDisabled}
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">{t('addEmployee.labels.email')}</label>
          <input
            name="email"
            placeholder={t('addEmployee.placeholders.email')}
            onChange={handleChange}
            value={formData.email}
            disabled={isDisabled}
            required
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="mobile">{t('addEmployee.labels.mobile')}</label>
          <input
            name="mobile"
            placeholder={t('addEmployee.placeholders.mobile')}
            onChange={handleChange}
            value={formData.mobile}
            disabled={isDisabled}
            required
          />
          {errors.mobile && (
            <span className="error-message">{errors.mobile}</span>
          )}
        </div>

        <div className="button-group">
          <button disabled={isDisabled} className="submit-add-button">
            {loading ? (
              <>
                <LoadingSpinner size="small" />
                {t('addEmployee.buttons.adding')}
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUserCog} />
                {"      "}
                {t('addEmployee.buttons.add')}
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="reset-add-button"
            disabled={isDisabled}
          >
            <FontAwesomeIcon icon={faRedoAlt} />
            {"      "}
            {t('addEmployee.buttons.reset')}
          </button>
        </div>
      </form>
      <ModalComponent />
    </div>
  );
};

export default AddEmployee;