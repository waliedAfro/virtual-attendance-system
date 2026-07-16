// pages/UserAccessManagement.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
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
  Chip,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import { UserAccessService } from "../../services/userAccessService";
import useApi from "../../hooks/useApi";
import { EmployeeService } from "../../services/employeeService";
import Pagination from "../../component/generic-pagination";

const UserAccessManagement = () => {
  // ---- State for user selection (modal) ----
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState(null);

  // ---- Selected user (displayed) ----
  const [selectedUser, setSelectedUser] = useState(null); // { userId, fullName, ... }
  const [selectedUserId, setSelectedUserId] = useState(null);

  // ---- Role assignment ----
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [assignError, setAssignError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

  // ---- Fetch all roles (using custom useApi hook) ----
  const { data: allRoles, loading: rolesLoading } = useApi(
    UserAccessService.fetchRoles,
    [],
    true
  );

  // ---- Fetch user roles ----
  const [userRoles, setUserRoles] = useState([]);
  const [userRolesLoading, setUserRolesLoading] = useState(false);
  const [userRolesError, setUserRolesError] = useState(null);

  const fetchUserRoles = useCallback(async (userId) => {
    if (!userId) return;
    setUserRolesLoading(true);
    setUserRolesError(null);
    try {
      const response = await UserAccessService.fetchUserRoles(userId);
      setUserRoles(response.data || []);
    } catch (err) {
      setUserRolesError(err.message || "Failed to fetch user roles.");
    } finally {
      setUserRolesLoading(false);
    }
  }, []);

  // Refresh roles when selectedUserId changes
  useEffect(() => {
    if (selectedUserId) {
      fetchUserRoles(selectedUserId);
    } else {
      setUserRoles([]);
    }
  }, [selectedUserId, fetchUserRoles]);

  // ---- Load users for modal (pagination) ----
  const loadUsers = useCallback(
    async (page = 0, term = "") => {
      setLoadingUsers(true);
      setUsersError(null);
      try {
        const response = await EmployeeService.searchEligibleEmployee({
          searchTerm: term,
          page,
          size: pageSize,
        });
        if (response.success) {
          const pageData = response.data;
          setSearchResults(pageData.content || []);
          setTotalElements(pageData.totalElements || 0);
          setTotalPages(pageData.totalPages || 0);
          setCurrentPage(pageData.number ?? 0);
        } else {
          setSearchResults([]);
          setTotalElements(0);
          setTotalPages(0);
          setCurrentPage(0);
        }
      } catch (err) {
        setUsersError("Failed to load employees.");
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    },
    [pageSize]
  );

  // Debounced search
  useEffect(() => {
    if (isUserModalOpen) {
      const timer = setTimeout(() => {
        loadUsers(0, searchTerm);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, isUserModalOpen, loadUsers]);

  // Open modal and load first page
  const openUserModal = () => {
    setIsUserModalOpen(true);
    setSearchTerm("");
    loadUsers(0, "");
  };

  // Select a user from modal
  const handleSelectUser = (user) => {
    setSelectedUser({
      userId: user.userId,
      fullName: `${user.firstName} ${user.lastName}`,
      fullNameAr: `${user.firstNameAr} ${user.lastNameAr}`,
      email: user.email,
      code: user.userCode,
      mobile: user.mobile,
      employeeNo: user.employeeNo,
      employeeStatus: user.active ? "Active" : "Inactive",
    });
    setSelectedUserId(user.userId);
    setIsUserModalOpen(false);
  };

  // ---- Handlers for role assignment ----
  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRoleId) return;
    setAssignError(null);
    try {
      await UserAccessService.assignRoleToUser(selectedUserId, selectedRoleId);
      // Refresh roles
      await fetchUserRoles(selectedUserId);
      setOpenAssignDialog(false);
      setSelectedRoleId("");
      setActionMessage({
        type: "success",
        text: "Role assigned successfully.",
      });
    } catch (err) {
      setAssignError(err.message || "Failed to assign role.");
    }
  };

  const handleRemoveRole = async (userRoleId) => {
    if (!window.confirm("Remove this role from the user?")) return;
    try {
      await UserAccessService.removeUserRole(userRoleId);
      await fetchUserRoles(selectedUserId);
      setActionMessage({ type: "success", text: "Role removed successfully." });
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err.message || "Failed to remove role.",
      });
    }
  };

  // ---- Pagination handler for user modal ----
  const handlePageChange = (newPage) => {
    // Pagination component expects 1‑based, convert
    loadUsers(newPage - 1, searchTerm);
  };

  // ---- Compute aggregated permissions ----
  const getAllPermissions = () => {
    if (!userRoles || userRoles.length === 0) return [];
    const permSet = new Map();
    userRoles.forEach((ur) => {
      const role = ur.role;
      if (role.isCustom) {
        (role.permissions || []).forEach((p) => permSet.set(p.permissionId, p));
      } else {
        const template = role.roleTemplate;
        if (template && template.permissions) {
          template.permissions.forEach((p) => permSet.set(p.permissionId, p));
        }
      }
    });
    return Array.from(permSet.values());
  };

  const permissions = getAllPermissions();

  // Clear action message after 5 seconds
  useEffect(() => {
    if (actionMessage) {
      const timer = setTimeout(() => setActionMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionMessage]);

  // ---- Loading states ----
  if (rolesLoading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Access Management
      </Typography>

      {/* User Selector (via modal) */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <div className="form-section">
          <div className="form-row">
            <label htmlFor="user-select-display">User</label>
            <div className="user-select-container">
              <input
                type="text"
                id="user-select-display"
                className="user-display-input"
                value={selectedUser ? selectedUser.fullName : ""}
                placeholder="Click to select a user"
                readOnly
                onClick={openUserModal}
              />
              <button
                type="button"
                className="select-user-btn"
                onClick={openUserModal}
              >
                Select
              </button>
            </div>
          </div>

          {/* User Selection Modal */}
          {isUserModalOpen && (
            <div
              className="lisence-modal-overlay"
              onClick={() => setIsUserModalOpen(false)}
            >
              <div
                className="lisence-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h3>Select User</h3>
                  <button
                    className="close-btn"
                    onClick={() => setIsUserModalOpen(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="lisence-modal-body">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                    />
                  </div>

                  {loadingUsers ? (
                    <div className="loading-spinner">Loading users...</div>
                  ) : (
                    <>
                      {usersError && (
                        <Alert severity="error">{usersError}</Alert>
                      )}
                      <div className="user-table-wrapper">
                        <table className="user-table">
                          <thead>
                            <tr>
                              <th>S/N</th>
                              <th>Name</th>
                              <th>Code</th>
                              <th>Mobile</th>
                              <th>Email</th>
                              <th>Status</th>
                              <th>Employee No</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {searchResults.map((user, index) => (
                              <tr key={user.userId}>
                                <td>{currentPage * pageSize + index + 1}</td>
                                <td>
                                  {user.firstName} {user.lastName}
                                </td>
                                <td>{user.userCode}</td>
                                <td>{user.mobile}</td>
                                <td>{user.email}</td>
                                <td>
                                  <span
                                    className={`status-badge ${
                                      user.active ? "active" : "inactive"
                                    }`}
                                  >
                                    {user.active ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td>{user.employeeNo}</td>
                                <td>
                                  <button
                                    className="select-btn"
                                    onClick={() => handleSelectUser(user)}
                                  >
                                    Select
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {searchResults.length === 0 && !loadingUsers && (
                              <tr>
                                <td colSpan="8" className="no-data">
                                  No users found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {!loadingUsers && searchResults.length > 0 && (
                        <div className="pagination-section">
                          {totalPages > 1 && (
                            <div className="pagination-container">
                              <div className="pagination-info">
                                Showing page {currentPage + 1} of {totalPages} (
                                {Math.min(
                                  currentPage * pageSize + 1,
                                  totalElements
                                )}{" "}
                                -{" "}
                                {Math.min(
                                  (currentPage + 1) * pageSize,
                                  totalElements
                                )}{" "}
                                of {totalElements} employees)
                              </div>
                              <Pagination
                                currentPage={currentPage + 1} // 1‑based
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* User Details Card */}
          {selectedUser && (
            <div className="details-card user-details">
              <h4>User Details</h4>
              <div className="details-grid">
                <span className="detail-label">Full Name:</span>
                <span>{selectedUser.fullName}</span>
                <span className="detail-label">Code:</span>
                <span>{selectedUser.code}</span>
                <span className="detail-label">Mobile:</span>
                <span>{selectedUser.mobile}</span>
                <span className="detail-label">Email:</span>
                <span>{selectedUser.email}</span>
                <span className="detail-label">Status:</span>
                <span className="role-badge">{selectedUser.employeeStatus}</span>
                <span className="detail-label">Employee No:</span>
                <span>{selectedUser.employeeNo}</span>
              </div>
            </div>
          )}
        </div>
      </Paper>

      {/* Role Management Section (only when a user is selected) */}
      {selectedUserId && (
        <>
          {actionMessage && (
            <Alert
              severity={actionMessage.type}
              sx={{ mb: 2 }}
              onClose={() => setActionMessage(null)}
            >
              {actionMessage.text}
            </Alert>
          )}

          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">
                Assigned Roles
                {userRolesLoading && (
                  <CircularProgress size={20} sx={{ ml: 2 }} />
                )}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenAssignDialog(true)}
                disabled={userRolesLoading}
              >
                Assign Role
              </Button>
            </Box>

            {userRolesError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {userRolesError}
              </Alert>
            )}

            {userRoles.length === 0 ? (
              <Alert severity="info">No roles assigned to this user.</Alert>
            ) : (
              <List>
                {userRoles.map((ur) => (
                  <ListItem
                    key={ur.userRoleId}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveRole(ur.userRoleId)}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body1">
                            {ur.role.isCustom
                              ? ur.role.customName
                              : ur.role.roleTemplate?.roleName}
                          </Typography>
                          <Chip
                            label={ur.role.isCustom ? "Custom" : "System"}
                            size="small"
                            color={ur.role.isCustom ? "primary" : "secondary"}
                          />
                        </Box>
                      }
                      secondary={
                        ur.role.isCustom
                          ? `Permissions: ${(ur.role.permissions || [])
                              .map((p) => p.permissionCode)
                              .join(", ")}`
                          : `Template: ${ur.role.roleTemplate?.roleCode}`
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              All Permissions (from assigned roles)
            </Typography>
            {permissions.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No permissions granted.
              </Typography>
            ) : (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {permissions.map((p) => (
                  <Chip
                    key={p.permissionId}
                    label={`${p.permissionName} (${p.permissionCode})`}
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </Paper>
        </>
      )}

      {/* Assign Role Dialog */}
      <Dialog
        open={openAssignDialog}
        onClose={() => setOpenAssignDialog(false)}
      >
        <DialogTitle>Assign Role</DialogTitle>
        <DialogContent>
          {assignError && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setAssignError(null)}
            >
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
            <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAssignRole}
              disabled={!selectedRoleId}
            >
              Assign
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default UserAccessManagement;