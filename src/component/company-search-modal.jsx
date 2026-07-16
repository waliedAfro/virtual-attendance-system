import SearchInput from "./search-input";

const CompanySearchModal = ({
  closeCompanySearch,
  handleCompanySearchSubmit,
  searchTerm,
  handleCompanySearchChange,
  loading,
  companies,
  handleCompanySelect,
  renderPagination,
}) => {
  return (
    <div>
      {/* Company Search Modal */}

      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3>Select Company</h3>
            <button className="modal-close" onClick={closeCompanySearch}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleCompanySearchSubmit} className="search-form">
              <SearchInput
                placeholder="Search by company name or code..."
                value={searchTerm}
                onChange={handleCompanySearchChange}
                className="search-input"
              />
              <button type="submit" className="btn-search">
                Search
              </button>
            </form>

            {loading ? (
              <div className="loading">Loading companies...</div>
            ) : (
              <>
                <div className="company-list">
                  {companies?.length === 0 ? (
                    <div className="no-results">No companies found</div>
                  ) : (
                    companies?.map((company) => (
                      <div
                        key={company.id}
                        className="company-item"
                        onClick={() => handleCompanySelect(company)}
                      >
                        <div className="company-details">
                          <h4>{company.company}</h4>
                          <p>
                            <strong>Company ID:</strong> {company.id}
                          </p>
                          <p>
                            <strong>Email:</strong> {company.email}
                          </p>
                          {company.phone && (
                            <p>
                              <strong>Phone:</strong> {company.phone}
                            </p>
                          )}
                          <p>
                            <strong>Status:</strong>
                            <span
                              className={`status ${
                                company.status ? "active" : "inactive"
                              }`}
                            >
                              {company.status ? "Active" : "Inactive"}
                            </span>
                          </p>
                        </div>
                        <button className="btn-select">Select</button>
                      </div>
                    ))
                  )}
                </div>

                {renderPagination && renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySearchModal;
