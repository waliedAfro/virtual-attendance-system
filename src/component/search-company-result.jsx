const SearchCompanyResult = ({
  selectedCompany,
  setSelectedCompany,
  setDeviceForm,
  openCompanySearch,
}) => {
  return (
    <div>
      {/* Company Selection */}
      <div className="company-result">
        <h4>Company</h4>
        {selectedCompany ? (
          <div className="selected-company">
            <div className="company-info">
              <p>
                <strong>Name:</strong> {selectedCompany.company}
              </p>
              <p>
                <strong>Company Id:</strong> {selectedCompany.id}
              </p>
              <p>
                <strong>Email:</strong> {selectedCompany.email}
              </p>
              {selectedCompany.phone && (
                <p>
                  <strong>Phone:</strong> {selectedCompany.phone}
                </p>
              )}
            </div>
            <button
              type="button"
              className="btn-change"
              onClick={() => {
                setSelectedCompany(null);
              }}
            >
              Change Company
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn-select-company"
            onClick={openCompanySearch}
          >
            Select Company
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchCompanyResult;
