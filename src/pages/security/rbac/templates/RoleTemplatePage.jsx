// src/pages/security/rbac/templates/RoleTemplatePage.jsx
import React from 'react';
import TemplateCard from './TemplateCard';
import '../css/templatePage.css';

const RoleTemplatePage = ({ templates, loading }) => {
    return (
        <div className="template-page">
            <div className="template-header">
                <h2>Role Templates</h2>
                <p className="template-subtitle">
                    System-defined templates that can be cloned into custom roles
                </p>
            </div>
            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <div className="template-grid">
                    {templates?.map((template) => (
                        <TemplateCard key={template.id} template={template} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoleTemplatePage;