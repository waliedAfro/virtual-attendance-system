import api from "./api";

const INDUSTRY_BASE_URL = "/industries";

export const IndustryService = {
  // Get all active company types
  getActiveIndustries: async () => {
    try {
      const response = await api.get(INDUSTRY_BASE_URL);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch company types: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },

  // Get Industry by ID (if needed)
  getActiveIndustryById: async (id) => {
    try {
      const response = await api.get(`${INDUSTRY_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch company type: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },
};
