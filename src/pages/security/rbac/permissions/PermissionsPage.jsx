// src/pages/security/rbac/permissions/PermissionsPage.jsx
import React, { useState } from 'react';
import PermissionTree from './PermissionTree';
import PermissionMatrix from './PermissionMatrix';
import '../css/permissionsPage.css';

const PermissionsPage = ({ permissions, loading }) => {
    const [viewMode, setViewMode] = useState('tree'); // 'tree' | 'matrix'
    const [filter, setFilter] = useState('');

    const filteredPermissions = permissions?.filter((p) =>
        p.name?.toLowerCase().includes(filter.toLowerCase()) ||
        p.resource?.toLowerCase().includes(filter.toLowerCase())
    ) || [];

    return (
        <div className="permissions-page">
            <div className="permissions-toolbar">
                <div className="view-toggle">
                    <button
                        className={`toggle-btn ${viewMode === 'tree' ? 'active' : ''}`}
                        onClick={() => setViewMode('tree')}
                    >
                        Tree View
                    </button>
                    <button
                        className={`toggle-btn ${viewMode === 'matrix' ? 'active' : ''}`}
                        onClick={() => setViewMode('matrix')}
                    >
                        Matrix View
                    </button>
                </div>
                <input
                    type="text"
                    className="permissions-search"
                    placeholder="Filter permissions..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : viewMode === 'tree' ? (
                <PermissionTree permissions={filteredPermissions} />
            ) : (
                <PermissionMatrix permissions={filteredPermissions} />
            )}
        </div>
    );
};

export default PermissionsPage;