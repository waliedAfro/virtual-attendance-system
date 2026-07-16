import { useContext, useCallback } from 'react';
import { RBACContext } from '../context/RBACContext';
import * as userRoleApi from '../api/userRoleApi';

export const useUserRoles = () => {
  const { state, dispatch } = useContext(RBACContext);

  const fetchAssignments = useCallback(async () => {
    try {
      const assignments = await userRoleApi.getUserRoleAssignments();
      dispatch({ type: 'SET_USER_ROLE_ASSIGNMENTS', payload: assignments });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [dispatch]);

  const assignRole = useCallback(async (userId, roleId) => {
    try {
      const assignment = await userRoleApi.assignRoleToUser(userId, roleId);
      dispatch({ type: 'SET_USER_ROLE_ASSIGNMENTS', payload: [...state.userRoleAssignments, assignment] });
      return assignment;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [dispatch, state.userRoleAssignments]);

  const removeRole = useCallback(async (userId, roleId) => {
    try {
      await userRoleApi.removeRoleFromUser(userId, roleId);
      dispatch({
        type: 'SET_USER_ROLE_ASSIGNMENTS',
        payload: state.userRoleAssignments.filter(
          (a) => !(a.userId === userId && a.roleId === roleId)
        ),
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [dispatch, state.userRoleAssignments]);

  return {
    assignments: state.userRoleAssignments,
    loading: state.loading,
    error: state.error,
    fetchAssignments,
    assignRole,
    removeRole,
  };
};