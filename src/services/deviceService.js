
import api from './api';
import { extractApiErrorMessage } from "./exception/axiosErrorHandler"

const DEVICE_BASE_URL = '/devices';  

export const DeviceService = {

     // Create new Device
  createDevice: async (deviceData) => {
    try {
      
      const response = await api.post(DEVICE_BASE_URL, deviceData);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },
  
     // Update  Device
     updateDevice: async (deviceId,deviceData) => {
      try {
      
        const response = await api.put(`${DEVICE_BASE_URL}/${deviceId}`, deviceData);
        return response.data;
      } catch (error) {
        throw new Error(extractApiErrorMessage(error));
      }
    },


  searchDevice: async ({ searchTerm, active, page, size }) => {
    try {
      
      const response = await api.get(`${DEVICE_BASE_URL}/search`, {
        params: {
          searchTerm: searchTerm || "",
          active: active ?? true,
          page: page, // Try with zero-based page
          size: size,
        },
      });
      
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  searchActiveDevice: async () => {
    try {
      
      const response = await api.get(`${DEVICE_BASE_URL}/search/active`);
      
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  generateDeviceToken : async (deviceId) => {
      try {
        
        const response = await api.get(`${DEVICE_BASE_URL}/${deviceId}/generate-token`);
        return response.data;
      } catch (error) {
        throw new Error(extractApiErrorMessage(error));
      }
    },


}