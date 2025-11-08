import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEnvelope,
  faMobileRetro,
  faArrowUp,
  faArrowDown,
  faEdit,
  faTrash,
  faEye,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import ViewCompany from "../view-company";
import "../../../assets/css/admin/view-company.css";
import EditCompany from "../edit-company";

const CompanyTable = ({
  companies,
  handleSort,
  onDeleteCompany,
  currentPage,
}) => {
  const [selectedCompany, setSelectedCompany] = useState({});
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleView = (company) => {
    setSelectedCompany(company);
    setShowViewModal(true);
  };

  const handleCloseView = () => {
    setShowViewModal(false);
    setSelectedCompany(null);
  };

  const handleEdit = (company) => {
    setSelectedCompany(company);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedCompany(null);
  };

  const icons = {
    ascending: faArrowUp,
    descending: faArrowDown,
  };

  const getStatusBadge = (status) => {
    const isActive = status === "Active" || status === true;
    return (
      <span
        className={`status-badge ${
          isActive ? "status-active" : "status-inactive"
        }`}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    );
  };

  const handleDelete = (companyId) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      onDeleteCompany(companyId);
    }
  };

  return (
    <div className="companies-container">
      <table className="companies-table">
        <thead>
          <tr>
            <th> S/N </th>
            <th onClick={() => handleSort("name")}> Name </th>
            <th onClick={() => handleSort("industry")}> Industry </th>
            <th onClick={() => handleSort("employees")}>Employees </th>
            <th onClick={() => handleSort("company_type")}> Type </th>
            <th>Contact</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {companies.map((company, index) => (
            <tr key={company.id}>
              <td>{index + 1 + (currentPage || 0) * 10}</td>
              <td>
                <div className="company-name">{company.company}</div>
                <div className="company-name">{company.companyArabic}</div>
                <div className="ownership-type"> ID : {company.id}</div>
              </td>
              <td>{company.industry.industry}</td>
              <td>{company.employees}</td>
              <td>
                <span className="badge">{company.companyType.companyType}</span>
                <div className="ownership-type">
                  {company.ownershipType.ownerhipType}
                </div>
              </td>

              <td>
                <div className="contact-name">
                  <FontAwesomeIcon icon={faUserTie} /> {company.firstName}{" "}
                  {company.lastName}
                </div>
                <div className="contact-email">
                  <FontAwesomeIcon icon={faEnvelope} /> {company.email}
                </div>
                <div className="contact-phone">
                  <FontAwesomeIcon icon={faMobileRetro} />
                  {company.phone}
                </div>
              </td>

              <td>{getStatusBadge(company.status)}</td>
              <td>
                <div className="action-buttons">
                  <button
                    className="action-btn view-btn"
                    title="View"
                    onClick={() => handleView(company)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    className="action-btn edit-btn"
                    title="Edit"
                    onClick={() => handleEdit(company)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    title="Delete"
                    onClick={() => handleDelete(company)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Company Modal */}
      {showViewModal && (
        <div className="modal-overlay" onClick={handleCloseView}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <ViewCompany
              company={selectedCompany}
              onClose={handleCloseView}
              mode="modal"
            />
          </div>
        </div>
      )}

      {/* Edit  Company Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={handleCloseEdit}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <EditCompany
              company={selectedCompany}
              onClose={handleCloseEdit}
              mode="modal"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default CompanyTable;
