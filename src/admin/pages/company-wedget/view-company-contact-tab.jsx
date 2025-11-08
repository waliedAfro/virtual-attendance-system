import FormInput from "../../../component/form-input";
import FormTextarea from "../../../component/form-textarea";
const ViewCompanyContactTab = ({ contacts }) => {
  const hasContacts = contacts && contacts.length > 0;

  if (!hasContacts) {
    return (
      <div className="form-section">
        <h3 className="form-section-title">Contact Person Information</h3>
        <div className="no-data-message">No Contact information available.</div>
      </div>
    );
  }

  return (
    <div className="form-section">
      <h3 className="form-section-title">Contact Person Information</h3>

      {contacts.map((contact, index) => (
        <div key={contact.id || index}>
          {contacts.length > 1 && (
            <h4 className="address-title">
              contact {index + 1} {contact.isPrimary && "(Primary)"}
            </h4>
          )}

          <div className="form-row">
            <FormInput
              className="form-group"
              label="Title"
              name={`title${index}`}
              value={contact.title || ""}
              readOnly={true}
            />

            <FormInput
              className="form-group"
              label="Contact Person Name"
              name={`contactPersonName${index}`}
              value={contact.contactPersonName || ""}
              readOnly={true}
            />
          </div>

          <div className="form-row">
            <FormInput
              className="form-group"
              label="Position "
              name={`"position"${index}`}
              value={contact.position || ""}
              readOnly={true}
            />

            <FormInput
              className="form-group"
              label="Email"
              type="email"
              name={`"email"${index}`}
              value={contact.email || ""}
              readOnly={true}
            />
          </div>

          <div className="form-row">
            <FormInput
              className="form-group"
              label="Phone"
              type="tel"
              name={`"phone"${index}`}
              value={contact.phone || ""}
              readOnly={true}
            />

            <FormInput
              className="form-group"
              label="Mobile"
              type="tel"
              name={`"mobile"${index}`}
              value={contact.mobile || ""}
              readOnly={true}
            />
          </div>

          <div className="form-row">
            <FormTextarea
              className="form-group"
              label="Additional Notes"
              name={`"note"${index}`}
              value={contact.note || ""}
              rows="3"
              readOnly={true}
            />
          </div>
          {index < contact.length - 1 && <hr className="address-divider" />}
        </div>
      ))}
    </div>
  );
};
export default ViewCompanyContactTab;
