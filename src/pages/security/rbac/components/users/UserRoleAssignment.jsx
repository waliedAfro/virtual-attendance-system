import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserRoles } from '../../hooks/useUserRoles';
import './UserRoleAssignment.css';

const UserRoleAssignment = ({ users, roles, assignments, onAssignmentChange }) => {
  const { t } = useTranslation();
  const { assignRole, removeRole } = useUserRoles();
  const [selectedUser, setSelectedUser] = useState('');

  const handleAssign = async (userId, roleId) => {
    await assignRole(userId, roleId);
    onAssignmentChange();
  };

  const handleRemove = async (userId, roleId) => {
    await removeRole(userId, roleId);
    onAssignmentChange();
  };

  const getUserRoles = (userId) => {
    return assignments.filter(a => a.userId === userId).map(a => a.roleId);
  };

  return (
    <div className="user-role-assignment">
      <div className="assignment-controls">
        <select className="form-control" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Select a user</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>
      {selectedUser && (
        <div className="user-roles">
          <h4>Roles for {users.find(u => u.id === selectedUser)?.name}</h4>
          <div className="roles-list">
            {roles.map(role => {
              const isAssigned = getUserRoles(selectedUser).includes(role.id);
              return (
                <div key={role.id} className="role-item">
                  <span>{role.name}</span>
                  {isAssigned ? (
                    <button className="btn btn-sm btn-danger" onClick={() => handleRemove(selectedUser, role.id)}>
                      Remove
                    </button>
                  ) : (
                    <button className="btn btn-sm btn-primary" onClick={() => handleAssign(selectedUser, role.id)}>
                      Assign
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoleAssignment;