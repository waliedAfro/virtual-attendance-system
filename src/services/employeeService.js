import api from "./api";
import { extractApiErrorMessage } from "./exception/axiosErrorHandler";
const API_EMPLOYEE_URL = "users";
const  API_ELIGIB_LICENSSE =  "eligible-license-users" ;

export const EmployeeService = {
  
  addEmployee: async (data) => {
    try {
      const response = await api.post(API_EMPLOYEE_URL, data);

      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },
  searchEmployees: async ({ searchTerm, active, page, size }) => {
    try {
      console.log("Searching employees with params:", {
        params: searchTerm,
        active,
        page,
        size,
      });

      const response = await api.get(API_EMPLOYEE_URL, {
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
  searchEligibleEmployee: async ({ searchTerm, page, size }) => {
    try {

      const response = await api.get(`${API_EMPLOYEE_URL}/${API_ELIGIB_LICENSSE}`, {
        params: {
          searchTerm: searchTerm || "",
          page: page, // Try with zero-based page
          size: size,
        },
      });
  
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },
  searchLicensedEmployees: async ({ searchTerm, page, size }) => {
    try {

      const response = await api.get(`${API_EMPLOYEE_URL}/licensed-users`, {
        params: {
          searchTerm: searchTerm || "",
          page: page, // Try with zero-based page
          size: size,
        },
      });
  
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  uploadEmployeePhoto: async (userId, photoFile) => {
    try {
      console.log("Employee ID before upload:", userId); // Check what this prints
      const formData = new FormData();
      formData.append("photo", photoFile); // نفس الاسم في @RequestParam

      const response = await api.post(
        `${API_EMPLOYEE_URL}/${userId}/photo`,
        formData
      );
      console.log(response);
      return response ; 
    } catch (error) {
      console.log(error);

      throw new Error(extractApiErrorMessage(error));
    }
  },
  getUserPhoto: async (userId) => {

    try {
      const response = await api.get(`${API_EMPLOYEE_URL}/${userId}/photo`, {
        responseType: "blob", // IMPORTANT for images/files
      });

      // Create image URL from blob
      const imageUrl = URL.createObjectURL(response.data);

      return imageUrl;
    } catch (error) {
      // throw new Error(extractApiErrorMessage(error));
    }
  },

  getEmployeeById: async (employeeId) => {
    try {
      
       const response = await api.get(`${API_EMPLOYEE_URL}/${employeeId}`);
       console.log(response.data);

      return response.data;

    } catch (error) {
      console.error("Get employee error:", error);
      throw error;
    }
  },

  updateEmployee: async (formData) => {

    console.log(formData);
    
    try {
      const response = await api.put(API_EMPLOYEE_URL, formData);
      return response.data;

    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },
};
