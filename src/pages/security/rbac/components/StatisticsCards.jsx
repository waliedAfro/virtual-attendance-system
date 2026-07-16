// src/pages/security/rbac/components/StatisticsCards.jsx
import React from 'react';
import '../css/statisticsCards.css';

const StatisticsCards = ({ roles, permissions }) => {
    const totalRoles = roles?.length || 0;
    const customRoles = roles?.filter((r) => r.isCustom).length || 0;
    const systemRoles = totalRoles - customRoles;
    const totalPermissions = permissions?.length || 0;

    const stats = [
        { label: 'Total Roles', value: totalRoles, icon: '👥' },
        { label: 'Custom Roles', value: customRoles, icon: '⚙️' },
        { label: 'System Roles', value: systemRoles, icon: '🏛️' },
        { label: 'Permissions', value: totalPermissions, icon: '🔑' },
    ];

    return (
        <div className="statistics-cards">
            {stats.map((stat) => (
                <div className="stat-card" key={stat.label}>
                    <span className="stat-icon">{stat.icon}</span>
                    <div className="stat-content">
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatisticsCards;