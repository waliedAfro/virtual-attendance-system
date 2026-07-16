// pages/RoleForm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { UserAccessService } from '../../services/userAccessService';
import PermissionSelector from '../../component/permission-selector';
import useApi from '../../hooks/useApi';

const RoleForm = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const isEdit = !!roleId;

  const {
    data: allPermissions,
    loading: permissionsLoading,
    error: permError,
    execute: permRefresh,
  } = useApi(UserAccessService.fetchPermissions, [], true);

  const {
    data: roleData,
    loading: roleLoading,
    error: rolError,
    execute: rolRefresh,
  } = useApi(UserAccessService.fetchRoleById(roleId), [], true);

  const {
    data: rolePerms,
    loading: permsLoading,
    error: pError,
    execute: pfresh,
  } = useApi(UserAccessService.fetchRolePermissions(roleId), [], true);

 
  
 // const createMutation = useCreateRole();
  //const updateMutation = useUpdateRole();

  const [formError, setFormError] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      customName: '',
      permissionIds: [],
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEdit && roleData && rolePerms) {
      reset({
        customName: roleData.customName || '',
        permissionIds: rolePerms.map(rp => rp.permission.permissionId),
      });
    }
  }, [isEdit, roleData, rolePerms, reset]);

  const onSubmit = async (data) => {
    setFormError(null);
    try {
      if (isEdit) {
        await  UserAccessService.updateRole(roleId,{customName: data.customName,permissionIds: data.permissionIds,
        });
      } else {
        await UserAccessService.createRole({customName: data.customName,permissionIds: data.permissionIds,});
      }
      navigate('/access/roles');
    } catch (err) {
      setFormError(err.message || 'Failed to save role.');
    }
  };

  const isLoading = permissionsLoading || (isEdit && (roleLoading || permsLoading));

  if (isLoading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {isEdit ? 'Edit Custom Role' : 'Create Custom Role'}
        </Typography>

        {formError && (
          <Alert severity="error" onClose={() => setFormError(null)} sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="customName"
            control={control}
            rules={{
              required: 'Role name is required',
              maxLength: { value: 50, message: 'Max 50 characters' },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Role Name"
                fullWidth
                margin="normal"
                error={!!errors.customName}
                helperText={errors.customName?.message}
                disabled={isSubmitting}
              />
            )}
          />

          <Controller
            name="permissionIds"
            control={control}
            rules={{
              validate: (value) => value.length > 0 || 'Select at least one permission',
            }}
            render={({ field }) => (
              <PermissionSelector
                permissions={allPermissions || []}
                selectedIds={field.value}
                onChange={field.onChange}
                disabled={isSubmitting}
                error={!!errors.permissionIds}
                helperText={errors.permissionIds?.message}
              />
            )}
          />

          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button variant="outlined" onClick={() => navigate('/access/roles')}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default RoleForm ;