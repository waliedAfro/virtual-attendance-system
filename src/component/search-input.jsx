import React from "react";

const SearchInput = ({
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
    <input
      className={className}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  );
};

export default SearchInput;
