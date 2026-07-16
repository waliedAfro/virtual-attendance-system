import api from "./api";
import { extractApiErrorMessage } from "./exception/axiosErrorHandler"
const LOCATION_BASE_URL ="locations" ;
export const LocationService = {

      // Create new Device
  createLocation: async (data) => {
    try {
      
      const response = await api.post(LOCATION_BASE_URL, data);
      return response.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
  },

  updateLocation: async (locationId, data) => {
    try {
      
      const response = await api.put(`${LOCATION_BASE_URL}/${locationId}`, data);
      return response.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
  },

  deleteLocation: async ( data) => {
    try {
      
      const response = await api.put(`${LOCATION_BASE_URL}/delete`, data);
      return response.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
  },


  searchLocations: async ({ searchTerm, active, page, size }) => {
    try {
      console.log("Searching Locations with params:", {
        params: searchTerm,
        active,
        page,
        size,
      });

      const response = await api.get(LOCATION_BASE_URL, {
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

  getLocations : async () => {
    try {
      
      const response = await api.get(`${LOCATION_BASE_URL}/locations`);
      return response.data;
    } catch (error) {
        throw new Error(extractApiErrorMessage(error));
    }
  }

}