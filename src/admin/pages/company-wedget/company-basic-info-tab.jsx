import React, { useState, useCallback, useEffect } from "react";
import { CompanyTypeService } from "../../../services/companyTypeService";
import { OwnershipTypeService } from "../../../services/ownershipTypeService";
import { IndustryService } from "../../../services/industryService";
import LoadingSpinner from "../../../component/loading-spinner";
import useApi from "../../../hooks/useApi";
import FormInput from "../../../component/form-input";
import FormSelect from "../../../component/form-select";
import "../../../assets/css/admin/company-management.css";
import { companyService } from "../../../services/companyService";

// Add Company Basic info Tab Form Component
const CompanyBasicInfoTab = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: "",
    lastName: "",
    company: "",
    companyArabic: "",
    industry: { id: "" },
    employees: "",
    email: "",
    phone: "",
    companyType: { id: "" },
    ownershipType: { id: "" },
  });

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Fetch company types
  const {
    data: companyTypes,
    loading: companyTypesLoading,
    error: companyTypesError,
    execute: refreshCompanyTypes,
  } = useApi(CompanyTypeService.getActiveCompanyTypes, [], true);

  // Fetch industries
  const {
    data: industries,
    loading: industriesLoading,
    error: industriesError,
    execute: refreshIndustries,
  } = useApi(IndustryService.getActiveIndustries, [], true);

  // Fetch ownership types
  const {
    data: ownershipTypes,
    loading: ownershipTypesLoading,
    error: ownershipTypesError,
    execute: refreshOwnershipTypes,
  } = useApi(OwnershipTypeService.getActiveOwnershipTypes, [], true);

  // Loading state for all API calls
  const isLoading =
    companyTypesLoading || industriesLoading || ownershipTypesLoading;

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  // --- utility function for deep updates ---
  const updateNestedField = (obj, path, value) => {
    if (!path || typeof path !== "string") return obj;
    const keys = path.split(".");
    const lastKey = keys.pop();
    let deep = { ...obj };

    let pointer = deep;
    for (const key of keys) {
      pointer[key] = { ...pointer[key] }; // clone each level
      pointer = pointer[key];
    }

    pointer[lastKey] = value;
    return deep;
  };
  // Utility: safely get nested value from object by path
  const getValueByPath = (obj, path) => {
    return path
      .split(".")
      .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  };
  // --- unified updater ---
  const handleFormDataChange = useCallback((fieldPath, value) => {
    const parsedValue = !isNaN(value) && value !== "" ? Number(value) : value;
    if (JSON.stringify(fieldPath).includes(".")) {
      setFormData((prev) => updateNestedField(prev, fieldPath, parsedValue));
    } else {
      setFormData((prev) => ({
        ...prev,
        [fieldPath]: value,
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      companyService.createCompany(formData);
      showNotification("Company  created successfully!", "success");

      resetForm();
    } catch (error) {
      showNotification(
        "Error creating device: " + (error.response?.data || error.message),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  const resetForm = () => {
    // Reset form on success
    setFormData({
      firstName: "",
      lastName: "",
      company: "",
      companyArabic: "",
      industry: { id: "" },
      employees: "",
      email: "",
      phone: "",
      companyType: { id: "" },
      ownershipType: { id: "" },
    });
  };

  // Any error from API calls
  const hasError = companyTypesError || industriesError || ownershipTypesError;

  return (
    <div>
      <div className="form-section">
        <h3 className="form-section-title">Basic Company Information</h3>
        {loading && <LoadingSpinner />}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <FormInput
              label="First Name"
              className="form-group"
              name="firstName"
              onChange={(e) =>
                handleFormDataChange("firstName", e.target.value)
              } // 👈 update parent
              value={formData.firstName ?? ""}
              placeholder="First Name "
              required
            />

            <FormInput
              label="Last Name"
              className="form-group"
              name="lastName"
              onChange={(e) => handleFormDataChange("lastName", e.target.value)} // 👈 update parent
              value={formData.lastName ?? ""}
              placeholder="Last Name "
              required
            />
          </div>

          <div className="form-row">
            <FormInput
              label="Company Name (English) "
              name="company"
              value={formData.company ?? ""}
              onChange={(e) => handleFormDataChange("company", e.target.value)} // 👈 update parent
              required
              placeholder="Enter Company Name"
              className="form-group"
              maxLength={120}
            />

            <FormInput
              label="Company Name (Arabic)"
              name="companyArabic"
              value={formData.companyArabic ?? ""}
              onChange={(e) =>
                handleFormDataChange("companyArabic", e.target.value)
              } // 👈 update parent
              placeholder="ادخل اسم الشركة"
              className="form-group"
              maxLength={120}
              dir="rtl"
            />
          </div>

          <div className="form-row">
            <FormSelect
              className="form-group"
              label="Company Type "
              name="companyType.id"
              value={formData.companyType.id}
              onChange={(e) =>
                handleFormDataChange("companyType.id", e.target.value)
              } // 👈 update parent
              required
              options={companyTypes?.map((type) => ({
                key: type.id,
                value: type.id,
                label: type.companyType,
              }))}
              disabled={loading || companyTypes.length === 0}
              loading={companyTypesLoading}
            />

            <FormSelect
              className="form-group"
              label="Ownership Type "
              name="ownershipType.id"
              value={formData.ownershipType.id || ""}
              onChange={(e) =>
                handleFormDataChange("ownershipType.id", e.target.value)
              } // 👈 update parent
              required
              options={ownershipTypes.map((type) => ({
                key: type.id,
                value: type.id,
                label: type.ownerhipType,
              }))}
              disabled={loading || ownershipTypes.length === 0}
              loading={ownershipTypesLoading}
              placeholder="Select Ownership Type"
            />
          </div>

          <div className="form-row">
            <FormSelect
              className="form-group"
              label="Industry "
              name="industry.id"
              value={formData.industry.id || ""}
              onChange={(e) =>
                handleFormDataChange("industry.id", e.target.value)
              } // 👈 update parent
              required
              options={industries.map((industry) => ({
                key: industry.id,
                value: industry.id,
                label: industry.industry,
              }))}
              disabled={loading || industries.length === 0}
              loading={industriesLoading}
              placeholder="Select Industry"
            />

            <FormInput
              label="Number of Employees"
              name="employees"
              type="number"
              value={formData.employees ?? 0}
              onChange={(e) =>
                handleFormDataChange("employees", e.target.value)
              } // 👈 update parent
              min="1"
              max="1000000"
              className="form-group"
              disabled={loading}
              placeholder="e.g., 50"
            />
          </div>

          <div className="form-row">
            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email ?? ""}
              onChange={(e) => handleFormDataChange("email", e.target.value)} // 👈 update parent
              className="form-group"
            />

            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone ?? ""}
              onChange={(e) => handleFormDataChange("phone", e.target.value)} // 👈 update parent
              className="form-group"
              disabled={loading}
              placeholder="+1234567890"
            />
          </div>

          <div>
            <button type="button" className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Company
            </button>
          </div>
        </form>
      </div>
      {/* Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button
            className="notification-close"
            onClick={() =>
              setNotification({ show: false, message: "", type: "" })
            }
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyBasicInfoTab;
