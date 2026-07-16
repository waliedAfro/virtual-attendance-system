import React, { useState } from 'react';
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token"); // Assumes URL is /reset-password?token=XYZ

  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });
  const [status, setStatus] = useState({ message: "", isError: false });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password !== passwords.confirmPassword) {
      return setStatus({ message: "Passwords do not match", isError: true });
    }

    setLoading(true);
    try {
      // Calling the service with token and new password
      await authService.resetPassword(token, passwords.password);
      setStatus({ message: "Password updated! Redirecting to login...", isError: false });
      
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setStatus({ message: err.message || "Reset failed. Link may be expired.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-logo">
        <h1 className="text-logo">New Password</h1>
      </div>

      {status.message && (
        <div className={status.isError ? "error-message" : "success-message"}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input 
          type="password" 
          name="password"
          placeholder="New Password" 
          onChange={handleChange}
          required 
        />
        <input 
          type="password" 
          name="confirmPassword"
          placeholder="Confirm New Password" 
          onChange={handleChange}
          required 
        />
        <button type="submit" disabled={loading || !token}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;