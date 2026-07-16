// src/pages/security/rbac/roles/RoleTable.jsx
import React from 'react';
import '../css/roleTable.css';

const RoleTable = ({ roles, onDelete, onEdit, onClone, onView }) => {
    const getStatusBadge = (status) => {
        const className = `status-badge ${status?.toLowerCase() === 'active' ? 'active' : 'inactive'}`;
        return <span className={className}>{status || 'Active'}</span>;
    };

    return (
        <div className="role-table-container">
            <table className="role-table">
                <thead>
                    <tr>
                        <th>Role Name</th>
                        <th>Type</th>
                        <th>Users</th>
                        <th>Permissions</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="empty-state">
                                No roles found
                            </td>
                        </tr>
                    ) : (
                        roles.map((role) => (
                            <tr key={role.id} className="role-row">
                                <td className="role-name">{role.name}</td>
                                <td>
                                    <span className={`role-type ${role.isCustom ? 'custom' : 'system'}`}>
                                        {role.isCustom ? 'Custom' : 'System'}
                                    </span>
                                </td>
                                <td>{role.userCount || 0}</td>
                                <td>{role.permissionCount || 0}</td>
                                <td>{getStatusBadge(role.status)}</td>
                                <td className="actions-cell">
                                    <button className="action-btn edit" onClick={() => onEdit(role)}>
                                        Edit
                                    </button>
                                    <button className="action-btn clone" onClick={() => onClone(role)}>
                                        Clone
                                    </button>
                                    <button className="action-btn perms" onClick={() => onView(role)}>
                                        Permissions
                                    </button>
                                    <button className="action-btn delete" onClick={() => onDelete(role.id)}>
                                        Delete
                                    </button>
                                    <button className="action-btn view" onClick={() => onView(role)}>
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RoleTable;