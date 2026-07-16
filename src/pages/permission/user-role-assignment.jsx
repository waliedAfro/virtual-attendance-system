// pages/UserRoleAssignment.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { UserAccessService } from "../../services/userAccessService";
import useApi from "../../hooks/useApi";


const UserRoleAssignment = () => {
  
  const { userId } = useParams();

  const {
    data: userRoles,
    loading: isLoading,
    error: error,
    execute: refetch,
  } = useApi(UserAccessService.fetchUserRoles(userId), [], true);

  const { data: allRoles } = useApi(UserAccessService.fetchRoles, [], true);

  const [open, setOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [assignError, setAssignError] = useState(null);

  const handleAssign = async () => {
    if (!selectedRoleId) return;
    try {
      UserAccessService.assignRoleToUser(userId, selectedRoleId);
      setOpen(false);
      setSelectedRoleId("");
      refetch();
    } catch (err) {
      setAssignError(err.message);
    }
  };

  const handleRemove = async (userRoleId) => {
    if (!window.confirm("Remove this role from user?")) return;
    try {
      UserAccessService.removeUserRole(userRoleId);
      refetch();
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Failed to load user roles.</Alert>;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        User Roles
      </Typography>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Assign Role
        </Button>
      </Box>

      {userRoles && userRoles.length === 0 ? (
        <Alert severity="info">No roles assigned to this user.</Alert>
      ) : (
        <List>
          {userRoles?.map((ur) => (
            <ListItem
              key={ur.userRoleId}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleRemove(ur.userRoleId)}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText
                primary={
                  ur.role.isCustom
                    ? ur.role.customName
                    : ur.role.roleTemplate?.roleName
                }
                secondary={ur.role.isCustom ? "Custom" : "System"}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Assign Role</DialogTitle>
        <DialogContent>
          {assignError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {assignError}
            </Alert>
          )}
          <FormControl fullWidth margin="dense">
            <InputLabel>Select Role</InputLabel>
            <Select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              label="Select Role"
            >
              {allRoles?.map((role) => (
                <MenuItem key={role.roleId} value={role.roleId}>
                  {role.isCustom
                    ? role.customName
                    : role.roleTemplate?.roleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAssign}>
              Assign
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default UserRoleAssignment;
