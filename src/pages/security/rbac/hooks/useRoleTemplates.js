import { useContext, useCallback } from 'react';
import { RBACContext } from '../context/RBACContext';
import * as templateApi from '../api/templateApi';

export const useRoleTemplates = () => {
  const { state, dispatch } = useContext(RBACContext);

  const fetchTemplates = useCallback(async () => {
    try {
      const templates = await templateApi.getTemplates();
      dispatch({ type: 'SET_TEMPLATES', payload: templates });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [dispatch]);

  const createTemplate = useCallback(async (templateData) => {
    try {
      const newTemplate = await templateApi.createTemplate(templateData);
      dispatch({ type: 'SET_TEMPLATES', payload: [...state.templates, newTemplate] });
      return newTemplate;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [dispatch, state.templates]);

  const applyTemplateToRole = useCallback(async (templateId, roleId) => {
    try {
      const updatedRole = await templateApi.applyTemplate(templateId, roleId);
      // Update role in state
      dispatch({ type: 'UPDATE_ROLE', payload: updatedRole });
      return updatedRole;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [dispatch]);

  return {
    templates: state.templates,
    loading: state.loading,
    error: state.error,
    fetchTemplates,
    createTemplate,
    applyTemplateToRole,
  };
};