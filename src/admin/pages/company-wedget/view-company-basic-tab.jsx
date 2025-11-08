import FormInput from "../../../component/form-input";

const ViewCompanyBasicTab = ({ company }) => {
  return (
    <div>
      <div className="form-section">
        <h3 className="form-section-title">Basic Company Information</h3>

        <div className="form-row">
          <FormInput
            label="Company Name (English) "
            name="company"
            value={company?.company ?? ""}
            className="form-group"
            readOnly={true}
          />

          <FormInput
            label="Company Name (Arabic)"
            name="companyArabic"
            value={company?.companyArabic ?? ""}
            className="form-group"
            readOnly={true}
          />
        </div>

        <div className="form-row">
          <FormInput
            className="form-group"
            label="Company Type "
            name="companyType"
            value={company?.companyType.companyType ?? ""}
            readOnly={true}
          />

          <FormInput
            className="form-group"
            label="Ownership Type "
            name="ownershipType"
            value={company?.ownershipType.ownerhipType || ""}
            readOnly={true}
          />
        </div>

        <div className="form-row">
          <FormInput
            className="form-group"
            label="Industry "
            name="industry"
            value={company?.industry.industry || ""}
            readOnly={true}
          />

          <FormInput
            className="form-group"
            label="Number of Employees"
            name="employees"
            type="number"
            value={company?.employees ?? 0}
            readOnly={true}
          />
        </div>

        <div className="form-row">
          <FormInput
            className="form-group"
            label="Email Address"
            name="email"
            type="email"
            value={company?.email ?? ""}
            readOnly={true}
          />

          <FormInput
            label="Phone Number"
            name="phone"
            type="tel"
            value={company?.phone ?? ""}
            className="form-group"
            readOnly={true}
          />
        </div>

        <div className="form-row">
          <FormInput
            label="Website"
            className="form-group"
            type="url"
            name="website"
            value={company?.website ?? ""}
            readOnly={true}
          />
        </div>
      </div>
    </div>
  );
};
export default ViewCompanyBasicTab;
