import React, { createContext, useReducer, useEffect } from 'react';
import rbacReducer, { initialState } from './rbacReducer';
import * as roleApi from '../api/roleApi';
import * as permissionApi from '../api/permissionApi';
import * as templateApi from '../api/templateApi';

export const RBACContext = createContext();

export const RBACProvider = ({ children }) => {
  const [state, dispatch] = useReducer(rbacReducer, initialState);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [roles, permissions, templates] = await Promise.all([
          roleApi.getRoles(),
          permissionApi.getPermissions(),
          templateApi.getTemplates(),
        ]);
        dispatch({ type: 'SET_ROLES', payload: roles });
        dispatch({ type: 'SET_PERMISSIONS', payload: permissions });
        dispatch({ type: 'SET_TEMPLATES', payload: templates });
      } catch (error) {
        console.error('Failed to load RBAC data', error);
      }
    };
    loadData();
  }, []);

  const value = { state, dispatch };

  //return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
};