import api from "./api";
const LICENSE_BASE_URL = "/licenses";
import { extractApiErrorMessage } from "./exception/axiosErrorHandler";

export const UserLicenses = {

  // Get all licenses for a user
  getBySubscription: async (subscriptionId) => {
    try {
      const response = await api.get(
        `${LICENSE_BASE_URL}/${subscriptionId}/search`,
      );

      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },


  getByUser: async (userId) => {
    const response = await api.get(`${API_BASE}`, { params: { userId } });
    return response.data;
  },


  // Assign a new license to a user
  assign: async ({ subscriptionId, userId }) => {
    try {
      const response = await api.post(`${LICENSE_BASE_URL}/assign`, {
        subscriptionId,
        userId,
      });
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  // Revoke a license
  revoke: async (licenseId) => {
    await api.put(`${LICENSE_BASE_URL}/${licenseId}/revoke`);
  },

  // Assign a license to a subscription with a user
  assignToSubscription: async ({ subscriptionId, userId, deviceId }) => {
    const response = await api.post(`${API_BASE}`, {
      subscriptionId,
      userId,
      deviceId,
    });
    return response.data;
  },
};
