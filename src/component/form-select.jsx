import React from "react";

const FormSelect = ({
  label,
  name,
  value = null,
  onChange,
  options = [],
  required = false,
  className = "",
  disabled,
  loading = "true",
  placeholder,
  readOnly = false,
}) => {
  return (
    <div className={className}>
      <label>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange} //(e) => onChange(e.target.value)
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select --</option>
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
