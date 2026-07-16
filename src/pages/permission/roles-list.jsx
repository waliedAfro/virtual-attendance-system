// pages/RolesList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Grid,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { UserAccessService } from '../../services/userAccessService';
import RoleCard from '../../component/role-card';
import useApi from '../../hooks/useApi';

const RolesList = () => {

  const navigate = useNavigate();

  const {
    data: roles,
    loading: isLoading,
    error: error,
    execute: refresh,
  } = useApi(UserAccessService.fetchRoles, [], true);

const {
    data: templates,
    loading: temLoading,
    error: temError,
    execute: temRefresh,
  } = useApi(UserAccessService.fetchRoleTemplates, [], true);



  const [deleteError, setDeleteError] = useState(null);

  // For simplicity, we combine templates and custom roles into one list.
  // System templates are represented as read‑only roles.
  // The backend may return templates in the roles list as isCustom=false, or we merge.
  // We'll assume the `/roles` endpoint returns ALL roles (both template‑based and custom).
  // If templates are not included, we could merge them here.
  // We'll just use `roles` from the API.

  const handleEdit = (role) => {
    navigate(`/access/roles/edit/${role.roleId}`);
  };

  const handleDelete = async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this custom role?')) return;
    setDeleteError(null);
    try {
      await UserAccessService.deleteRole(roleId) ;
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete role.');
    }
  };

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;
  if (error) return <Alert severity="error">Failed to load roles.</Alert>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Roles & Permissions</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/access/roles/new')}
        >
          New Custom Role
        </Button>
      </Box>

      {deleteError && (
        <Alert severity="error" onClose={() => setDeleteError(null)} sx={{ mb: 2 }}>
          {deleteError}
        </Alert>
      )}

      <Divider sx={{ mb: 3 }} />

      {roles && roles.length === 0 ? (
        <Alert severity="info">No roles found for this tenant.</Alert>
      ) : (
        <Grid container spacing={2}>
          {roles?.map((role) => (
            <Grid item xs={12} key={role.roleId}>
              <RoleCard
                role={role}
                onEdit={role.isCustom ? handleEdit : undefined}
                onDelete={role.isCustom ? handleDelete : undefined}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RolesList;