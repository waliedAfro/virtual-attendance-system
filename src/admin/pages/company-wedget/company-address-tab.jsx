import React, { useState } from "react";
import FormInput from "../../../component/form-input";
import "../../../assets/css/admin/company-management.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faTimes,
  faArrowUp,
  faArrowDown,
  faEdit,
  faTrash,
  faEye,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

// Add Company Address Tab
const CompanyAddressTab = ({
  formData,
  addAddress,
  onSubmit,
  loading: formLoading,
}) => {
  const icons = { ascending: faArrowUp, descending: faArrowDown };
  const [addressData, setAddressData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone1: "",
    phone2: "",
    email: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData({
      ...addressData,
      [name]: value,
    });
  };

  // ✅ add address to parent formData
  const handleAddAddress = () => {
    if (!addressData.address || !addressData.city) {
      alert("Please fill address and city before adding.");
      return;
    }

    addAddress(addressData); // call parent handler
    setAddressData({
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      phone1: "",
      phone2: "",
      email: "",
    });
    setShowModal(false);
    alert("Address added successfully!");
  };

  // ✅ delete placeholder
  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const updated = formData.addresses.filter((_, i) => i !== index);
      onSubmit({ ...formData, addresses: updated }); // optional if parent handles formData
    }
  };

  return (
    <div className="tab-content">
      <div className="search-section">
        <div className="search-header">
          <h3>Company Address</h3>
          <button
            type="button"
            className="add-tab-btn"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Company Address
          </button>
        </div>
      </div>

      {/* Device List */}
      <div className="tab-list-section">
        {formData.addresses.length > 0 ? (
          <div className="tab-table-container">
            <table className="tab-table" name="addresses">
              <thead>
                <tr>
                  <th>Address </th>
                  <th>Country </th>
                  <th>Postal Code </th>
                  <th> Contact </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.addresses.map((address, index) => (
                  <tr key={index}>
                    <td>
                      <div className="common-col">{address.address}</div>
                      <div className="common-col">{address.city}</div>
                      <div className="common-col">{address.state}</div>
                    </td>

                    <td>{address.country}</td>
                    <td>{address.postalCode}</td>

                    <td>
                      <div className="contact-col">{address.phone1}</div>
                      <div className="contact-col">{address.phone2}</div>
                      <div className="contact-col">{address.email}</div>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view-btn" title="View">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button className="action-btn edit-btn" title="Edit">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          title="Delete"
                          onClick={() => handleDelete()}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No addresses added yet.</p>
        )}
      </div>

      {/* Add Device Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add Company Address</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowModal(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="form-row">
              <FormInput
                label="Address "
                name="address"
                value={addressData.address ?? ""}
                onChange={handleInputChange}
                placeholder="Enter Address"
                className="form-group"
              />
            </div>
            <div className="form-row">
              <FormInput
                label="City "
                name="city"
                value={addressData.city ?? ""}
                onChange={handleInputChange}
                placeholder="Enter City"
                className="form-group"
              />

              <FormInput
                label="State/Province"
                name="state"
                value={addressData.state ?? ""}
                onChange={handleInputChange}
                placeholder="Enter State/Province"
                className="form-group"
              />
            </div>

            <div className="form-row">
              <FormInput
                className="form-group"
                label="Country"
                name="country"
                value={addressData.country ?? ""}
                onChange={handleInputChange}
              />

              <FormInput
                className="form-group"
                label="Postal Code"
                name="postalCode"
                value={addressData.postalCode ?? ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <FormInput
                className="form-group"
                label="Primary Phone"
                name="phone1"
                type="tel"
                value={addressData.phone1 ?? ""}
                onChange={handleInputChange}
              />

              <FormInput
                label="Secondary Phone"
                name="phone2"
                type="tel"
                value={addressData.phone2 ?? ""}
                onChange={handleInputChange}
                className="form-group"
              />
            </div>

            <div className="form-row">
              <FormInput
                className="form-group"
                label="Email"
                type="email"
                name="email"
                value={addressData.email ?? ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="submit-btn"
                onClick={handleAddAddress} // ✅ FIXED: removed "() =>" wrapper
              >
                Add Company Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CompanyAddressTab;
