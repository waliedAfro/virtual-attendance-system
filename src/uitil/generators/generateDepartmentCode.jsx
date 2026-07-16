const GenerateDepartmentCode = (company) => {
  const prefix = company?.code?.substring(0, 2) || "CO";
  const timestamp = Date.now().toString().slice(-3);
  return `${prefix}${timestamp}`.toUpperCase();
};

export default GenerateDepartmentCode;
