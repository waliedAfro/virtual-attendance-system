import React from 'react'

import { useState , useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import {authService }  from "../../services/authService";


import "./css/login.css";
const Login = ()=> {

const [formData, setFormData] = useState({ email: "", password: "" });
const navigate = useNavigate();
const [errorCredential, setErrorCredential] = useState("");
const [showError, setShowError] = useState(false);
const [loading, setLoading] = useState(false);


 // Auto-hide error message after 5 seconds
 useEffect(() => {
  let timer;
  if (showError) {
    timer = setTimeout(() => {
      setShowError(false);
      // Optionally clear the error message after hide
      // setErrorCredential("");
    }, 5000); // 5000ms = 5 seconds
  }
  return () => clearTimeout(timer); // Cleanup timer on unmount or when showError changes
}, [showError]);

const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
  // Hide error when user starts typing
  if (showError) {
    setShowError(false);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorCredential("");
  setShowError(false);
  setLoading(true);

  try {
    const response = await authService.login(formData);
    
    // Fix: Check if success is true (boolean) and token exists
    if (response?.data?.token) {
      authService.saveToken(response.data.token);
      authService.saveData(response.data) ;
      navigate("/home"); // This will now work since we added the /login route
    }

    setErrorCredential(response?.message || "Login failed");
    setShowError(true);

  } catch (error) {
  
    console.error(error);

    // Because service layer throws new Error(message)
    const message =
      error?.message ||
      "Network error. Please check your connection";

    setErrorCredential(message);
    setShowError(true);

  } finally {
    setLoading(false);
  }
};

return (
  <div className="auth-container">

<div className="auth-logo">
    {/* For image logo */}
      {/*<img src="/path/to/your-logo.png" alt="Smart Logs" />*/}
   <h1 className="text-logo"> SmartLogs Login</h1> 
  </div>

  {showError && errorCredential && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{errorCredential}</span>
          <button 
            className="error-close" 
            onClick={() => setShowError(false)}
            aria-label="Close"
          >
            ×
          </button>
          <div className="error-progress"></div>
        </div>
      )}

    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        name="email" 
        placeholder="Email" 
        onChange={handleChange}
        value={formData.email || ""}
        required 
      />
      <input 
        type="password" 
        name="password" 
        placeholder="Password" 
        onChange={handleChange}
        value={formData.password || ""}
        required 
      />
      <div className="forgot-password-link">
  <Link to="/forgot-password">Forgot Password?</Link>
</div>

      <button type="submit" disabled={loading}> {loading ? "Logging in..." : "Login"}</button>
    </form>
    <p>
      Don't have an account? <Link to="/signup">Signup</Link>
    </p>
  </div>
);
}
export default Login ;
