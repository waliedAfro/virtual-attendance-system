import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import ReadOnlyField from "../../component/read-onlyField";
import "./css/view-company.css";
import { useTranslation } from "react-i18next";

const ViewCompany = () => {
  const [formData, setFormData] = useState({
    companyId: "",
    companyCode: "",
    companyName: "",
    companyNameAr: "",
    companyContact: "",
    maxUser: "0",
    status: "",
    billingEmail: "",
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const tenant = authService.getData();
    console.log(tenant);
    if (tenant) {
      setFormData({
        companyId: tenant.tenantId || "",
        companyCode: tenant.tenantCode || "",
        companyName: tenant.tenantName || "",
        companyNameAr: tenant.tenantNameAr || "",
        companyContact: tenant.tenantPhone || "",
        maxUser: tenant.maxUser || "0",
        status: tenant.status || "",
        billingEmail: tenant.billingEmail || "",
      });
    }
  }, []);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

    const { t, i18n } = useTranslation("company");

  return (
    <div className="company-container">
      <div className="company-logo">
        <h1 className="text-logo">{t("title")}</h1>
      </div>

      <div className="view-company-form">
        {/* Using ReadOnlyField component for consistent styling */}
      
        <div className="input-group">
          <label htmlFor="companyCode">{t("companyCode")}</label>
          <input
            id="companyCode"
            name="companyCode"
            type="text"
            value={formData.companyCode || ""}
            readOnly
            className="readonly-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="companyName">{t("companyName")} </label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            value={formData.companyName || ""}
            readOnly
            className="readonly-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="companyNameAr">{t("companyNameAr")} </label>
          <input
            id="companyNameAr"
            name="companyNameAr"
            type="text"
            value={formData.companyNameAr || ""}
            readOnly
            className="readonly-input"
            dir="rtl"
          />
        </div>

        <div className="input-group">
          <label htmlFor="companyContact">{t("phoneNumber")} </label>
          <input
            id="companyContact"
            name="companyContact"
            type="tel"
            value={formData.companyContact || ""}
            readOnly
            className="readonly-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="maxUser">{t("maxUsers")} </label>
          <input
            id="maxUser"
            name="maxUser"
            type="number"
            value={formData.maxUser || "0"}
            readOnly
            className="readonly-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="status">{t("status")} </label>
          <input
            id="status"
            name="status"
            type="text"
            value={formData.status || ""}
            readOnly
            className="readonly-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="billingEmail">{t("billingEmail")} </label>
          <input
            id="billingEmail"
            name="billingEmail"
            type="email"
            value={formData.billingEmail || ""}
            readOnly
            className="readonly-input"
          />
        </div>
</div>
    </div>
  );
};

export default ViewCompany;