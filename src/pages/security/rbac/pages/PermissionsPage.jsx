import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePermissions } from '../hooks/usePermissions';
import PermissionTree from '../components/permissions/PermissionTree';
import PermissionMatrix from '../components/roles/PermissionMatrix';
import PageHeader from "../../../../component/common/PageHeader" ;
import './../css/permissions.css';

const PermissionsPage = () => {
  const { t } = useTranslation("rbac");
  const { permissions, fetchPermissions, loading } = usePermissions();
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'matrix'

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <div className="permissions-page">
      <PageHeader title={t('rbac.permissions.title')} subtitle={t('rbac.permissions.subtitle')}>
        <div className="view-toggle">
          <button
            className={`btn ${viewMode === 'tree' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setViewMode('tree')}
          >
            {t('rbac.permissions.treeView')}
          </button>
          <button
            className={`btn ${viewMode === 'matrix' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setViewMode('matrix')}
          >
            {t('rbac.permissions.matrixView')}
          </button>
        </div>
      </PageHeader>
      <div className="permissions-content">
        {viewMode === 'tree' ? (
          <PermissionTree permissions={permissions} loading={loading} />
        ) : (
          <PermissionMatrix permissions={permissions} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default PermissionsPage;