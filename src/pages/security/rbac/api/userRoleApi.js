import api from "../../../../services/api" ;

export const getUserRoleAssignments = () => api.get('/user-role-assignments').then(res => res.data);
export const assignRoleToUser = (userId, roleId) =>
  api.post('/user-role-assignments', { userId, roleId }).then(res => res.data);
export const removeRoleFromUser = (userId, roleId) =>
  api.delete(`/user-role-assignments/${userId}/${roleId}`).then(res => res.data);