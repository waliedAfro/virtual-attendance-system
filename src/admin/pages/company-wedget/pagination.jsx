import "../../../assets/css/admin/pagination.css";
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage + 1 >= totalPages;

  // Generate page numbers to show (with ellipsis for many pages)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        0,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (startPage > 0) {
        pages.unshift("...");
        pages.unshift(0);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing page {currentPage + 1} of {totalPages}
      </div>

      <div className="pagination-controls">
        <button
          className={`pagination-btn pagination-prev ${
            isFirstPage ? "disabled" : ""
          }
          }`}
          onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
          disabled={isFirstPage}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Previous
        </button>

        <div className="pagination-pages">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`pagination-page ${
                page === currentPage ? "active" : ""
              } ${page === "..." ? "ellipsis" : ""}`}
              onClick={() => page !== "..." && onPageChange(page)}
              disabled={page === "..."}
            >
              {page === "..." ? "..." : page + 1}
            </button>
          ))}
        </div>

        <button
          className={`pagination-btn pagination-next ${
            isLastPage ? "disabled" : ""
          }`}
          onClick={() => !isLastPage && onPageChange(currentPage + 1)}
          disabled={isLastPage}
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
export default Pagination;
