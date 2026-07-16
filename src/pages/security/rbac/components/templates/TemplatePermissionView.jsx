import React from 'react';
import { useTranslation } from 'react-i18next';
import PermissionTree from '../permissions/PermissionTree.jsx';
import './TemplatePermissionView.css';

const TemplatePermissionView = ({ open, template, onClose }) => {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{t('rbac.templates.permissionsFor', { name: template.name })}</h5>
            <button className="close" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <PermissionTree permissions={template.permissions || []} />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePermissionView;