import React, { useState } from "react";
import "../../assets/css/admin/home-admin.css";

// Home Component
const HomeAdmin = () => {
  return (
    <div className="home">
      <h1>Welcome to CompanyManager</h1>
      <p>Efficiently manage your business contacts and company information</p>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>24</h3>
          <p>Total Companies</p>
        </div>
        <div className="stat-card">
          <h3>12</h3>
          <p>New This Month</p>
        </div>
        <div className="stat-card">
          <h3>3</h3>
          <p>Needs Update</p>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>Added TechCorp Inc. - Today</li>
          <li>Updated FinanceLLC - Yesterday</li>
          <li>Added StartupXYZ - 2 days ago</li>
        </ul>
      </div>
    </div>
  );
};

export default HomeAdmin;
