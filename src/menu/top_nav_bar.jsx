import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronDown,
  faChevronUp,
  faGlobe,
  faKey,
  faSignOutAlt,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import "../assets/css/menu/top_navbar.css";

// Top Navigation Component
const TopNavbar = ({ toggleSideMenu }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const userProfileRef = useRef(null);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      // Add class to body when dropdown is open
      document.body.classList.add("dropdown-open");
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      // Remove class from body when dropdown is closed
      document.body.classList.remove("dropdown-open");
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("dropdown-open");
    };
  }, [showDropdown]);

  const handleLanguageChange = (language) => {
    console.log("Language changed to:", language);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    console.log("User logged out");
    setShowDropdown(false);
  };

  const handleChangePassword = () => {
    console.log("Change password clicked");
    setShowDropdown(false);
  };

  return (
    <>
      <nav className="top-navbar">
        <div className="nav-left">
          <button className="menu-toggle" onClick={toggleSideMenu}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <span className="logo">Virtual Attendance System</span>
        </div>
        <div className="nav-right">
          <div
            className="user-profile"
            onClick={toggleDropdown}
            ref={userProfileRef}
          >
            <span>Elwalied Elnour</span>
            <div className="avatar">EE</div>
            {showDropdown ? (
              <FontAwesomeIcon icon={faChevronDown} />
            ) : (
              <FontAwesomeIcon icon={faChevronUp} />
            )}
          </div>
        </div>
      </nav>

      {/* Dropdown positioned at the top of the body */}
      {showDropdown && (
        <div className="dropdown-container" ref={dropdownRef}>
          <div className="dropdown-menu">
            <div className="dropdown-section">
              <div className="dropdown-header">Language</div>
              <div
                className="dropdown-item"
                onClick={() => handleLanguageChange("en")}
              >
                <div className="dropdown-item-icon">
                  <FontAwesomeIcon icon={faGlobe} />
                </div>
                <span>English</span>
                <div className="dropdown-item-icon">
                  <FontAwesomeIcon icon={faCheck} className="lang-check" />
                </div>
              </div>

              <div
                className="dropdown-item"
                onClick={() => handleLanguageChange("ar")}
              >
                <div className="dropdown-item-icon">
                  <FontAwesomeIcon icon={faGlobe} />
                </div>

                <span>العربية (Arabic)</span>
              </div>
            </div>

            <div className="dropdown-divider"></div>

            <div className="dropdown-section">
              <div className="dropdown-item" onClick={handleChangePassword}>
                <div className="dropdown-item-icon">
                  <FontAwesomeIcon icon={faKey} />
                </div>
                <span>Change Password</span>
              </div>
            </div>

            <div className="dropdown-divider"></div>

            <div className="dropdown-section">
              <div className="dropdown-item logout" onClick={handleLogout}>
                <div className="dropdown-item-icon">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </div>
                <span>Logout</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNavbar;
