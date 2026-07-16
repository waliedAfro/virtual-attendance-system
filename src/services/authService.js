import api from "./api";
import { extractApiErrorMessage } from "./exception/axiosErrorHandler";
const API_AUTH_URL = "/auth"
export const authService = {
  login: async (data) => {
    try {

      const response = await api.post(`${API_AUTH_URL}/login`, data);
     
     
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(extractApiErrorMessage(error));
    }
  },

  signup: async (data) => {
    try {
      const response = await api.post(`${API_AUTH_URL}/signup`, data);
      
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to create account: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },

  saveToken: (token) => {
    localStorage.setItem("token", token);
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  saveData: (data) => {
    localStorage.setItem("data", JSON.stringify(data));
  },

  getData: () => {
    const savedData = localStorage.getItem("data");
    // نتحقق أولاً من وجود البيانات ثم نحولها لكائن
    return savedData ? JSON.parse(savedData) : null;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("data");
  },

  // Inside authService object
requestPasswordReset: async (email) => {

  console.log(email);

  const response = await api.post(`${API_AUTH_URL}/forgot-password/link`,  {"email" : email });
  console.log(response.data);
  
  return response.data;
},

resetPassword: async (token, newPassword) => {
  const response = await api.post(`${API_AUTH_URL}/reset-password/link`, { 
    token, 
    password: newPassword 
  });
  return response.data;
},


}