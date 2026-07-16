const ReadOnlyField = ({
    label,
    value, 
    icon = null,
    copyable = false ,
    className}) => {

    return (
    <div className={className}>
      <label >
        {icon && <FontAwesomeIcon icon={icon} />}
        {label}
      </label>
      <div className="field-value">
        <span>{value || "N/A"}</span>
        {copyable && value && (
          <button
            className="copy-btn"
            onClick={() => handleCopy(value)}
            title="Copy to clipboard"
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
        )}
      </div>
    </div>
  )}; 
  
  export default ReadOnlyField ;