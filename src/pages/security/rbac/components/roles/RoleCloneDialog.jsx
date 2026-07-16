import React from 'react';
import { useTranslation } from 'react-i18next';
import './RoleCloneDialog.css';

const RoleCloneDialog = ({ open, role, onConfirm, onCancel }) => {
  const { t } = useTranslation("rbac");
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{t('rbac.roles.cloneTitle', { name: role?.name })}</h5>
          </div>
          <div className="modal-body">
            <p>{t('rbac.roles.cloneConfirmMessage')}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button className="btn btn-primary" onClick={onConfirm}>Clone</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleCloneDialog;