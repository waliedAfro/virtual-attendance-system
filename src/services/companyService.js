import api from './api';

const COMPANY_BASE_URL = '/companies';
const COMPANY_SEARCH_URL = '/companies/search';
const COMPANY_SEARCH_PAGABLE_URL = '/companies/searchPagable';
const COMPANY_ADDRESS_UPDATE_URL = "/companies/address";
const COMPANY_CONTACT_UPDATE_URL ="/companies/contact";

export const companyService = {
  // Get all companies with pagination
  getAllCompanies: async ({page = 0, size=0 , sort = 'companyName,asc'}) => {
    try {
      const response = await api.get(COMPANY_SEARCH_PAGABLE_URL, {
        params: { page, size, sort } 
      });
      
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch companies: ${error.response?.data?.message || error.message}`);
    }
  },
// search company
  searchCompanies: async ({
    page = 0,
    size = size,
    sortBy,
    sortDir,
    filters = {},
    searchTerm ,
  }) => {
    try {
      const response = await api.post(COMPANY_SEARCH_URL, {
        page,
        size,
        sortBy,
        sortDir,
        filters,
        searchTerm
      } );
      //console.log(searchCirteria);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch companies: ${error.response?.data?.message || error.message}`);
    }
  },

  // Get company by ID
  getCompanyById: async (id) => {
    try {
      const response = await api.get(`${COMPANY_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch company: ${error.response?.data?.message || error.message}`);
    }
  },

  // Create new company
  createCompany: async (companyData) => {
    try {
      const response = await api.post(COMPANY_BASE_URL, companyData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create company: ${error.response?.data?.message || error.message}`);
    }
  },

  // Update company
  updateCompany: async (id, companyData) => {
    try {
      const response = await api.put(COMPANY_BASE_URL, companyData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update company: ${error.response?.data?.message || error.message}`);
    }
  },

  // Delete company
  deleteCompany: async (id) => {
    try {
      await api.delete(`${COMPANY_BASE_URL}/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete company: ${error.response?.data?.message || error.message}`);
    }
  },

  // Update company ADDRESS
  updateCompanyAddress: async (address) => {
    try {
      const response = await api.put(COMPANY_ADDRESS_UPDATE_URL, address);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update company: ${error.response?.data?.message || error.message}`);
    }
  },

   // Update company CONTACT PERSON
   updateCompanyContact: async (contact) => {
    try {
      const response = await api.put(COMPANY_CONTACT_UPDATE_URL, contact);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update company: ${error.response?.data?.message || error.message}`);
    }
  },

  // Search companies
  /*
  searchCompanies: async (searchTerm, page = 0, size = 10) => {
    try {
      const response = await api.get(`${COMPANY_BASE_URL}/search`, {
        params: { q: searchTerm, page, size }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search companies: ${error.response?.data?.message || error.message}`);
    }
  },*/

  // Get companies by industry
  getCompaniesByIndustry: async (industryName) => {
    try {
      const response = await api.get(`${COMPANY_BASE_URL}/industry/${industryName}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch companies by industry: ${error.response?.data?.message || error.message}`);
    }
  }
};