import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faChevronDown,
  faChevronUp,
  faGlobe,
  faKey,
  faSignOutAlt,
  faCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

import "../assets/css/menu/top_navbar.css";
import { authService } from "../services/authService";
import { EmployeeService } from "../services/employeeService";
import { ROUTES } from "../uitil/constants/routes"; // adjust path as needed
import logger from "../uitil/logger"; // adjust path as needed
import ConfirmDialog from "../component/ConfirmDialog"; // your modal component

// Language list for dropdown
const LANGUAGES = [
  { code: "en", labelKey: "english" },
  { code: "ar", labelKey: "arabic" },
];

// Avatar sub-component for better separation
const Avatar = ({ loading, photo, fullName, initials }) => {
  if (loading) {
    return <FontAwesomeIcon icon={faSpinner} spin size="lg" />;
  }
  if (photo) {
    return (
      <div className="user-image">
        <img src={photo} alt={`${fullName || "User"} avatar`} />
      </div>
    );
  }
  return (
    <div className="avatar" aria-label="User avatar">
      {initials}
    </div>
  );
};

const TopNavbar = ({ toggleSideMenu }) => {
  const { t, i18n } = useTranslation("topNav");
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({
    user: "",
    companyName: "",
    userId: "",
  });
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const dropdownRef = useRef(null);
  const userProfileRef = useRef(null);

  // ----- Handlers -----
  const toggleDropdown = useCallback(() => {
    setShowDropdown((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      userProfileRef.current &&
      !userProfileRef.current.contains(event.target)
    ) {
      setShowDropdown(false);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && showDropdown) {
        setShowDropdown(false);
      }
    },
    [showDropdown],
  );

  const handleLanguageChange = useCallback(
    (language) => {
      i18n.changeLanguage(language);
      setShowDropdown(false);
    },
    [i18n],
  );

  const handleChangePassword = useCallback(() => {
    setShowDropdown(false);
    navigate(ROUTES.CHANGE_PASSWORD);
  }, [navigate]);

  const handleLogoutClick = useCallback(() => {
    setShowDropdown(false);
    setShowConfirmLogout(true);
  }, []);

  const handleConfirmLogout = useCallback(() => {
    setShowConfirmLogout(false);
    authService.logout();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [navigate]);

  const handleCancelLogout = useCallback(() => {
    setShowConfirmLogout(false);
  }, []);

  // Compute initials (memoized, no need for useCallback)
  const initials = useMemo(() => {
    if (!userInfo.user) return "U";
    return userInfo.user
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [userInfo.user]);

  // ----- Load user data once -----
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const data = authService.getData();
        if (data) {
          setUserInfo({
            user: data.userFullName || "",
            companyName: data.tenantName || "",
            userId: data.userId || "",
          });
        }
      } catch (error) {
        logger.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserData();
  }, []);

  // ----- Load user photo, cancels on unmount -----
  useEffect(() => {
    if (!userInfo.userId) {
      setPhotoUrl(null);
      return;
    }

    let active = true;
    const loadPhoto = async () => {
      setPhotoLoading(true);
      try {
        const photo = await EmployeeService.getUserPhoto(userInfo.userId);
        if (active) {
          setPhotoUrl(photo);
        }
      } catch (error) {
        logger.error("Failed to load photo:", error);
        if (active) {
          setPhotoUrl(null);
        }
      } finally {
        if (active) {
          setPhotoLoading(false);
        }
      }
    };
    loadPhoto();

    return () => {
      active = false;
    };
  }, [userInfo.userId]);

  // ----- Close dropdown on outside click / Escape -----
  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      document.body.classList.add("dropdown-open");
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("dropdown-open");
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("dropdown-open");
    };
  }, [showDropdown, handleClickOutside, handleKeyDown]);

  const currentLanguage = i18n.language || "en";

  return (
    <>
      <nav
        className="top-navbar"
        role="navigation"
        aria-label={t("mainNavigation")}
      >
        <div className="nav-left">
          <button
            className="menu-toggle"
            onClick={toggleSideMenu}
            aria-label={t("toggleMenu")}
            title={t("toggleMenu")}
            type="button"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <span className="logo">{t("appName")}</span>
        </div>

        <div className="nav-center">
          <span className="logo">{userInfo.companyName}</span>
        </div>

        <div className="nav-right">
          <button
            className="user-profile"
            onClick={toggleDropdown}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && toggleDropdown()
            }
            ref={userProfileRef}
            type="button"
            aria-expanded={showDropdown}
            aria-haspopup="true"
            aria-label={t("userMenu")}
          >
            <span>
              {t("welcome")}{" "}
              {isLoading ? (
                <FontAwesomeIcon icon={faSpinner} spin size="sm" />
              ) : (
                userInfo.user || t("guest")
              )}
            </span>

            <Avatar
              loading={photoLoading}
              photo={photoUrl}
              fullName={userInfo.user}
              initials={initials}
            />

            <FontAwesomeIcon
              icon={showDropdown ? faChevronUp : faChevronDown}
              className="arrow-icon"
              aria-hidden="true"
            />
          </button>
        </div>
      </nav>

      {showDropdown && (
        <div className="dropdown-container" ref={dropdownRef}>
          <div className="dropdown-menu" role="menu" aria-label={t("userMenu")}>
            <div
              className="dropdown-section"
              role="group"
              aria-label={t("languageSelection")}
            >
              <div className="dropdown-header">{t("language")}</div>

              {LANGUAGES.map(({ code, labelKey }) => (
                <button
                  key={code}
                  className="dropdown-item"
                  onClick={() => handleLanguageChange(code)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    handleLanguageChange(code)
                  }
                  type="button"
                  role="menuitem"
                  aria-current={currentLanguage === code}
                >
                  <FontAwesomeIcon icon={faGlobe} aria-hidden="true" />
                  <span>{t(labelKey)}</span>
                  {currentLanguage === code && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      className="lang-check"
                      aria-label={t("selected")}
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="dropdown-divider" role="separator" />

            <div className="dropdown-section">
              <button
                className="dropdown-item"
                onClick={handleChangePassword}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && handleChangePassword()
                }
                type="button"
                role="menuitem"
              >
                <FontAwesomeIcon icon={faKey} aria-hidden="true" />
                <span>{t("changePassword")}</span>
              </button>
            </div>

            <div className="dropdown-divider" role="separator" />

            <div className="dropdown-section">
              <button
                className="dropdown-item logout"
                onClick={handleLogoutClick}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && handleLogoutClick()
                }
                type="button"
                role="menuitem"
              >
                <FontAwesomeIcon icon={faSignOutAlt} aria-hidden="true" />
                <span>{t("logout")}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom confirmation modal */}
      <ConfirmDialog
        open={showConfirmLogout}
        title={t("confirmLogout")}
        message={t("confirmLogoutMessage")} // optional
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        confirmText={t("logout")}
        cancelText={t("cancel")}
      />
    </>
  );
};

export default React.memo(TopNavbar);
