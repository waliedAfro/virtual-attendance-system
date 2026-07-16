import api from "./api";
import { extractApiErrorMessage } from "./exception/axiosErrorHandler";
const DEPARTMENT_BASE_URL = "departments";

export const DepartmentService = {
  // Create new Device
  createDepartment: async (data) => {
    try {
      const response = await api.post(DEPARTMENT_BASE_URL, data);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  updateDepartment: async (id, data) => {
    try {
      const response = await api.put(`${DEPARTMENT_BASE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  searchDepartment: async ({ searchTerm, active, page, size }) => {
    try {
      console.log("Searching Locations with params:", {
        params: searchTerm,
        active,
        page,
        size,
      });

      const response = await api.get(DEPARTMENT_BASE_URL, {
        params: {
          searchTerm: searchTerm || "",
          active: active ?? true,
          page: page, // Try with zero-based page
          size: size,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  getDepartments: async () => {
    try {
      const response = await api.get(DEPARTMENT_BASE_URL);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  getDepartment: async (id) => {
    try {
      const response = await api.get(`${DEPARTMENT_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },
};
