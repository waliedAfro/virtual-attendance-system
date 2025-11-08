// company-wedget/active-filters.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ActiveFilters = ({ activeFilters, onClearFilters, onRemoveFilter }) => {
  const hasActiveFilters = Object.values(activeFilters).some((value) => {
    // Check for string values and object values with id > 0
    if (typeof value === "string") {
      return value !== "";
    } else if (value && typeof value === "object" && value.id !== undefined) {
      return value.id > 0;
    }
    return false;
  });

  if (!hasActiveFilters) return null;

  // Format filter key for display
  const formatFilterKey = (key) => {
    const keyMap = {
      company: "Company Name",
      companyArabic: "Company Name (Arabic)",
      phone: "Phone",
      email: "Email",
      companyStatus: "Company Status",
      companyType: "Company Type",
      industry: "Industry",
      ownershipType: "Ownership Type",
    };

    return (
      keyMap[key] ||
      key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
    );
  };

  // Format filter value for display
  const formatFilterValue = (key, value) => {
    if (typeof value === "string") {
      return value;
    } else if (value && typeof value === "object" && value.id !== undefined) {
      // For object types, you might want to display the name instead of ID
      // This depends on your data structure
      return value.name || `ID: ${value.id}`;
    }
    return String(value);
  };

  // Check if a filter has a value
  const hasValue = (value) => {
    if (typeof value === "string") {
      return value !== "";
    } else if (value && typeof value === "object" && value.id !== undefined) {
      return value.id > 0;
    }
    return false;
  };

  const handleRemoveFilter = (key) => {
    if (onRemoveFilter) {
      onRemoveFilter(key);
    }
  };

  return (
    <div className="active-filters">
      <div className="filters-header">
        <span>Active Filters:</span>
        <button
          onClick={onClearFilters}
          className="clear-filters-small"
          type="button"
        >
          Clear All
        </button>
      </div>
      <div className="filters-tags">
        {Object.entries(activeFilters).map(
          ([key, value]) =>
            hasValue(value) && (
              <span key={key} className="filter-tag">
                {formatFilterKey(key)}: {formatFilterValue(key, value)}
                <button
                  onClick={() => handleRemoveFilter(key)}
                  type="button"
                  aria-label={`Remove ${formatFilterKey(key)} filter`}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            )
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
