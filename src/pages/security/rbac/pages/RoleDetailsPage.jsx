import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRoles } from '../hooks/useRoles';
import { usePermissions } from '../hooks/usePermissions';
import RolePermissionPanel from '../components/roles/RolePermissionPanel';
import RoleCloneDialog from '../components/roles/RoleCloneDialog';
import PageHeader from '../../../../components/common/PageHeader';
import './../css/roles.css';

const RoleDetailsPage = () => {
  const { id } = useParams("rbac");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { roles, updateRolePermissions, cloneRole } = useRoles();
  const { permissions } = usePermissions();
  const [role, setRole] = useState(null);
  const [showCloneDialog, setShowCloneDialog] = useState(false);

  useEffect(() => {
    const found = roles.find(r => r.id === id);
    if (found) {
      setRole(found);
    } else {
      // fetch individually if needed
    }
  }, [id, roles]);

  const handlePermissionUpdate = async (permissionIds) => {
    if (role) {
      await updateRolePermissions(role.id, permissionIds);
      // Refresh role (or refetch)
      const updated = roles.find(r => r.id === role.id);
      setRole(updated);
    }
  };

  const handleClone = async () => {
    if (role) {
      await cloneRole(role.id);
      setShowCloneDialog(false);
      navigate('/rbac/roles');
    }
  };

  if (!role) return <div>{t('common.loading')}</div>;

  return (
    <div className="role-details-page">
      <PageHeader
        title={role.name}
        subtitle={role.description}
        breadcrumbs={[
          { label: t('rbac.roles.title'), path: '/rbac/roles' },
          { label: role.name },
        ]}
      >
        <button className="btn btn-outline-primary" onClick={() => setShowCloneDialog(true)}>
          {t('rbac.roles.clone')}
        </button>
      </PageHeader>
      <div className="role-details-content">
        <RolePermissionPanel
          role={role}
          permissions={permissions}
          onUpdate={handlePermissionUpdate}
        />
      </div>
      <RoleCloneDialog
        open={showCloneDialog}
        role={role}
        onConfirm={handleClone}
        onCancel={() => setShowCloneDialog(false)}
      />
    </div>
  );
};

export default RoleDetailsPage;