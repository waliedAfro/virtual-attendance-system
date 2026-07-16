import api from "./api";
import { extractApiErrorMessage } from "./exception/axiosErrorHandler";
const SHIFT_ASSIGN_BASE_URL = "shifts-assign";

export const ShiftAssignmentService = {
  createShiftAssign: async (payload) => {
    try {
      const response = await api.post(SHIFT_ASSIGN_BASE_URL, payload);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, payload));
    }
  },
  updateShiftAssign: async (id, payload) => {
    try {
      const response = await api.put(
        `${SHIFT_ASSIGN_BASE_URL}/${id}/assign`,
        payload,
      );
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, payload));
    }
  },

  getShiftAssign: async (id) => {
    try {
      const response = await api.get(`${SHIFT_ASSIGN_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, id));
    }
  },

  searchShiftAssign: async (searchRequest, pageable = {}) => {
    try {
      const { page = 0, size = 10, sort = "startDate,desc" } = pageable;

      const response = await api.post(
        `${SHIFT_ASSIGN_BASE_URL}/search?page=${page}&size=${size}&sort=${sort}`,
        searchRequest,
      );

      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error, searchRequest));
    }
  },
};
