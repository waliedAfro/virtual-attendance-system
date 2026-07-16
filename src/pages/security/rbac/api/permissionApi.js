import api from "../../../../services/api" ;

export const getPermissions = () => api.get('/permissions').then(res => res.data);
export const getPermissionGroups = () => api.get('/permission-groups').then(res => res.data.data);
export const createPermissionGroup = (group) => api.post('/permission-groups', group).then(res => res.data.data);
export const updatePermissionGroup = (id, group) => api.put(`/permission-groups/${id}`, group).then(res => res.data);
export const deletePermissionGroup = (id) => api.delete(`/permission-groups/${id}`).then(res => res.data);