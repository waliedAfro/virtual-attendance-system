import React, { useId } from "react";
import "../assets/css/compenets/form-select.css";
const FormSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  required = false,
  disabled = false,
  loading = false,
  error = "",
  touched = false,
  className = "",
  placeholder = "-- Select --",
  helpText = "",
  size = "medium",
  showClear = false,
  onClear,
  icon,
  optionGroups = null,
  ...props
}) => {
  const id = useId();
  const showError = touched && error;
  const hasOptions =
    options.length > 0 ||
    (optionGroups && Object.keys(optionGroups).length > 0);

  const handleChange = (e) => {
    onChange?.(e);
    // Also support direct value passing for controlled components
    if (props.onValueChange) {
      props.onValueChange(e.target.value);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClear?.();

    // Simulate change event with empty value
    const syntheticEvent = {
      target: {
        name,
        value: "",
      },
    };
    onChange?.(syntheticEvent);
  };

  const renderOptions = () => {
    if (optionGroups) {
      return Object.entries(optionGroups).map(([groupLabel, groupOptions]) => (
        <optgroup key={groupLabel} label={groupLabel}>
          {groupOptions.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              title={opt.title}
            >
              {opt.label}
            </option>
          ))}
        </optgroup>
      ));
    }

    return options.map((opt) => (
      <option
        key={opt.value}
        value={opt.value}
        disabled={opt.disabled}
        title={opt.title}
        data-custom={opt.customData}
      >
        {opt.label}
        {opt.description && ` - ${opt.description}`}
      </option>
    ));
  };

  const selectSizeClass = {
    small: "px-2 py-1 text-sm",
    medium: "px-3 py-2",
    large: "px-4 py-3 text-lg",
  }[size];

  return (
    <div className={`form-select-container ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`block text-sm font-medium mb-1 ${
            disabled ? "text-gray-400" : "text-gray-700"
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <i className={icon} />
          </div>
        )}

        <select
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled || loading}
          className={`
            w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
            ${selectSizeClass}
            ${icon ? "pl-10" : "pl-3"}
            ${
              showError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }
            ${
              disabled
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-900"
            }
            ${loading ? "pr-10" : showClear ? "pr-10" : ""}
          `}
          aria-invalid={showError ? "true" : "false"}
          aria-describedby={
            showError ? `${id}-error` : helpText ? `${id}-help` : undefined
          }
          {...props}
        >
          <option value="" disabled={required}>
            {loading ? "Loading options..." : placeholder}
          </option>
          {hasOptions && renderOptions()}
        </select>

        {(loading || showClear) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            )}
            {showClear && value && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Clear selection"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        )}
      </div>

      {helpText && !showError && (
        <p id={`${id}-help`} className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}

      {showError && (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600 flex items-center"
          role="alert"
        >
          <i className="fas fa-exclamation-circle mr-1"></i>
          {error}
        </p>
      )}

      {!hasOptions && !loading && (
        <p className="mt-1 text-sm text-gray-500">No options available</p>
      )}
    </div>
  );
};

FormSelect.defaultProps = {
  size: "medium",
  placeholder: "-- Select --",
};

export default FormSelect;
