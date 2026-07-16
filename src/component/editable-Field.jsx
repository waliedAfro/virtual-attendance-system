const EditableField = ({
    name,
    label,
    value,
    type = "text",
    options = [],
    required = false,
    className = "",
    onChange,
    placeholder = "",
    disabled = false,
    errors = {},
    rows = 3,
    inputProps = {}

}) => {
    const fieldId = `field-${name}`;
  
    return (
      <div className={`editable-field-wrapper ${className}`}>
        {label && (
          <label className="block mb-2 font-medium" htmlFor={fieldId}>
            {label} {required && <span style={{ color: "red" }}>*</span>}
          </label>
        )}
        
        {type === "select" ? (
          <select
            id={fieldId}
            name={name}
            value={value || ""}
            onChange={onChange}
            className={`form-input ${errors[name] ? 'invalid' : ''}`}
            disabled={disabled}
            {...inputProps}
          >
            <option value="">Select {label}</option>
            {options.map((option, index) => (
              <option key={index} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            id={fieldId}
            name={name}
            value={value || ""}
            onChange={onChange}
            className={`form-textarea ${errors[name] ? 'invalid' : ''}`}
            rows={rows}
            placeholder={placeholder}
            disabled={disabled}
            {...inputProps}
          />
        ) : (
          <input
            type={type}
            id={fieldId}
            name={name}
            value={value || ""}
            onChange={onChange}
            className={`form-input ${errors[name] ? 'invalid' : ''}`}
            placeholder={placeholder}
            disabled={disabled}
            {...inputProps}
          />
        )}
        
        {errors[name] && <div className="field-error">{errors[name]}</div>}
      </div>
    );
};
export default EditableField;
