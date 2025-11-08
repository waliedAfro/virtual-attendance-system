import api from "./api";

const COMPANY_TYPE_BASE_URL = "/company-types";

export const CompanyTypeService = {
  // Get all active company types
  getActiveCompanyTypes: async () => {
    try {
      const response = await api.get(COMPANY_TYPE_BASE_URL);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch company types: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },

  // Get company type by ID (if needed)
  getCompanyTypeById: async (id) => {
    try {
      const response = await api.get(`${COMPANY_TYPE_BASE_URL}/${id}`);
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
