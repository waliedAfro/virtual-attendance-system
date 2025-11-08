import api from './api';

const AUTH_BASE_URL = '/auth';

export const authService = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post(`${AUTH_BASE_URL}/login`, credentials);
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw new Error(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};