import api from './api';

const DEPARTMENT_BASE_URL = '/departments';
const DEPARTMENT_DELETE_BASE_URL = '/departments/delete';
const DEPARTMENT_BY_COMAPNY_BASE_URL = '/departments/company'

export const departmentService = {


  // Update  departments
  deleteDepartments: async (departmentData) => {
    try {

      if (!departmentData.id) {
        throw new Error("Department ID is required for update");
      }

      const response = await api.put(DEPARTMENT_DELETE_BASE_URL,
        departmentData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch departments: ${error.response?.data?.message || error.message}`);
    }
  },

  // Update  departments
  updateDepartments: async (departmentData) => {
    try {

      if (!departmentData.id) {
        throw new Error("Department ID is required for update");
      }

      console.log(departmentData.companyId);
      const response = await api.put(`${DEPARTMENT_BASE_URL}/${departmentData.id}`,
        departmentData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch departments: ${error.response?.data?.message || error.message}`);
    }
  },
  
  // GET ALL DEPARTMENTS BY COMPANY 
  getDepartmentsbyComapny: async (companyId) => {
    console.log("companyId ", companyId);
    
    try {
      if(companyId !=null && companyId != undefined)
      {
      const response = await api.get(`${DEPARTMENT_BY_COMAPNY_BASE_URL}/${companyId}` );
      console.log("response ", response.data);
      return response.data;
      } 
      return [] ; 
      
    } catch (error) {
      throw new Error(`Failed to fetch departments: ${error.response?.data?.message || error.message}`);
    }
  },

  // Create department
  createDepartment: async (departmentData) => {
    try {
      const response = await api.post(DEPARTMENT_BASE_URL, departmentData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create department: ${error.response?.data?.message || error.message}`);
    }
  }
};