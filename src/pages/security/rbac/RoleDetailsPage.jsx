// src/pages/security/rbac/RoleDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roleApi } from '../../../api/roleApi';
import AssignPermissionModal from './components/AssignPermissionModal';
import './css/roleDetails.css';

const RoleDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const data = await roleApi.getRole(id);
                setRole(data);
                setPermissions(data.permissions || []);
            } catch (error) {
                console.error('Failed to fetch role:', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchRole();
    }, [id]);

    const handleSave = async () => {
        try {
            await roleApi.updateRole(id, { ...role, permissions });
            alert('Role updated successfully!');
        } catch (error) {
            console.error('Failed to update role:', error);
        }
    };

    const handleClone = async () => {
        try {
            const cloned = await roleApi.cloneRole(id);
            navigate(`/security/rbac/roles/${cloned.id}`);
        } catch (error) {
            console.error('Failed to clone role:', error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this role?')) return;
        try {
            await roleApi.deleteRole(id);
            navigate('/security/rbac/roles');
        } catch (error) {
            console.error('Failed to delete role:', error);
        }
    };

    const togglePermission = (permId) => {
        setPermissions((prev) =>
            prev.map((p) => (p.id === permId ? { ...p, assigned: !p.assigned } : p))
        );
    };

    if (loading) return <div className="loading-spinner">Loading role details...</div>;
    if (!role) return <div className="error-state">Role not found</div>;

    // Group permissions by resource
    const groupedPermissions = permissions.reduce((acc, p) => {
        const resource = p.resource || 'Other';
        if (!acc[resource]) acc[resource] = [];
        acc[resource].push(p);
        return acc;
    }, {});

    return (
        <div className="role-details-page">
            <div className="role-details-header">
                <button className="back-btn" onClick={() => navigate('/security/rbac/roles')}>
                    ← Back to Roles
                </button>
                <h1>{role.name}</h1>
                <span className={`role-type-badge ${role.isCustom ? 'custom' : 'system'}`}>
                    {role.isCustom ? 'Custom' : 'System'}
                </span>
            </div>

            <div className="role-details-grid">
                <div className="role-general glass-card">
                    <h3>General</h3>
                    <div className="general-field">
                        <label>Name</label>
                        <input
                            type="text"
                            value={role.name}
                            onChange={(e) => setRole({ ...role, name: e.target.value })}
                        />
                    </div>
                    <div className="general-field">
                        <label>Description</label>
                        <textarea
                            value={role.description || ''}
                            onChange={(e) => setRole({ ...role, description: e.target.value })}
                            rows="3"
                        />
                    </div>
                    <div className="general-field">
                        <label>Role Type</label>
                        <span className="field-value">
                            {role.isCustom ? 'Custom Role' : 'System Role'}
                        </span>
                    </div>
                </div>

                <div className="role-permissions glass-card">
                    <div className="perm-header">
                        <h3>Permissions</h3>
                        <button className="btn-primary" onClick={() => setShowAssignModal(true)}>
                            + Assign Permission
                        </button>
                    </div>
                    {Object.entries(groupedPermissions).map(([resource, perms]) => (
                        <div key={resource} className="perm-group">
                            <h4 className="perm-resource">{resource}</h4>
                            <div className="perm-items">
                                {perms.map((p) => (
                                    <label key={p.id} className="perm-item">
                                        <input
                                            type="checkbox"
                                            checked={p.assigned || false}
                                            onChange={() => togglePermission(p.id)}
                                        />
                                        <span>{p.name || p.permissionName}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="role-actions">
                <button className="btn-primary" onClick={handleSave}>Save</button>
                <button className="btn-secondary" onClick={() => navigate('/security/rbac/roles')}>
                    Cancel
                </button>
                <button className="btn-outline" onClick={handleClone}>Clone</button>
                <button className="btn-danger" onClick={handleDelete}>Delete</button>
            </div>

            {showAssignModal && (
                <AssignPermissionModal
                    roleId={id}
                    currentPermissions={permissions}
                    onClose={() => setShowAssignModal(false)}
                    onAssign={(newPerms) => {
                        setPermissions(newPerms);
                        setShowAssignModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default RoleDetailsPage;