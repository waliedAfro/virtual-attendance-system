import api from "../../../../services/api" ;

export const getTemplates = () => api.get('/role-templates').then(res => res.data);
export const getTemplate = (id) => api.get(`/role-templates/${id}`).then(res => res.data);
export const createTemplate = (template) => api.post('/role-templates', template).then(res => res.data);
export const updateTemplate = (id, template) => api.put(`/role-templates/${id}`, template).then(res => res.data);
export const deleteTemplate = (id) => api.delete(`/role-templates/${id}`).then(res => res.data);
export const applyTemplate = (id, roleId) =>
  api.post(`/role-templates/${id}/apply`, { roleId }).then(res => res.data);