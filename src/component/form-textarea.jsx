import React from "react";

const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder = "",
  className = "",
  rows = "1",
  readOnly = false,
}) => {
  return (
    <div className={className}>
      <label className="block mb-2 font-medium">
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        readOnly={readOnly}
      />
    </div>
  );
};

export default FormTextarea;
