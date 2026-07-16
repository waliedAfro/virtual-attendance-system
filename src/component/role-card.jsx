// components/RoleCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Chip, Box, IconButton, Tooltip } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const RoleCard = ({ role, onEdit, onDelete }) => {
  const isCustom = role.isCustom;
  const displayName = isCustom ? role.customName : role.roleTemplate?.roleName;
  const description = isCustom ? 'Custom role' : role.roleTemplate?.description;

  return (
    <Card variant="outlined" sx={{ width: '100%', mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" component="div">
              {displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
            <Box mt={1}>
              {isCustom ? (
                <Chip label="Custom" color="primary" size="small" />
              ) : (
                <Chip label="System" color="secondary" size="small" />
              )}
              {!isCustom && (
                <Chip label={role.roleTemplate?.roleCode} size="small" variant="outlined" sx={{ ml: 1 }} />
              )}
            </Box>
          </Box>
          {isCustom && (
            <Box>
              <Tooltip title="Edit">
                <IconButton onClick={() => onEdit?.(role)}>
                  <Edit />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => onDelete?.(role.roleId)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
export default RoleCard ;