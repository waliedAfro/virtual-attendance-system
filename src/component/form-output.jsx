import React from "react";

const FormOutput = ({ label, value, required = false, className = "" }) => {
  return (
    <div className={className}>
      <label className="block mb-2 font-medium">
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </label>
      <output className="block p-2 border rounded bg-gray-50">{value}</output>
    </div>
  );
};

export default FormOutput;
