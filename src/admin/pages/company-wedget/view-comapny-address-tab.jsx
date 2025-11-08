import FormInput from "../../../component/form-input";
const ViewCompanyAddress = ({ addressess }) => {
  const hasAddresses = addressess && addressess.length > 0;

  if (!hasAddresses) {
    return (
      <div className="form-section">
        <h3 className="form-section-title">Address Information</h3>
        <div className="no-data-message">No address information available.</div>
      </div>
    );
  }

  return (
    <div className="form-section">
      <h3 className="form-section-title">Address Information</h3>

      {addressess.map((address, index) => (
        <div key={address.id || index}>
          {addressess.length > 1 && (
            <h4 className="address-title">
              Address {index + 1} {address.isPrimary && "(Primary)"}
            </h4>
          )}

          <div className="form-row">
            <FormInput
              label="Address Line 1"
              name={`addressLine1_${index}`}
              value={address.addressLine1 || ""}
              className="form-group"
              readOnly={true}
            />
          </div>

          <div className="form-row">
            <FormInput
              label="Address Line 2"
              name={`addressLine2_${index}`}
              value={address.addressLine2 || ""}
              className="form-group"
              readOnly={true}
            />
          </div>

          <div className="form-row">
            <FormInput
              label="City"
              name={`city_${index}`}
              value={address.city || ""}
              className="form-group"
              readOnly={true}
            />

            <FormInput
              label="State/Province"
              name={`state_${index}`}
              value={address.state || ""}
              className="form-group"
              readOnly={true}
            />
          </div>

          <div className="form-row">
            <FormInput
              className="form-group"
              label="Country"
              name={`country_${index}`}
              value={address.country || ""}
              readOnly={true}
            />

            <FormInput
              className="form-group"
              label="Postal Code"
              name={`postalCode_${index}`}
              value={address.postalCode || ""}
              readOnly={true}
            />
          </div>

          <div className="form-row">
            <FormInput
              className="form-group"
              label="Primary Phone"
              name={`phone1_${index}`}
              type="tel"
              value={address.phone1 || ""}
              readOnly={true}
            />

            <FormInput
              label="Secondary Phone"
              name={`phone2_${index}`}
              type="tel"
              value={address.phone2 || ""}
              className="form-group"
              readOnly={true}
            />
          </div>

          <div className="form-row">
            <FormInput
              className="form-group"
              label="Email"
              type="email"
              name={`email_${index}`}
              value={address.email || ""}
              readOnly={true}
            />
          </div>

          {index < addressess.length - 1 && <hr className="address-divider" />}
        </div>
      ))}
    </div>
  );
};
export default ViewCompanyAddress;
