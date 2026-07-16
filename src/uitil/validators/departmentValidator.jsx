const ValidateDepartmentData = (data, fields = []) => {
  const errors = {};

  if (fields.includes("departmentName") && !data.departmentName?.trim()) {
    errors.departmentName = "Department name is required";
  }

  if (fields.includes("departmentNameAra") && !data.departmentNameAra?.trim()) {
    errors.departmentNameAra = "Arabic department name is required";
  }

  if (fields.includes("departmentCode") && !data.departmentCode?.trim()) {
    errors.departmentCode = "Department code is required";
  }

  if (
    fields.includes("departmentCode") &&
    data.departmentCode &&
    data.departmentCode.length > 5
  ) {
    errors.departmentCode = "Department code cannot exceed 5 characters";
  }

  if (fields.includes("note") && data.note && data.note.length > 500) {
    errors.note = "Description cannot exceed 500 characters";
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};

export default ValidateDepartmentData;
