// src/pages/security/rbac/components/RecentChanges.jsx
import React from 'react';
import '../css/recentChanges.css';

const RecentChanges = () => {
    const changes = [
        { id: 1, action: 'Tenant Admin updated', time: '2 min ago', type: 'update' },
        { id: 2, action: 'HR Manager created', time: '15 min ago', type: 'create' },
        { id: 3, action: 'Payroll permission added', time: '1 hour ago', type: 'add' },
        { id: 4, action: 'Finance role cloned', time: '3 hours ago', type: 'clone' },
    ];

    return (
        <div className="recent-changes">
            <h3>Recent Changes</h3>
            <ul className="change-list">
                {changes.map((change) => (
                    <li key={change.id} className={`change-item ${change.type}`}>
                        <span className="change-action">{change.action}</span>
                        <span className="change-time">{change.time}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentChanges;