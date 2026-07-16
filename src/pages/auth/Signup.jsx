
import React from 'react'
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/authService";
import "./css/signup.css";
const Signup = ()=>  {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tenantName: "",
    tenantNameAr: "",
    tenantPhone: "",
    billingEmail: "",
    maxUsers: "",
    storageQuotaMb: "",
    fullname: "",
    fullnameAr: "",
    email: "",
    mobile: "",
    password: "",
    rePassword: ""
  });

  const [error, setError] = useState("");
  const [success , setSuccess] = useState("") ;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (formData.password !== formData.rePassword) {
      return "Passwords do not match";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (formData.maxUsers <= 0) {
      return "Max users must be greater than 0";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      
       response = await authService.signup(formData);
      if(response.data.success)
      {
        setError("");
       setSuccess("Tenant & Admin created successfully!");
      navigate("/home");
      }
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="auth-container-large">
      <h2>Create SmartLogs Tenant</h2>

      {success && <p className="success">{error}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>

        <h3>Tenant Information</h3>

        <input
          type="text"
          name="tenantName"
          placeholder="Tenant Name (English)"
          onChange={handleChange}
          value={formData.tenantName || ""}
          required
        />

        <input
          type="text"
          name="tenantNameAr"
          placeholder="Tenant Name (Arabic)"
          onChange={handleChange}
          value={formData.tenantNameAr}
        />

        <input
          type="text"
          name="tenantPhone"
          placeholder="Tenant Contact phone"
          onChange={handleChange}
          required
          value={formData.tenantPhone}
        />

        <input
          type="email"
          name="billingEmail"
          placeholder="Billing Email"
          onChange={handleChange}
          required
          value={formData.billingEmail}
        />

        <input
          type="number"
          name="maxUsers"
          placeholder="Max Users"
          onChange={handleChange}
          required
          value={formData.maxUsers}
        />

        <input
          type="number"
          name="storageQuotaMb"
          placeholder="Storage Quota (MB)"
          onChange={handleChange}
          required
          value={formData.storageQuotaMb}
        />

        <h3>Admin User</h3>

        <input
          type="text"
          name="fullname"
          placeholder="Full Name (English)"
          onChange={handleChange}
          required
          value={formData.fullname}
        />

        <input
          type="text"
          name="fullnameAr"
          placeholder="Full Name (Arabic)"
          onChange={handleChange}
          value={formData.fullnameAr}
        />

        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          onChange={handleChange}
          required
          value={formData.email}
        />

        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          onChange={handleChange}
          value={formData.mobile}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          value={formData.password}
        />

        <input
          type="password"
          name="rePassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
          value={formData.rePassword}
        />

        <button type="submit">Register Tenant</button>
      </form>

      <p>
        Already have account? <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Signup
