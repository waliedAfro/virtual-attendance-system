// src/pages/security/rbac/templates/TemplateCard.jsx
import React, { useState } from 'react';
import '../css/templateCard.css';

const TemplateCard = ({ template }) => {
    const [expanded, setExpanded] = useState(false);

    const handleClone = () => {
        console.log('Clone template:', template.id);
        // Open clone modal
    };

    return (
        <div className="template-card glass-card">
            <div className="template-card-header">
                <h3 className="template-name">{template.name}</h3>
                <span className="template-badge system">System</span>
            </div>
            <div className="template-meta">
                <span>{template.permissionCount || 0} Permissions</span>
            </div>
            <div className="template-actions">
                <button className="btn-outline" onClick={() => setExpanded(!expanded)}>
                    {expanded ? 'Hide' : 'View'} Permissions
                </button>
                <button className="btn-primary" onClick={handleClone}>
                    Clone as Custom
                </button>
            </div>
            {expanded && (
                <div className="template-permissions">
                    <p className="inherited-badge">Inherited Permissions (Cannot Edit)</p>
                    <ul className="template-perm-list">
                        {template.permissions?.slice(0, 10).map((p) => (
                            <li key={p.id} className="template-perm-item">
                                <span className="perm-dot" />
                                {p.name || p.permissionName}
                            </li>
                        ))}
                        {template.permissions?.length > 10 && (
                            <li className="template-perm-more">+{template.permissions.length - 10} more</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TemplateCard;