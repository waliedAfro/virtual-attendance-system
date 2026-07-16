import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RBACDashboard from '../pages/RBACDashboard';
import RolesPage from '../pages/RolesPage';
import RoleDetailsPage from '../pages/RoleDetailsPage';
import RoleTemplatesPage from '../pages/RoleTemplatesPage';
import PermissionsPage from '../pages/PermissionsPage';
import PermissionGroupsPage from '../pages/PermissionGroupsPage';
import UserRoleAssignmentPage from '../pages/UserRoleAssignmentPage';

const RBACRoutes = () => {
  return (
    <Routes>
      <Route index element={<RBACDashboard />} />
      <Route path="dashboard" element={<RBACDashboard />} />
      <Route path="roles" element={<RolesPage />} />
      <Route path="roles/:id" element={<RoleDetailsPage />} />
      <Route path="templates" element={<RoleTemplatesPage />} />
      <Route path="permissions" element={<PermissionsPage />} />
      <Route path="permission-groups" element={<PermissionGroupsPage />} />
      <Route path="user-assignments" element={<UserRoleAssignmentPage />} />
    </Routes>
  );
};

export default RBACRoutes;