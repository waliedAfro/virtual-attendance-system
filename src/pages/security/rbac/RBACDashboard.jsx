// src/pages/security/rbac/RBACDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useRBAC } from '../../../hooks/useRBAC';
import StatisticsCards from './components/StatisticsCards';
import RecentChanges from './components/RecentChanges';
import RolesPage from './roles/RolesPage';
import PermissionsPage from './permissions/PermissionsPage';
import RoleTemplatePage from './templates/RoleTemplatePage';
import './css/rbac.css';

const TAB_OPTIONS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'roles', label: 'Roles' },
    { id: 'permissions', label: 'Permissions' },
    { id: 'templates', label: 'Templates' },
    { id: 'audit', label: 'Audit' },
];

const RBACDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const { loading, roles, permissions, templates, fetchAll } = useRBAC();

    useEffect(() => {
        fetchAll();
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="rbac-dashboard-grid">
                        <StatisticsCards roles={roles} permissions={permissions} />
                        <RecentChanges />
                    </div>
                );
            case 'roles':
                return <RolesPage roles={roles} loading={loading} />;
            case 'permissions':
                return <PermissionsPage permissions={permissions} loading={loading} />;
            case 'templates':
                return <RoleTemplatePage templates={templates} loading={loading} />;
            case 'audit':
                return <div className="rbac-audit-placeholder">Audit log coming soon...</div>;
            default:
                return null;
        }
    };

    return (
        <div className="rbac-dashboard">
            <header className="rbac-header">
                <h1>Access Control</h1>
                <nav className="rbac-tabs">
                    {TAB_OPTIONS.map((tab) => (
                        <button
                            key={tab.id}
                            className={`rbac-tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </header>
            <main className="rbac-content">{renderContent()}</main>
        </div>
    );
};

export default RBACDashboard;