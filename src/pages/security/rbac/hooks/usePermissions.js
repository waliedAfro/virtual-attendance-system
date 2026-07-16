import { useContext, useCallback } from 'react';
import { RBACContext } from '../context/RBACContext';
import * as permissionApi from '../api/permissionApi';

export const usePermissions = () => {
  const { state, dispatch } = useContext(RBACContext);

  const fetchPermissions = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const perms = await permissionApi.getPermissions();
      dispatch({ type: 'SET_PERMISSIONS', payload: perms });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  // Additional permission group operations can be added here

  return {
    permissions: state.permissions,
    loading: state.loading,
    error: state.error,
    fetchPermissions,
  };
};