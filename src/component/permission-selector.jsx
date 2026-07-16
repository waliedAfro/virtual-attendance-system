// components/PermissionSelector.jsx
import React from 'react';
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';

const PermissionSelector = ({
  permissions,
  selectedIds,
  onChange,
  disabled = false,
  error = false,
  helperText,
}) => {
  const handleToggle = (permId) => {
    const newSelected = selectedIds.includes(permId)
      ? selectedIds.filter(id => id !== permId)
      : [...selectedIds, permId];
    onChange(newSelected);
  };

  // Group by resourceName
  const grouped = permissions.reduce((acc, perm) => {
    const key = perm.resourceName || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(perm);
    return acc;
  }, {});

  return (
    <FormControl error={error} component="fieldset" fullWidth>
      <InputLabel shrink focused={false} sx={{ position: 'relative', mb: 1 }}>
        Permissions
      </InputLabel>
      <Box sx={{ maxHeight: 400, overflow: 'auto', border: '1px solid #ddd', p: 2, borderRadius: 1 }}>
        {Object.entries(grouped).map(([resource, perms]) => (
          <Box key={resource} sx={{ mb: 2 }}>
            <strong style={{ display: 'block', marginBottom: 8 }}>{resource}</strong>
            <FormGroup row>
              {perms.map(perm => (
                <FormControlLabel
                  key={perm.permissionId}
                  control={
                    <Checkbox
                      checked={selectedIds.includes(perm.permissionId)}
                      onChange={() => handleToggle(perm.permissionId)}
                      disabled={disabled}
                    />
                  }
                  label={`${perm.permissionName} (${perm.permissionCode})`}
                  sx={{ width: '33%' }}
                />
              ))}
            </FormGroup>
          </Box>
        ))}
      </Box>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default PermissionSelector;