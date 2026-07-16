import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RBACRoutes from '../modules/security/rbac/routes/rbacRoutes';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  // In a real app, check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/rbac/dashboard" replace />} />
      <Route path="/rbac/*" element={<RBACRoutes />} />
      {/* other routes */}
    </Routes>
  );
};

export default AppRoutes;