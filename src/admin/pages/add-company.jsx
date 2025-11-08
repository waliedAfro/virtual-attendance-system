import React, { useState, useCallback, useMemo, useEffect } from "react";
import "../../assets/css/admin/company-management.css";
import LoadingSpinner from "../../component/loading-spinner";
import { companyService } from "../../services/companyService";
import CompanyBasicInfoTab from "./company-wedget/company-basic-info-tab";
// Add Company Form Component
const AddCompany = () => {
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

  return (
    <div className="add-company-form">
      {/* Header */}
      <h4>Add New Company</h4>
      <div className="form-header">
        <CompanyBasicInfoTab />
      </div>
    </div>
  );
};

export default AddCompany;
