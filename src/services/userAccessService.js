import api from "./api";
import { extractApiErrorMessage } from "./exception/axiosErrorHandler";

const API_BASE = "access";

export const UserAccessService = {
  
  fetchPermissions: async () => {
    try {
      const response = await api.get(`${API_BASE}/permissions`);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  fetchRoleTemplates: async () => {
    try {
      const response = await api.get(`${API_BASE}/role-templates`);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  fetchRoles: async () => {
    try {
      const response = await api.get(`${API_BASE}/roles`);
      console.log(response);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  fetchRoleById: async (roleId) => {
    try {
      const response = await api.get(`${API_BASE}/roles/${roleId}`);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  createRole: async (payload) => {
    try {
      const response = await api.post(`${API_BASE}/roles`, payload);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  updateRole: async (roleId, payload) => {
    try {
      const response = await api.put(`${API_BASE}/roles/${roleId}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  deleteRole: async (roleId) => {
    try {
      const response = await api.delete(`${API_BASE}/roles/${roleId}`);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  fetchRolePermissions: async (roleId) => {
    try {
      const response = await api.get(`${API_BASE}/roles/${roleId}/permissions`);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  updateRolePermissions: async (roleId, permissionIds) => {
    try {
      const response = await api.put(
        `${API_BASE}/roles/${roleId}/permissions`,
        permissionIds,
      );
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  fetchUserRoles: async (userId) => {
    try {
      const response = await api.get(`${API_BASE}/users/${userId}/roles`);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  assignRoleToUser: async (userId, roleId) => {
    try {
      const response = await api.post(
        `${API_BASE}/users/${userId}/roles`,roleId);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  usePermissions: async (userId, roleId) => {
    try {
      const response = await api.post(
        `${API_BASE}/users/${userId}/roles`,roleId);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },

  removeUserRole: async (userRoleId) => {
    try {
      const response = await api.delete(`${API_BASE}/user-roles/${userRoleId}`);
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  },
  
}
