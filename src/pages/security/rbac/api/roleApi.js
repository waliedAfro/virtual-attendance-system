import api from "../../../../services/api" ;

export const getRoles = () => api.get('/roles').then(res => res.data);
export const getRole = (id) => api.get(`/roles/${id}`).then(res => res.data);
export const createRole = (role) => api.post('/roles', role).then(res => res.data);
export const updateRole = (id, role) => api.put(`/roles/${id}`, role).then(res => res.data);
export const deleteRole = (id) => api.delete(`/roles/${id}`).then(res => res.data);
export const cloneRole = (id) => api.post(`/roles/${id}/clone`).then(res => res.data);
export const updateRolePermissions = (id, permissionIds) =>
  api.put(`/roles/${id}/permissions`, { permissionIds }).then(res => res.data);