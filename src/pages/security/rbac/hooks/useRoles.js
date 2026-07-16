import { useContext, useCallback } from 'react';
import { RBACContext } from '../context/RBACContext';
import * as roleApi from '../api/roleApi';

export const useRoles = () => {
  const { state, dispatch } = useContext(RBACContext);

  const fetchRoles = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const roles = await roleApi.getRoles();
      dispatch({ type: 'SET_ROLES', payload: roles });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const createRole = useCallback(async (roleData) => {
    try {
      const newRole = await roleApi.createRole(roleData);
      dispatch({ type: 'ADD_ROLE', payload: newRole });
      return newRole;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [dispatch]);

  const updateRole = useCallback(async (id, roleData) => {
    try {
      const updated = await roleApi.updateRole(id, roleData);
      dispatch({ type: 'UPDATE_ROLE', payload: updated });
      return updated;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [dispatch]);

  const deleteRole = useCallback(async (id) => {
    try {
      await roleApi.deleteRole(id);
      dispatch({ type: 'DELETE_ROLE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [dispatch]);

  const cloneRole = useCallback(async (id) => {
    try {
      const cloned = await roleApi.cloneRole(id);
      dispatch({ type: 'ADD_ROLE', payload: cloned });
      return cloned;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [dispatch]);

  const updateRolePermissions = useCallback(async (id, permissionIds) => {
    try {
      const updated = await roleApi.updateRolePermissions(id, permissionIds);
      dispatch({ type: 'UPDATE_ROLE', payload: updated });
      return updated;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [dispatch]);

  return {
    roles: state.roles,
    loading: state.loading,
    error: state.error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    cloneRole,
    updateRolePermissions,
  };
};