// src/pages/security/rbac/roles/RolesPage.jsx
import React, { useState } from 'react';
import RoleTable from './RoleTable';
import CreateRoleModal from './CreateRoleModal';
import { roleApi } from '../../../api/roleApi';
import '../css/rolesPage.css';

const RolesPage = ({ roles, loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rolesList, setRolesList] = useState(roles || []);
    const pageSize = 5;

    React.useEffect(() => {
        setRolesList(roles || []);
    }, [roles]);

    const filteredRoles = rolesList.filter((role) =>
        role.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedRoles = filteredRoles.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totalPages = Math.ceil(filteredRoles.length / pageSize);

    const handleCreateRole = async (roleData) => {
        try {
            const newRole = await roleApi.createRole(roleData);
            setRolesList((prev) => [...prev, newRole]);
            setShowCreateModal(false);
        } catch (error) {
            console.error('Failed to create role:', error);
        }
    };

    const handleDeleteRole = async (roleId) => {
        if (!window.confirm('Are you sure you want to delete this role?')) return;
        try {
            await roleApi.deleteRole(roleId);
            setRolesList((prev) => prev.filter((r) => r.id !== roleId));
        } catch (error) {
            console.error('Failed to delete role:', error);
        }
    };

    return (
        <div className="roles-page">
            <div className="roles-toolbar">
                <input
                    type="text"
                    className="roles-search"
                    placeholder="Search roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
                    + New Role
                </button>
            </div>

            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <>
                    <RoleTable
                        roles={paginatedRoles}
                        onDelete={handleDeleteRole}
                        onEdit={(role) => console.log('Edit role:', role)}
                        onClone={(role) => console.log('Clone role:', role)}
                        onView={(role) => console.log('View role:', role)}
                    />
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                            >
                                Previous
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {showCreateModal && (
                <CreateRoleModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleCreateRole}
                />
            )}
        </div>
    );
};

export default RolesPage;