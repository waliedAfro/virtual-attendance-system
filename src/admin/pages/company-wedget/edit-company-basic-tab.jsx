import FormInput from "../../../component/form-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { CompanyTypeService } from "../../../services/companyTypeService";
import { IndustryService } from "../../../services/industryService";
import { OwnershipTypeService } from "../../../services/ownershipTypeService";
import useApi from "../../../hooks/useApi";
import FormSelect from "../../../component/form-select";
import { useState, useEffect, useCallback } from "react";

const EditCompanyBasicTab = ({ company, handleEditBasicData }) => {
  // Fetch company types
  const [basicTabData, setBasicTabData] = useState(company);

  // Sync prop updates into state
  useEffect(() => {
    setBasicTabData(company);
  }, [company]);

  const { data: companyTypes, loading: companyTypesLoading } = useApi(
    CompanyTypeService.getActiveCompanyTypes,
    [],
    true
  );

  // Fetch industries
  const { data: industries, loading: industriesLoading } = useApi(
    IndustryService.getActiveIndustries,
    [],
    true
  );

  // Fetch ownership types
  const { data: ownershipTypes, loading: ownershipTypesLoading } = useApi(
    OwnershipTypeService.getActiveOwnershipTypes,
    [],
    true
  );

  // --- utility function for deep updates ---
  const updateNestedField = (obj, path, value) => {
    if (!path || typeof path !== "string") return obj;
    const keys = path.split(".");
    const lastKey = keys.pop();
    let deep = { ...obj };

    let pointer = deep;
    for (const key of keys) {
      pointer[key] = { ...pointer[key] }; // clone each level
      pointer = pointer[key];
    }

    pointer[lastKey] = value;
    return deep;
  };
  // --- unified updater ---
  const handleFormDataChange = useCallback((fieldPath, value) => {
    const parsedValue = !isNaN(value) && value !== "" ? Number(value) : value;
    if (JSON.stringify(fieldPath).includes(".")) {
      setBasicTabData((prev) =>
        updateNestedField(prev, fieldPath, parsedValue)
      );
    } else {
      setBasicTabData((prev) => ({
        ...prev,
        [fieldPath]: value,
      }));
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    handleEditBasicData(basicTabData);
  };

  return (
    <div>
      <div className="form-section">
        <h3 className="form-section-title">Basic Company Information</h3>

        <form onSubmit={onSubmit}>
          <div className="form-row">
            <FormInput
              label="Company Name (English) "
              name="company"
              value={basicTabData?.company ?? ""}
              className="form-group"
              onChange={(e) => handleFormDataChange("company", e.target.value)} // 👈 update parent
              required
            />

            <FormInput
              label="Company Name (Arabic)"
              name="companyArabic"
              value={basicTabData?.companyArabic ?? ""}
              className="form-group"
              onChange={(e) => handleFormDataChange("company", e.target.value)} // 👈 update parent
            />
          </div>

          <div className="form-row">
            <FormSelect
              className="form-group"
              label="Company Type "
              name="companyType.id"
              value={basicTabData?.companyType.id ?? ""}
              onChange={(e) =>
                handleFormDataChange("companyType.id", e.target.value)
              } // 👈 update parent
              required
              options={companyTypes?.map((type) => ({
                key: type.id,
                value: type.id,
                label: type.companyType,
              }))}
              disabled={companyTypesLoading || companyTypes.length === 0}
              loading={companyTypesLoading}
            />

            <FormSelect
              className="form-group"
              label="Ownership Type "
              name="ownershipType.id"
              value={basicTabData?.ownershipType.id || ""}
              onChange={(e) =>
                handleFormDataChange("ownershipType.id", e.target.value)
              } // 👈 update parent
              required
              options={ownershipTypes.map((type) => ({
                key: type.id,
                value: type.id,
                label: type.ownerhipType,
              }))}
              disabled={ownershipTypesLoading || ownershipTypes.length === 0}
              loading={ownershipTypesLoading}
            />
          </div>

          <div className="form-row">
            <FormSelect
              className="form-group"
              label="Industry "
              name="industry.id"
              value={basicTabData?.industry.id || ""}
              onChange={(e) =>
                handleFormDataChange("industry.id", e.target.value)
              } // 👈 update parent
              required
              options={industries.map((industry) => ({
                key: industry.id,
                value: industry.id,
                label: industry.industry,
              }))}
              disabled={industriesLoading || industries.length === 0}
              loading={industriesLoading}
            />

            <FormInput
              className="form-group"
              label="Number of Employees"
              name="employees"
              type="number"
              value={basicTabData?.employees ?? 0}
              onChange={(e) =>
                handleFormDataChange("employees", e.target.value)
              } // 👈 update parent
              min="1"
              max="1000000"
            />
          </div>

          <div className="form-row">
            <FormInput
              className="form-group"
              label="Email Address"
              name="email"
              type="email"
              value={basicTabData?.email ?? ""}
              onChange={(e) => handleFormDataChange("email", e.target.value)} // 👈 update parent
            />

            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={basicTabData?.phone ?? ""}
              className="form-group"
              onChange={(e) =>
                handleFormDataChange("emaphoneil", e.target.value)
              } // 👈 update parent
            />
          </div>

          <div className="form-row">
            <FormInput
              label="Website"
              className="form-group"
              name="website"
              value={basicTabData?.website ?? ""}
              onChange={(e) => handleFormDataChange("website", e.target.value)} // 👈 update parent
            />
          </div>

          <button type="submit" className="primary-btn">
            <FontAwesomeIcon icon={faPenToSquare} />
            <span>Update</span>
          </button>
        </form>
      </div>
    </div>
  );
};
export default EditCompanyBasicTab;
