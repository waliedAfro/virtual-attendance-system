import { useState, useEffect, useCallback } from "react";
import FormInput from "../../../component/form-input";
import FormTextarea from "../../../component/form-textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const EditCompanyContactPersonTab = ({ contacts, handleEditContact }) => {
  const [contactData, setContactData] = useState(
    Array.isArray(contacts) ? contacts : []
  );

  const hasContacts = Array.isArray(contacts) && contacts.length > 0;

  if (!hasContacts) {
    return (
      <div className="form-section">
        <h3 className="form-section-title">Contact Person Information</h3>
        <div className="no-data-message">No Contact information available.</div>
      </div>
    );
  }

  useEffect(() => {
    setContactData(contacts);
  }, [contacts]);

  // --- utility function for deep updates ---
  const updateNestedField = (obj, path, value) => {
    if (!path || typeof path !== "string") return obj;
    const keys = path.split(".");
    const lastKey = keys.pop();

    // Create a deep copy of the array
    const deep = [...obj];
    let pointer = deep;

    // Navigate to the correct object in the array
    for (const key of keys) {
      const arrayIndex = parseInt(key, 10);
      if (isNaN(arrayIndex) || arrayIndex < 0 || arrayIndex >= deep.length) {
        return obj; // Invalid index, return original
      }
      pointer[arrayIndex] = { ...pointer[arrayIndex] }; // clone the object at this index
      pointer = pointer[arrayIndex];
    }

    pointer[lastKey] = value;
    return deep;
  };

  // --- unified updater ---
  const handleFormDataChange = useCallback((fieldPath, value) => {
    const parsedValue = !isNaN(value) && value !== "" ? Number(value) : value;

    if (fieldPath.includes(".")) {
      setContactData((prev) => {
        if (!Array.isArray(prev)) return prev;
        return updateNestedField(prev, fieldPath, parsedValue);
      });
    } else {
      // For non-nested fields (shouldn't happen in this case)
      setContactData((prev) => ({
        ...prev,
        [fieldPath]: value,
      }));
    }
  }, []);

  const handelEdit = (contact, index) => {
    // Pass the updated address data to parent
    const updatedContact = contactData[index];
    if (updatedContact) {
      handleEditContact(updatedContact);
    }
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">Contact Person Information</h3>

      {contactData.map((contact, index) => (
        <div key={contact.id || index}>
          {contacts.length > 1 && (
            <h4 className="address-title">
              contact {index + 1} {contact.isPrimary && "(Primary)"}
            </h4>
          )}

          <form>
            <button
              type="button"
              className="primary-btn"
              onClick={() => handelEdit(contact, index)}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
              <span>Update</span>
            </button>

            <div className="form-row">
              <FormInput
                className="form-group"
                label="Title"
                name={`title_${index}`}
                value={contact.title || ""}
                onChange={(e) =>
                  handleFormDataChange(`${index}.title`, e.target.value)
                }
              />

              <FormInput
                className="form-group"
                label="Contact Person Name"
                name={`contactPersonName_${index}`}
                value={contact.contactPersonName || ""}
                onChange={(e) =>
                  handleFormDataChange(
                    `${index}.contactPersonName`,
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-row">
              <FormInput
                className="form-group"
                label="Position "
                name={`"position"_${index}`}
                value={contact.position || ""}
                onChange={(e) =>
                  handleFormDataChange(`${index}.position`, e.target.value)
                }
              />

              <FormInput
                className="form-group"
                label="Email"
                type="email"
                name={`"email"_${index}`}
                value={contact.email || ""}
                onChange={(e) =>
                  handleFormDataChange(`${index}.email`, e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <FormInput
                className="form-group"
                label="Phone"
                type="tel"
                name={`"phone"_${index}`}
                value={contact.phone || ""}
                onChange={(e) =>
                  handleFormDataChange(`${index}.phone`, e.target.value)
                }
              />

              <FormInput
                className="form-group"
                label="Mobile"
                type="tel"
                name={`"mobile"_${index}`}
                value={contact.mobile || ""}
                onChange={(e) =>
                  handleFormDataChange(`${index}.mobile`, e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <FormTextarea
                className="form-group"
                label="Additional Notes"
                name={`"note"_${index}`}
                value={contact.note || ""}
                rows="3"
                onChange={(e) =>
                  handleFormDataChange(`${index}.note`, e.target.value)
                }
              />
            </div>
          </form>
          {index < contact.length - 1 && <hr className="address-divider" />}
        </div>
      ))}
    </div>
  );
};
export default EditCompanyContactPersonTab;
