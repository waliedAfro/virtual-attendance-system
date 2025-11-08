import FormInput from "../../../component/form-input";
import "../../../assets/css/admin/company-management.css";
import FormTextarea from "../../../component/form-textarea";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTimes,
  faEdit,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

// Add Company Form Component
const CompanyContactPersonTab = ({ formData, addContactPerson, loading }) => {
  const [contactData, setContactData] = useState({
    contactPersonName: "",
    title: "",
    position: "",
    email: "",
    phone: "",
    note: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactData({
      ...contactData,
      [name]: value,
    });
  };

  // ✅ add Contact Person to parent formData
  const handleAddContactPerson = () => {
    if (!contactData.contactPersonName || !contactData.phone) {
      alert("Please fill Full Name and Phone before adding.");
      return;
    }

    addContactPerson(contactData); // call parent handler
    setContactData({
      contactPersonName: "",
      title: "",
      position: "",
      email: "",
      phone: "",
      note: "",
    });
    setShowModal(false);
    // alert("Address added successfully!");
  };

  return (
    <div className="tab-content">
      <div className="search-section">
        <div className="search-header">
          <h3>Company Contact Person</h3>
          <button
            type="button"
            className="add-tab-btn"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Contact Person
          </button>
        </div>
      </div>

      {/* Device List */}
      <div className="tab-list-section">
        {formData.contacts.length > 0 ? (
          <div className="tab-table-container">
            <table className="tab-table">
              <thead>
                <tr>
                  <th> Full Name </th>
                  <th>email </th>
                  <th>Contact </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formData.contacts.map((contactPerson, index) => (
                  <tr key={index}>
                    <td>
                      <div className="common-col">{contactPerson.title}</div>
                      <div className="common-col">
                        {contactPerson.contactPersonName}
                      </div>
                      <div className="common-col">{contactPerson.position}</div>
                    </td>

                    <td>{contactPerson.email}</td>

                    <td>
                      <div className="contact-col">{contactPerson.mobile}</div>
                      <div className="contact-col">{contactPerson.phone}</div>
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
          <p>No Contact Person added yet.</p>
        )}
      </div>

      {/* Add Contact Person  Modal */}
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
                className="form-group"
                label="Title"
                name="title"
                value={contactData.title || ""}
                onChange={handleInputChange}
                placeholder="e.g., Mr , Ms , "
              />

              <FormInput
                className="form-group"
                label="Contact Person Name"
                name="contactPersonName"
                value={contactData.contactPersonName || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <FormInput
                className="form-group"
                label="Position "
                name="position"
                value={contactData.position || ""}
                onChange={handleInputChange}
                placeholder="e.g., Manager, Director"
              />

              <FormInput
                className="form-group"
                label="Email"
                type="email"
                name="email"
                value={contactData.email || ""}
                onChange={handleInputChange}
                placeholder="customer@xyz.com"
              />
            </div>

            <div className="form-row">
              <FormInput
                className="form-group"
                label="Phone"
                type="tel"
                name="phone"
                value={contactData.phone || ""}
                onChange={handleInputChange}
              />

              <FormInput
                className="form-group"
                label="Mobile"
                type="tel"
                name="mobile"
                value={contactData.mobile || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <FormTextarea
                className="form-group"
                label="Additional Notes"
                name=".note"
                value={contactData.note || ""}
                onChange={handleInputChange}
                rows="3"
                placeholder="Any additional information about the contact person..."
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
                onClick={handleAddContactPerson} // ✅ FIXED: removed "() =>" wrapper
              >
                Add Contact Person
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CompanyContactPersonTab;
