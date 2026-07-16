import api from "./api";
import { extractApiErrorMessage } from "./exception/axiosErrorHandler";
const API_REPORT_URL = "report";
const API_HR_REPORT_URL = "hr-attendance";


export const ReportService = {

  searchDailyReport: async (criteria = {}, pageable = {}) => {
    try {
      const cleanPageable = {};
      if (pageable.page !== undefined && pageable.page !== null)
        cleanPageable.page = pageable.page;
      if (pageable.size !== undefined && pageable.size !== null)
        cleanPageable.size = pageable.size;
      if (pageable.sort) cleanPageable.sort = pageable.sort;

      const response = await api.post(
        `${API_REPORT_URL}/dailyAttendReport`,
        criteria,
        { params: cleanPageable },
      );
      return response.data;
    } catch (error) {
      // Check if the server responded with an error body
      if (error.response && error.response.data) {
        // Throw the entire data object (or specifically error.response.data)
        throw error.response.data; 
      }
      // Fallback for network/unexpected errors
      throw { message: "An unexpected error occurred", errorCode: "UNKNOWN" };
    }
  },
  searchDetailAttendanceReport: async (criteria = {}, pageable = {}) => {
    try {
      const cleanPageable = {};
      if (pageable.page !== undefined && pageable.page !== null)
        cleanPageable.page = pageable.page;
      if (pageable.size !== undefined && pageable.size !== null)
        cleanPageable.size = pageable.size;
      if (pageable.sort) cleanPageable.sort = pageable.sort;

      const response = await api.post(
        `${API_REPORT_URL}/detailAttendReport`,
        criteria,
        { params: cleanPageable },
      );
      return response.data;
    } catch (error) {
      // Check if the server responded with an error body
      if (error.response && error.response.data) {
        // Throw the entire data object (or specifically error.response.data)
        throw error.response.data; 
      }
      // Fallback for network/unexpected errors
      throw { message: "An unexpected error occurred", errorCode: "UNKNOWN" };
    }
  },

  searchHRAttendanceReport: async (criteria = {}, pageable = {}) => {
    try {
      const cleanPageable = {};
      if (pageable.page !== undefined && pageable.page !== null)
        cleanPageable.page = pageable.page;
      if (pageable.size !== undefined && pageable.size !== null)
        cleanPageable.size = pageable.size;
      if (pageable.sort) cleanPageable.sort = pageable.sort;

      const response = await api.post(
        `${API_HR_REPORT_URL}/attendance-report`,
        criteria,
        { params: cleanPageable },
      );
      return response.data;
    } catch (error) {
      // Check if the server responded with an error body
      if (error.response && error.response.data) {
        // Throw the entire data object (or specifically error.response.data)
        throw error.response.data; 
      }
      // Fallback for network/unexpected errors
      throw { message: "An unexpected error occurred", errorCode: "UNKNOWN" };
    }
  },

  getHRDashboardMetric: async () => {
    try {
      
      const response = await api.get( `${API_HR_REPORT_URL}/attendance-dash`);
      return response.data;
    } catch (error) {
      
      if (error.response && error.response.data) {
  
        throw error.response.data; 
      }
      // Fallback for network/unexpected errors
      throw { message: "An unexpected error occurred", errorCode: "UNKNOWN" };
    }
  },

  /**
   * Fetch the attendance photo for a given event ID.
   * Returns an object URL (blob URL) that can be used as img src.
   */
  getAttendancePhoto: async (id) => {
    try {
      const response = await api.get(
        `${API_REPORT_URL}/attendance/${id}/photo`,
        {
          responseType: 'blob',      // 👈 essential for binary data
          withCredentials: true,     // if your backend uses cookies/session
        }
      );

      // Axios stores the blob in response.data
      return URL.createObjectURL(response.data);
    } catch (error) {
      // Improved error handling – try to read the error from the blob if available
      let errorMsg = 'Failed to load image.';
      if (error.response) {
        const status = error.response.status;
        // The error response might be plain text or JSON – we can try to read it
        try {
          // If the error is a blob, convert to text
          if (error.response.data instanceof Blob) {
            const text = await error.response.data.text();
            errorMsg = `Server error (${status}): ${text}`;
          } else {
            // If it's already a string/JSON, use it
            errorMsg = `Server error (${status}): ${error.response.data || ''}`;
          }
        } catch {
          errorMsg = `Server error (${status})`;
        }
      } else if (error.request) {
        errorMsg = 'No response from server. Check your network.';
      } else {
        errorMsg = error.message;
      }
      throw new Error(errorMsg);
    }
  },
};
