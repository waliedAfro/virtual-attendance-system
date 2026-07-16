import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PermissionSelector from '../permissions/PermissionSelector';
import './RolePermissionPanel.css';

const RolePermissionPanel = ({ role, permissions, onUpdate }) => {
  const { t } = useTranslation("rbac");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (role && role.permissions) {
      setSelected(role.permissions.map(p => p.id));
    }
  }, [role]);

  const handleSave = () => {
    onUpdate(selected);
  };

  return (
    <div className="role-permission-panel">
      <h3>{t('rbac.roles.permissions')}</h3>
      <PermissionSelector
        permissions={permissions}
        selectedIds={selected}
        onChange={setSelected}
      />
      <div className="panel-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          {t('common.save')}
        </button>
      </div>
    </div>
  );
};

export default RolePermissionPanel;