import api from './api';

const DEVICE_BASE_URL = '/devices';  
const DEVICE_COMPANY_SEARCH = '/devices/companies/search';

export const deviceService = {
     // Create new Device
  createDevice: async (deviceData) => {
    try {
      
      const response = await api.post(DEVICE_BASE_URL, deviceData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create Device: ${error.response?.data?.message || error.message}`);
    }
  },

   // Search companies
  searchCompanies: async (criteria , page = 0, size = 10) => {
    try {
        
        
      const response = await api.get(DEVICE_COMPANY_SEARCH, { params: {
        ... criteria, page, size }}
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search companies: ${error.response?.data?.message || error.message}`);
    }
  },

}