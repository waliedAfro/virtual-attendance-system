// src/pages/security/rbac/roles/CreateRoleModal.jsx
import React, { useState, useEffect } from 'react';
import { roleApi } from '../../../api/roleApi';
import '../css/modal.css';

const CreateRoleModal = ({ onClose, onSubmit }) => {
    const [roleName, setRoleName] = useState('');
    const [description, setDescription] = useState('');
    const [roleType, setRoleType] = useState('custom');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const data = await roleApi.getTemplates();
                setTemplates(data);
                if (data.length > 0) setSelectedTemplate(data[0].id);
            } catch (error) {
                console.error('Failed to fetch templates:', error);
            }
        };
        fetchTemplates();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!roleName.trim()) return;

        setLoading(true);
        try {
            const payload = {
                name: roleName,
                description,
                isCustom: roleType === 'custom',
                templateId: roleType === 'template' ? selectedTemplate : undefined,
            };
            await onSubmit(payload);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Role</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Role Name *</label>
                        <input
                            type="text"
                            value={roleName}
                            onChange={(e) => setRoleName(e.target.value)}
                            placeholder="Enter role name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter role description"
                            rows="3"
                        />
                    </div>
                    <div className="form-group">
                        <label>Role Type</label>
                        <div className="radio-group">
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    value="template"
                                    checked={roleType === 'template'}
                                    onChange={() => setRoleType('template')}
                                />
                                Based on Template
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    value="custom"
                                    checked={roleType === 'custom'}
                                    onChange={() => setRoleType('custom')}
                                />
                                Custom Role
                            </label>
                        </div>
                    </div>
                    {roleType === 'template' && (
                        <div className="form-group">
                            <label>Template</label>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                            >
                                {templates.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Role'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoleModal;