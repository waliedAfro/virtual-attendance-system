// src/pages/security/rbac/components/AssignPermissionModal.jsx
import React, { useState, useEffect } from 'react';
import { roleApi } from '../../../api/roleApi';
import '../css/modal.css';
import '../css/assignPermission.css';

const AssignPermissionModal = ({ roleId, currentPermissions, onClose, onAssign }) => {
    const [allPermissions, setAllPermissions] = useState([]);
    const [selected, setSelected] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const data = await roleApi.getAllPermissions();
                setAllPermissions(data);
                // Initialize selected state from current permissions
                const initialSelected = {};
                data.forEach((p) => {
                    initialSelected[p.id] = currentPermissions.some((cp) => cp.id === p.id);
                });
                setSelected(initialSelected);
            } catch (error) {
                console.error('Failed to fetch permissions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPermissions();
    }, [currentPermissions]);

    const togglePermission = (permId) => {
        setSelected((prev) => ({ ...prev, [permId]: !prev[permId] }));
    };

    const toggleAllInGroup = (resource, perms) => {
        const allAssigned = perms.every((p) => selected[p.id]);
        const newState = { ...selected };
        perms.forEach((p) => {
            newState[p.id] = !allAssigned;
        });
        setSelected(newState);
    };

    const handleSubmit = async () => {
        const assigned = allPermissions.filter((p) => selected[p.id]);
        onAssign(assigned);
    };

    // Group by resource
    const grouped = allPermissions.reduce((acc, p) => {
        const resource = p.resource || 'Other';
        if (!acc[resource]) acc[resource] = [];
        acc[resource].push(p);
        return acc;
    }, {});

    const filteredGroups = Object.entries(grouped).filter(([resource, perms]) =>
        resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perms.some((p) => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-large glass-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Assign Permissions</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <div className="assign-perm-search">
                    <input
                        type="text"
                        placeholder="Search permissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading permissions...</div>
                ) : (
                    <div className="assign-perm-list">
                        {filteredGroups.map(([resource, perms]) => {
                            const allChecked = perms.every((p) => selected[p.id]);
                            const someChecked = perms.some((p) => selected[p.id]);
                            return (
                                <div key={resource} className="assign-perm-group">
                                    <div className="assign-group-header">
                                        <label className="assign-group-check">
                                            <input
                                                type="checkbox"
                                                checked={allChecked}
                                                ref={(el) => {
                                                    if (el) el.indeterminate = someChecked && !allChecked;
                                                }}
                                                onChange={() => toggleAllInGroup(resource, perms)}
                                            />
                                            <span className="group-name">{resource}</span>
                                        </label>
                                    </div>
                                    <div className="assign-perm-items">
                                        {perms.map((p) => (
                                            <label key={p.id} className="assign-perm-item">
                                                <input
                                                    type="checkbox"
                                                    checked={selected[p.id] || false}
                                                    onChange={() => togglePermission(p.id)}
                                                />
                                                <span>{p.name || p.permissionName}</span>
                                                <span className="perm-code">{p.code || p.permissionCode}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={handleSubmit}>
                        Assign Permissions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignPermissionModal;