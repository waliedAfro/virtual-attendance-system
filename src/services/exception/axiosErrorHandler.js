export const extractApiErrorMessage = (error) => {
    if (!error) return "Unknown error";
  
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Server error"
    );
  };