import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoles } from '../../hooks/useRoles';
import { validateRole } from '../../validation/roleValidation';
import './CreateRoleDialog.css';

const CreateRoleDialog = ({ open, onClose }) => {
  const { t } = useTranslation("rbac");
  const { createRole } = useRoles();
  const [formData, setFormData] = useState({ name: '', description: '', type: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRole(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await createRole(formData);
      onClose();
      // reset form
      setFormData({ name: '', description: '', type: '' });
      setErrors({});
    } catch (error) {
      console.error('Create role failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{t('rbac.roles.createNew')}</h5>
            <button className="close" onClick={onClose}>&times;</button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label>{t('rbac.roles.name')} *</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label>{t('rbac.roles.description')}</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>{t('rbac.roles.type')}</label>
                <select className="form-control" name="type" value={formData.type} onChange={handleChange}>
                  <option value="">Custom</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleDialog;