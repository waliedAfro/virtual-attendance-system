import React, { useState, useCallback, useMemo, useEffect } from "react";
import CompanyAddressTab from "./company-wedget/company-address-tab";
import "../../assets/css/admin/company-management.css";
import CompanyContactPersonTab from "./company-wedget/company-contact-person-tab";
import CompanyBasicInfoTab from "./company-wedget/company-basic-info-tab";
import LoadingSpinner from "../../component/loading-spinner";
import { companyService } from "../../services/companyService";

// Add Company Form Component
const AddCompanyOld = ({ onSuccess, onCancel }) => {
  // Utility: safely get nested value from object by path
  const getValueByPath = (obj, path) => {
    return path
      .split(".")
      .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  };

  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    // Basic Info
    company: "",
    companyArabic: "",
    industry: { id: "" },
    employees: "",
    email: "",
    phone: "",
    companyType: { id: "" },
    ownershipType: { id: "" },

    // Address Info
    addresses: [],
    // Contact Person Info
    contacts: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  // Effect to automatically clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // ✅ Add new address
  const addAddress = (address) => {
    setFormData((prev) => ({
      ...prev,
      addresses: [...(prev.addresses || []), address],
    }));
  };

  // ✅ Add new Contact Person
  const addContactPerson = (contact) => {
    setFormData((prev) => ({
      ...prev,
      contacts: [...(prev.contacts || []), contact],
    }));
  };

  const resetForm = () => {
    // Reset form on success
    setFormData({
      company: "",
      companyArabic: "",
      industry: { id: "" },
      employees: "",
      email: "",
      phone: "",
      website: "",
      companyType: { id: "" },
      ownershipType: { id: "" },
      // Address Info
      addresses: [],
      contacts: [],
    });

    setActiveTab("basic");
    setErrors({});
    setTouched({});
  };

  // Tab configuration
  const tabs = [
    {
      id: "basic",
      label: "Basic Info",
      icon: "fas fa-building",
      description: "Company details",
      requiredFields: ["company", "companyType.id", "industry.id"],
    },
    {
      id: "address",
      label: "Address & Contact",
      icon: "fas fa-map-marker-alt",
      description: "Location information",
      requiredFields: ["addresses"],
    },
    {
      id: "contact",
      label: "Contact Person",
      icon: "fas fa-user-tie",
      description: "Primary contact",
      requiredFields: ["contacts"],
    },
  ];

  const getCurrentTabIndex = () =>
    tabs.findIndex((tab) => tab.id === activeTab);
  const currentTabIndex = getCurrentTabIndex();
  const isLastTab = currentTabIndex === tabs.length - 1;

  // ✅ Pure validity check (no state updates)
  const isFormValid = useMemo(() => {
    return tabs.every((tab) =>
      tab.requiredFields.every((field) => {
        const value = JSON.stringify(field).includes(".")
          ? getValueByPath(formData, field)
          : formData[field];
        return value && value.toString().trim() !== "";
      })
    );
  }, [formData, tabs]);

  //if (JSON.stringify(fieldPath).includes("."))
  // Check if current tab is valid
  const isEmptyValue = (value) => {
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object" && value !== null)
      return Object.keys(value).length === 0;
    return !value || value.toString().trim() === "";
  };

  const isCurrentTabValid = useCallback(() => {
    const currentTab = tabs[currentTabIndex];
    return !currentTab.requiredFields.some((field) => {
      const value = field.includes(".")
        ? getValueByPath(formData, field)
        : formData[field];
      return isEmptyValue(value);
    });
  }, [formData, currentTabIndex, tabs]);

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
  // Handle field blur for validation
  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Validate entire form (used only on submit / tab switch)
  const validateForm = useCallback(() => {
    const newErrors = {};

    tabs.forEach((tab) => {
      tab.requiredFields.forEach((field) => {
        const value = JSON.stringify(field).includes(".")
          ? getValueByPath(formData, field)
          : formData[field];
        if (!value || value.toString().trim() === "") {
          if (field === "addresses" && formData.addresses.length === 0) {
            console.log("validation :");
            console.log(formData.addresses.length);

            newErrors[field] = `company Address is required`;
          } else newErrors[field] = `${field.replace(/_/g, " ")} is required`;
        }
      });
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    /*
    if (
      formData.contactPerson.email &&!/\S+@\S+\.\S+/.test(formData.contactPerson.email)
    ) {
      newErrors.contactPerson.email = "Please enter a valid email address";
    }*/

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, tabs]);

  // Handle tab navigation
  const handleTabChange = useCallback(
    (tabId) => {
      if (validateForm()) {
        setActiveTab(tabId);
      }
    },
    [validateForm]
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    setLoading(true);
    try {
      await companyService.createCompany(formData);
      // Show success message
      setSuccessMessage("Company successfully created!");

      // Reset form
      resetForm();

      // Call onSuccess callback
      onSuccess?.(formData);
    } catch (error) {
      console.error("Failed to create company:", error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to cancel? All unsaved changes will be lost."
      )
    ) {
      onCancel?.();
    }
  }, [onCancel]);

  return (
    <div className="add-company-form">
      {/* Header */}
      <h4>Add New Company</h4>
      <div className="form-header">
        <div className="header-content"></div>

        {/* Progress bar */}
        <div className="form-progress">
          <div className="progress-steps">
            {tabs.map((tab, index) => {
              const isCompleted = index < currentTabIndex;
              const isCurrent = index === currentTabIndex;
              const isvalid = tab.requiredFields.every((field) => {
                const value = JSON.stringify(field).includes(".")
                  ? getValueByPath(formData, field)
                  : formData[field];
                return value && value.toString().trim() !== "";
              });

              return (
                <div
                  key={tab.id}
                  className={`progress-step ${isCompleted ? "completed" : ""} ${
                    isCurrent ? "current" : ""
                  } ${!isvalid ? "invalid" : ""}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <div className="step-number">
                    {isCompleted ? (
                      <i className="fas fa-check"></i>
                    ) : isCurrent ? (
                      <i className="fas fa-pen"></i>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="step-label">{tab.label}</div>
                  {!isvalid && <div className="step-error-indicator">!</div>}
                </div>
              );
            })}
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(currentTabIndex / (tabs.length - 1)) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Success message */}
      {successMessage && (
        <div className="form-success-banner">
          <i className="fas fa-check-circle"></i>
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage("")}
            aria-label="Dismiss success message"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Error message */}
      {errors.submit && (
        <div className="form-error-banner">
          <i className="fas fa-exclamation-circle"></i>
          <span>{errors.submit}</span>
          <button
            onClick={() => setErrors((prev) => ({ ...prev, submit: null }))}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="form-tabs">
        {tabs.map((tab) => {
          const isvalid = tab.requiredFields.every((field) => {
            const value = JSON.stringify(field).includes(".")
              ? getValueByPath(formData, field)
              : formData[field];
            return value && value.toString().trim() !== "";
          });

          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""} ${
                !isvalid ? "invalid" : ""
              }`}
              onClick={() => handleTabChange(tab.id)}
              type="button"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-tab`}
              disabled={loading}
            >
              <i className={tab.icon}></i>
              <span className="tab-label">{tab.label}</span>
              <span className="tab-description">{tab.description}</span>
              {!isvalid && <span className="tab-error-indicator">!</span>}
            </button>
          );
        })}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Basic Info Tab */}
        <div
          id="basic-tab"
          role="tabpanel"
          aria-labelledby="basic-tab"
          hidden={activeTab !== "basic"}
        >
          {activeTab === "basic" && (
            <CompanyBasicInfoTab
              formData={formData}
              onFormDataChange={handleFormDataChange} // 👈 add this
              onFieldBlur={handleBlur}
              errors={errors}
              touched={touched}
              loading={loading}
            />
          )}
        </div>

        {/* Address Tab */}
        <div
          id="address-tab"
          role="tabpanel"
          aria-labelledby="address-tab"
          hidden={activeTab !== "address"}
        >
          {activeTab === "address" && (
            <CompanyAddressTab
              formData={formData}
              addAddress={addAddress}
              errors={errors}
              touched={touched}
              loading={loading}
            />
          )}
        </div>

        {/* Contact Person Tab */}
        <div
          id="contact-tab"
          role="tabpanel"
          aria-labelledby="contact-tab"
          hidden={activeTab !== "contact"}
        >
          {activeTab === "contact" && (
            <CompanyContactPersonTab
              formData={formData}
              addContactPerson={addContactPerson}
              loading={loading}
            />
          )}
        </div>

        {/* Actions */}
        <div className="form-actions">
          <div className="action-buttons">
            {currentTabIndex > 0 && (
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setActiveTab(tabs[currentTabIndex - 1].id)}
                disabled={loading}
              >
                <i className="fas fa-arrow-left"></i>
                Back to {tabs[currentTabIndex - 1].label}
              </button>
            )}

            <div className="primary-actions">
              {!isLastTab ? (
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => setActiveTab(tabs[currentTabIndex + 1].id)}
                  disabled={loading || !isCurrentTabValid()}
                >
                  Continue to {tabs[currentTabIndex + 1].label}
                  <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading || !isFormValid} // ✅ no state update here
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="small" />
                      Adding Company...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check"></i>
                      Add Company
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="form-navigation">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={`nav-dot ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
                aria-label={`Go to ${tab.label}`}
                disabled={loading}
              >
                <span></span>
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Validation summary */}
      {Object.keys(errors).length > 0 && !errors.submit && (
        <div className="form-validation-summary">
          <h4>Please fix the following errors:</h4>
          <ul>
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>
                <button
                  type="button"
                  onClick={() => {
                    // Handle array-type fields like 'addresses'
                    if (field === "addresses") {
                      // Scroll to the addresses tab or section if needed
                      const addressSection =
                        document.querySelector("#address-tab");
                      if (addressSection) {
                        addressSection.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      } else {
                        // Optional: switch to the tab programmatically if you have a function
                        if (typeof setCurrentTabIndex === "function") {
                          const tabIndex = tabs.findIndex(
                            (t) => t.id === "address"
                          );
                          if (tabIndex !== -1) setCurrentTabIndex(tabIndex);
                        }
                      }
                    } else {
                      // Default scroll behavior for normal inputs
                      const target = document.querySelector(
                        `[name="${field}"]`
                      );
                      if (target) {
                        target.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                        target.focus();
                      }
                    }
                  }}
                >
                  {message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

AddCompanyOld.defaultProps = {
  onSuccess: () => {},
  onCancel: () => {},
};

export default AddCompanyOld;
