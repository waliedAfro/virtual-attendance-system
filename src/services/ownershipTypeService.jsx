import api from "./api";

const OWNERSHIP_TYPE_BASE_URL = "/ownershipes";

export const OwnershipTypeService = {
  // Get all active company types
  getActiveOwnershipTypes: async () => {
    try {
      const response = await api.get(OWNERSHIP_TYPE_BASE_URL);
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
  getActiveOwnershipTypeById: async (id) => {
    try {
      const response = await api.get(`${OWNERSHIP_TYPE_BASE_URL}/${id}`);
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
