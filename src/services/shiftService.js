import api from "./api";
import { extractApiErrorMessage } from "./exception/axiosErrorHandler";
const SHIFT_BASE_URL = "shifts";

export const ShiftService = {
  createShift: async (payload) => {
    try {
      console.log(payload);
      const response = await api.post(SHIFT_BASE_URL, payload);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, payload));
    }
  },

  updateShift: async (shiftId, payload) => {
    try {
      console.log(payload);
      const response = await api.put(
        `${SHIFT_BASE_URL}/${shiftId}/shift`,
        payload,
      );
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, payload));
    }
  },

  searchShifts: async ({ searchTerm, shiftType, page, size }) => {
    try {
      console.log("Searching Shift with params:", {
        params: searchTerm,
        shiftType,
        page,
        size,
      });

      const response = await api.get(`${SHIFT_BASE_URL}/search`, {
        params: {
          searchTerm: searchTerm || "",
          shiftType: shiftType || "",
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

  getShift: async (id) => {
    try {
      const response = await api.get(`${SHIFT_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, payload));
    }
  },

  getSearch: async () => {
    try {
      const response = await api.get(`${SHIFT_BASE_URL}/active`);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, payload));
    }
  },
};
