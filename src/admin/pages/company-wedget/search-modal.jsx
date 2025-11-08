// company-wedget/search-modal.js
import React, { useState, useCallback } from "react";
import { CompanyTypeService } from "../../../services/companyTypeService";
import { OwnershipTypeService } from "../../../services/ownershipTypeService";
import { IndustryService } from "../../../services/industryService";
import useApi from "../../../hooks/useApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faBuilding,
  faIndustry,
  faPhone,
  faSearch,
  faEnvelope,
  faCheckDouble,
  faBoxes,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const SearchModal = ({ isOpen, onClose, onSearch, initialFilters = {} }) => {
  // Fetch industries
  const {
    data: industries,
    loading: industriesLoading,
    error: industriesError,
    execute: refreshIndustries,
  } = useApi(IndustryService.getActiveIndustries, [], true);

  // Fetch company types
  const {
    data: companyTypes,
    loading: companyTypesLoading,
    error: companyTypesError,
    execute: refreshCompanyTypes,
  } = useApi(CompanyTypeService.getActiveCompanyTypes, [], true);

  // Fetch ownership types
  const {
    data: ownershipTypes,
    loading: ownershipTypesLoading,
    error: ownershipTypesError,
    execute: refreshOwnershipTypes,
  } = useApi(OwnershipTypeService.getActiveOwnershipTypes, [], true);

  const [filters, setFilters] = useState({
    company: initialFilters.company || "",
    companyArabic: initialFilters.companyArabic || "",
    phone: initialFilters.phone || "",
    email: initialFilters.email || "",
    companyStatus: initialFilters.companyStatus || "",
    companyType: { id: 0 },
    industry: { id: 0 },
    ownershipType: { id: 0 },
  });

  // --- utility function for deep updates ---
  const updateNestedField = (obj, path, value) => {
    if (!path || typeof path !== "string") return obj;
    const keys = path.split(".");
    const lastKey = keys.pop();
    let deep = { ...obj };

    let pointer = deep;
    for (const key of keys) {
      pointer[key] = { ...pointer[key] }; // clone each level
      pointer = pointer[key];
    }

    pointer[lastKey] = value;
    return deep;
  };

  // --- unified updater ---
  const handleFormDataChange = useCallback((fieldPath, value) => {
    const parsedValue = !isNaN(value) && value !== "" ? Number(value) : value;
    if (JSON.stringify(fieldPath).includes(".")) {
      setFilters((prev) => updateNestedField(prev, fieldPath, parsedValue));
    } else {
      setFilters((prev) => ({
        ...prev,
        [fieldPath]: value,
      }));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      company: "",
      companyArabic: "",
      phone: "",
      email: "",
      companyType: { id: 0 },
      companyStatus: "",
      industry: { id: 0 },
      ownershipType: { id: 0 },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <ModalHeader onClose={onClose} />

        <SearchForm
          filters={filters}
          onInputChange={handleFormDataChange}
          onSubmit={handleSubmit}
          onClear={handleClear}
          onClose={onClose}
          industries={industries}
          companyTypes={companyTypes}
          ownershipTypes={ownershipTypes}
        />
      </div>
    </div>
  );
};

// Sub-components for Modal
const ModalHeader = ({ onClose }) => (
  <div className="modal-header">
    <h3>Advanced Search</h3>
    <button className="close-btn" onClick={onClose}>
      <FontAwesomeIcon icon={faTimes} />
    </button>
  </div>
);

const SearchForm = ({
  filters,
  onInputChange,
  onSubmit,
  onClear,
  onClose,
  industries,
  companyTypes,
  ownershipTypes,
}) => (
  <form onSubmit={onSubmit} className="search-modal-form">
    <FilterGrid
      filters={filters}
      onInputChange={onInputChange}
      industries={industries}
      companyTypes={companyTypes}
      ownershipTypes={ownershipTypes}
    />
    <ModalActions onClear={onClear} onClose={onClose} />
  </form>
);

const FilterGrid = ({
  filters,
  onInputChange,
  industries,
  companyTypes,
  ownershipTypes,
}) => (
  <div className="filter-grid">
    <FilterField
      id="company"
      label="Company Name"
      icon={faBuilding}
      value={filters.company}
      onChange={(value) => onInputChange("company", value)}
      placeholder="Enter company name..."
    />

    <FilterField
      id="companyArabic"
      label="Company Name Arabic"
      icon={faBuilding}
      value={filters.companyArabic}
      onChange={(value) => onInputChange("companyArabic", value)}
      placeholder="Enter company name..."
    />

    <FilterSelect
      id="industry.id"
      label="Industry"
      icon={faIndustry}
      value={filters.industry.id}
      onChange={(value) => onInputChange("industry.id", value)}
      options={industries?.map((industry) => ({
        key: industry.id,
        value: industry.id,
        label: industry.industry,
      }))}
    />

    <FilterSelect
      id="ownershipType.id"
      label="Owner"
      icon={faUser}
      value={filters.ownershipType.id}
      onChange={(value) => onInputChange("ownershipType.id", value)}
      options={ownershipTypes.map((type) => ({
        key: type.id,
        value: type.id,
        label: type.ownerhipType,
      }))}
    />

    <FilterField
      id="phone"
      label="Phone"
      icon={faPhone}
      value={filters.phone}
      onChange={(value) => onInputChange("phone", value)}
      placeholder="Enter phone number..."
    />

    <FilterField
      id="email"
      label="Email"
      icon={faEnvelope}
      value={filters.email}
      onChange={(value) => onInputChange("email", value)}
      placeholder="Enter phone number..."
    />

    <FilterSelect
      id="companyStatus"
      label="Status"
      icon={faCheckDouble}
      value={filters.companyStatus}
      onChange={(value) => onInputChange("companyStatus", value)}
      options={[
        { value: "PND", label: "Pending" },
        { value: "APP", label: "Approved" },
        { value: "PAD", label: "Paid" },
      ]}
    />
    <FilterSelect
      id="companyType.id"
      label="Type"
      icon={faBoxes}
      value={filters.companyType.id}
      options={companyTypes?.map((type) => ({
        key: type.id,
        value: type.id,
        label: type.companyType,
      }))}
      onChange={(value) => onInputChange("companyType.id", value)}
    />
  </div>
);

const FilterField = ({ id, label, icon, value, onChange, placeholder }) => (
  <div className="filter-group">
    <label htmlFor={id}>
      <FontAwesomeIcon icon={icon} className="filter-icon" />
      {label}
    </label>
    <input
      id={id}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const FilterSelect = ({ id, label, icon, value, onChange, options = [] }) => (
  <div className="filter-group">
    <label htmlFor={id}>
      <FontAwesomeIcon icon={icon} className="filter-icon" />
      {label}
    </label>
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">-- Select --</option>
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const ModalActions = ({ onClear, onClose }) => (
  <div className="modal-actions">
    <button type="button" onClick={onClear} className="clear-filters-btn">
      <FontAwesomeIcon icon={faTimes} />
      Clear All
    </button>
    <div className="action-buttons">
      <button type="button" onClick={onClose} className="cancel-btn">
        Cancel
      </button>
      <button type="submit" className="search-submit-btn">
        <FontAwesomeIcon icon={faSearch} />
        Apply Filters
      </button>
    </div>
  </div>
);

export default SearchModal;
