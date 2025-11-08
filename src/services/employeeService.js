import api from './api';

const EMPLOYEE_BASE_URL = '/employees';

export const employeeService = {
  // Get all employees
  getAllEmployees: async (page = 0, size = 10) => {
    try {
      const response = await api.get(EMPLOYEE_BASE_URL, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch employees: ${error.response?.data?.message || error.message}`);
    }
  },

  // Create employee
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post(EMPLOYEE_BASE_URL, employeeData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create employee: ${error.response?.data?.message || error.message}`);
    }
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await api.put(`${EMPLOYEE_BASE_URL}/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update employee: ${error.response?.data?.message || error.message}`);
    }
  },

  // Delete employee
  deleteEmployee: async (id) => {
    try {
      await api.delete(`${EMPLOYEE_BASE_URL}/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete employee: ${error.response?.data?.message || error.message}`);
    }
  }
};