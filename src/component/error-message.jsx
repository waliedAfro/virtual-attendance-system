import React from "react";
import "../assets/css/admin/company-management.css";

const ErrorMessage = ({ title, message, onRetry, className = "" }) => {
  return (
    <div className={`error-message-container ${className}`}>
      <div className="error-icon">⚠️</div>
      {title && <h3 className="error-title">{title}</h3>}
      <p className="error-text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-retry">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
