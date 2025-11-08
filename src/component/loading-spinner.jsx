import React from "react";
import "../assets/css/admin/company-management.css";

const LoadingSpinner = ({ size = "medium", message, className = "" }) => {
  return (
    <div className={`loading-spinner-container ${className}`}>
      <div className={`loading-spinner ${size}`}>
        <div className="spinner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
