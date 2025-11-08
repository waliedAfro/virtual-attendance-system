import React from "react";
import CompanyTable from "./company-table";
import ErrorMessageOnRetry from "./error-message-retry";
import LoadingSpinner from "./loading-spinner";
import Pagination from "./pagination";

const SearchResults = ({
  companies,
  hasSearch,
  error,
  isLoading,
  currentPage,
  totalPages,
  onRetry,
  onPageChange,
}) => {
  const handleSort = (key) => {
    // Implement sorting logic
    console.log("Sort by:", key);
  };

  return (
    <div className="results-section">
      <h3>
        {hasSearch ? "Search Results" : " All Companies "}({totalPages}
        {" page  "}
        companies found)
      </h3>

      {error ? (
        <ErrorMessageOnRetry message={error} onRetry={onRetry} />
      ) : isLoading ? (
        <LoadingSpinner size={60} color="#e74c3c" />
      ) : (
        <div className="table-container">
          <CompanyTable
            companies={companies}
            handleSort={handleSort}
            currentPage={currentPage}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      )}
    </div>
  );
};
export default SearchResults;
