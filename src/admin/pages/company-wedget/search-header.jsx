import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faFilter, faSearch } from "@fortawesome/free-solid-svg-icons";
import ActiveFilters from "./active-filters";
import FormInput from "../../../component/form-input";

const SearchHeader = ({
  searchTerm,
  onSearchTermChange,
  onSearch,
  onAdvancedSearch,
  onClearSearch,
  activeFilters,
  isLoading,
  onRemoveFilter, // Add this prop
}) => {
  const hasActiveFilters = Object.values(activeFilters).some((value) => {
    if (typeof value === "string") {
      return value !== "";
    } else if (value && typeof value === "object" && value.id !== undefined) {
      return value.id > 0;
    }
    return false;
  });

  return (
    <div className="search-section">
      <form onSubmit={onSearch} className="search-form">
        <div className="search-input-group">
          <div className="search-field-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <FormInput
              placeholder="Search by name, industry, city, or email..."
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="search-input"
              disabled={isLoading}
            />
            {hasActiveFilters && (
              <div className="active-filters-badge">
                <FontAwesomeIcon icon={faFilter} />
                Filters Active
              </div>
            )}
          </div>

          <button
            type="submit"
            className="search-btn primary"
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faSearch} />
            {isLoading ? "Searching..." : "Search"}
          </button>

          <button
            type="button"
            onClick={onAdvancedSearch}
            className="filter-btn secondary"
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faFilter} />
            Advanced
          </button>

          <button
            type="button"
            onClick={onClearSearch}
            className="clear-btn tertiary"
            disabled={isLoading}
          >
            <FontAwesomeIcon icon={faTimes} />
            Clear
          </button>
        </div>
      </form>

      <ActiveFilters
        activeFilters={activeFilters}
        onClearFilters={onClearSearch}
        onRemoveFilter={onRemoveFilter}
      />
    </div>
  );
};

export default SearchHeader;
