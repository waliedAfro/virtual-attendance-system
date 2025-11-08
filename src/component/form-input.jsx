import React from "react";

const FormInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
  className = "",
  readOnly = false,
}) => {
  return (
    <div className={className}>
      <label className="block mb-2 font-medium">
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    </div>
  );
};

export default FormInput;
