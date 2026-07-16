import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import menuData from "./sideMenu.json";
import "../assets/css/menu/menu1.css";

// Icon imports – consolidated and clean
import {
  faEye,
  faHome,
  faTachometerAlt,
  faSearch,
  faPlus,
  faChartBar,
  faCog,
  faQuestionCircle,
  faBuilding,
  faMicrochip,
  faLocationDot,
  faUsers,
  faUserPlus,
  faChevronDown,
  faChevronRight,
  faChevronLeft,
  faUserCog,
  faCalendarAlt,
  faCreditCard,
  faFileContract,
  faIdCard,
  faChartPie,
  faDollarSign,
  faFileInvoiceDollar,
  faMoneyBillWave,
  faChartLine,
  faReceipt,
  faFileInvoice,
  faCreditCard as faCreditCardSolid, // renamed to avoid duplicate
} from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  faEye,
  faHome,
  faTachometerAlt,
  faSearch,
  faPlus,
  faChartBar,
  faCog,
  faQuestionCircle,
  faBuilding,
  faMicrochip,
  faLocationDot,
  faUsers,
  faUserPlus,
  faChevronDown,
  faChevronRight,
  faChevronLeft,
  faUserCog,
  faCalendarAlt,
  faCreditCard,
  faFileContract,
  faIdCard,
  faChartPie,
  faDollarSign,
  faFileInvoiceDollar,
  faMoneyBillWave,
  faChartLine,
  faReceipt,
  faFileInvoice,
  faCreditCardSolid,
};

/**
 * Side navigation menu component.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls whether the menu is expanded or collapsed.
 */
const SideMenue = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation("sideMenu");

  const [expandedMenus, setExpandedMenus] = useState({});
  const isRtl = i18n.language === "ar";

  // Initialize expanded state for all sections
  useEffect(() => {
    const init = {};
    menuData.menu.forEach((item) => {
      if (item.type === "section") {
        init[item.key] = false;
      }
    });
    setExpandedMenus(init);
  }, []);

  // Auto‑expand sections that contain the current route
  useEffect(() => {
    const currentPath = location.pathname.replace(/^\//, "") || "home";

    setExpandedMenus((prev) => {
      const newState = { ...prev };
      menuData.menu.forEach((item) => {
        if (item.type === "section" && item.children) {
          const hasActiveChild = item.children.some((child) => {
            if (!child.path) return false;
            // Exact match or child path is a prefix of current path
            return (
              currentPath === child.path ||
              currentPath.startsWith(child.path + "/")
            );
          });
          if (hasActiveChild) {
            newState[item.key] = true;
          }
        }
      });
      return newState;
    });
  }, [location.pathname]);

  // Navigation handler
  const handleNavigate = useCallback(
    (path) => {
      navigate(`/${path}`);
    },
    [navigate]
  );

  // Toggle section expansion
  const toggleMenu = useCallback((key) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  // Check if a given path is active (exact or prefix match)
  const isActive = useCallback(
    (path) => {
      if (!path) return false;
      const currentPath = location.pathname.replace(/^\//, "") || "home";
      return currentPath === path || currentPath.startsWith(path + "/");
    },
    [location.pathname]
  );

  // Render icon helper
  const renderIcon = useCallback((iconName) => {
    if (!iconName) return null;
    const icon = iconMap[iconName];
    return icon ? <FontAwesomeIcon icon={icon} className="menu-icon" /> : null;
  }, []);

  // Memoize the menu items to avoid re‑rendering on every parent update
  const renderedMenuItems = useMemo(() => {
    return menuData.menu.map((item, index) => {
      if (item.type === "divider") {
        return <div key={`divider-${index}`} className="menu-divider" />;
      }

      if (item.type === "item") {
        const active = isActive(item.path);
        return (
          <div
            key={item.path || `item-${index}`}
            className={`menu-item ${active ? "active" : ""}`}
            onClick={() => handleNavigate(item.path)}
          >
            {renderIcon(item.icon)}
            <span className="menu-text">{t(item.translationKey, item.label)}</span>
          </div>
        );
      }

      if (item.type === "section") {
        const isExpanded = expandedMenus[item.key] || false;
        const sectionKey = item.key;

        return (
          <div key={sectionKey || `section-${index}`} className="menu-section">
            <div
              className="menu-section-header"
              onClick={() => toggleMenu(sectionKey)}
            >
              {renderIcon(item.icon)}
              <span className="menu-text">{t(item.translationKey, item.label)}</span>
              <FontAwesomeIcon
                icon={
                  isExpanded
                    ? faChevronDown
                    : isRtl
                    ? faChevronLeft
                    : faChevronRight
                }
                className="menu-arrow"
              />
            </div>

            {isExpanded && (
              <div className="submenu">
                {item.children?.map((child, idx) => {
                  // Header
                  if (child.type === "header") {
                    return (
                      <div key={child.translationKey || `header-${idx}`} className="submenu-header">
                        <span>{t(child.translationKey, child.header)}</span>
                      </div>
                    );
                  }

                  // Regular child item
                  const childActive = child.path ? isActive(child.path) : false;
                  return (
                    <div
                      key={child.path || `child-${idx}`}
                      className={`submenu-item ${childActive ? "active" : ""} ${
                        child.nested ? "nested" : ""
                      }`}
                      onClick={() => child.path && handleNavigate(child.path)}
                    >
                      {child.icon && renderIcon(child.icon)}
                      <span>{t(child.translationKey, child.label)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      return null;
    });
  }, [
    expandedMenus,
    isActive,
    handleNavigate,
    renderIcon,
    t,
    isRtl,
    toggleMenu,
  ]);

  return (
    <div className={`side-menu ${isOpen ? "open" : ""} ${isRtl ? "rtl" : ""}`}>
      <div className="menu-header">
        <h3 className="menu-title">SmartLogs</h3>
      </div>
      <div className="menu-items">{renderedMenuItems}</div>
    </div>
  );
};

SideMenue.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default React.memo(SideMenue);