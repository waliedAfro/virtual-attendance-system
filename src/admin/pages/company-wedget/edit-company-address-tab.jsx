import { useState, useEffect, useCallback } from "react";
import FormInput from "../../../component/form-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const EditCompanyAddressTab = ({ addressess, handleEditAddressData }) => {
  const [addressData, setAddressData] = useState(
    Array.isArray(addressess) ? addressess : []
  );

  // Check if we have valid addresses array with items
  const hasAddresses = Array.isArray(addressData) && addressData.length > 0;

  useEffect(() => {
    // Only update if addressess is an array
    if (Array.isArray(addressess)) {
      setAddressData(addressess);
    } else {
      setAddressData([]);
    }
  }, [addressess]);

  if (!hasAddresses) {
    return (
      <div className="form-section">
        <h3 className="form-section-title">Address Information</h3>
        <div className="no-data-message">No address information available.</div>
      </div>
    );
  }

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
      setAddressData((prev) => {
        if (!Array.isArray(prev)) return prev;
        return updateNestedField(prev, fieldPath, parsedValue);
      });
    } else {
      // For non-nested fields (shouldn't happen in this case)
      setAddressData((prev) => ({
        ...prev,
        [fieldPath]: value,
      }));
    }
  }, []);

  const handelEditAddress = (address, index) => {
    // Pass the updated address data to parent
    const updatedAddress = addressData[index];
    if (updatedAddress) {
      handleEditAddressData(updatedAddress);
    }
  };

  return (
    <div className="form-section">
      <h3 className="form-section-title">Address Information</h3>

      {addressData?.map((address, index) => (
        <div key={address.id || index}>
          {addressData.length > 1 && (
            <h4 className="address-title">
              Address {index + 1} {address.isPrimary && "(Primary)"}
            </h4>
          )}

          <form>
            <div className="form-row">
              <FormInput
                label="Address Line 1"
                name={`addressLine1_${index}`}
                value={address.addressLine1 || ""}
                className="form-group"
                onChange={(e) =>
                  handleFormDataChange(`${index}.addressLine1`, e.target.value)
                }
              />

              <FormInput
                label="Address Line 2"
                name={`addressLine2_${index}`}
                value={address.addressLine2 || ""}
                className="form-group"
                onChange={(e) =>
                  handleFormDataChange(`${index}.addressLine2`, e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <FormInput
                label="City"
                name={`city_${index}`}
                value={address.city || ""}
                className="form-group"
                onChange={(e) =>
                  handleFormDataChange(`${index}.city`, e.target.value)
                }
              />

              <FormInput
                label="State/Province"
                name={`state_${index}`}
                value={address.state || ""}
                className="form-group"
                onChange={(e) =>
                  handleFormDataChange(`${index}.state`, e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <FormInput
                className="form-group"
                label="Country"
                name={`country_${index}`}
                value={address.country || ""}
                onChange={(e) =>
                  handleFormDataChange(`${index}.country`, e.target.value)
                }
              />

              <FormInput
                className="form-group"
                label="Postal Code"
                name={`postalCode_${index}`}
                value={address.postalCode || ""}
                onChange={(e) =>
                  handleFormDataChange(`${index}.postalCode`, e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <FormInput
                className="form-group"
                label="Primary Phone"
                name={`phone1_${index}`}
                type="tel"
                value={address.phone1 || ""}
                onChange={(e) =>
                  handleFormDataChange(`${index}.phone1`, e.target.value)
                }
              />

              <FormInput
                label="Secondary Phone"
                name={`phone2_${index}`}
                type="tel"
                value={address.phone2 || ""}
                className="form-group"
                onChange={(e) =>
                  handleFormDataChange(`${index}.phone2`, e.target.value)
                }
              />
            </div>

            <div className="form-row">
              <FormInput
                className="form-group"
                label="Email"
                type="email"
                name={`email_${index}`}
                value={address.email || ""}
                onChange={(e) =>
                  handleFormDataChange(`${index}.email`, e.target.value)
                }
              />
            </div>
            <button
              type="button"
              className="primary-btn"
              onClick={() => handelEditAddress(address, index)}
            >
              <FontAwesomeIcon icon={faPenToSquare} />
              <span>Update</span>
            </button>
          </form>

          {index < addressData.length - 1 && <hr className="address-divider" />}
        </div>
      ))}
    </div>
  );
};

export default EditCompanyAddressTab;
