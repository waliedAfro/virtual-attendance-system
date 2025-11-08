import api from "./api";

const LOCATION_BASE_URL = '/locations';
const LOCATION_BY_COMAPNY_BASE_URL = '/locations/company/'; 

export const LocationService = {


  // Update  departments
  deleteLocation: async (locationData) => {
    try {

      if (!locationData.id) {
        throw new Error("Location ID is required for update");
      }

      const response = await api.put(`${LOCATION_BASE_URL}/${locationData.id}/disable`,
        locationData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch location: ${error.response?.data?.message || error.message}`);
    }
  },

  // Update  departments
  updateLocation: async (locationData) => {
    try {

      if (!locationData.id) {
        throw new Error("location ID is required for update");
      }

      const response = await api.put(`${LOCATION_BASE_URL}/${locationData.id}`,
        locationData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch location: ${error.response?.data?.message || error.message}`);
    }
  },
  // Get all Locations
  getLocations: async () => {
    try {
      const response = await api.get(LOCATION_BASE_URL);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch location: ${error.response?.data?.message || error.message}`);
    }
  },
  // GET ALL Location BY COMPANY 
  getLocationsByCompany: async (companyId) => {
    try {
      const response = await api.get(`${LOCATION_BY_COMAPNY_BASE_URL}${companyId}` );
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch location: ${error.response?.data?.message || error.message}`);
    }
  },

  // Create Location
  createLocation: async (locationData) => {
    try {
      
      const response = await api.post(LOCATION_BASE_URL, locationData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create location: ${error.response?.data?.message || error.message}`);
    }
  }}