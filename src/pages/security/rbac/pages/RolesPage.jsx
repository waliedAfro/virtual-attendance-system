import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoles } from '../hooks/useRoles';
import PageHeader from '../../../../components/common/PageHeader';
import DataTable from '../../../../components/common/DataTable';
import SearchBox from '../../../../components/common/SearchBox';
import CreateRoleDialog from '../components/roles/CreateRoleDialog';
import ConfirmDialog from '../../../../components/common/ConfirmDialog';
import { getRoleBadgeVariant } from '../utils/roleUtils';
import './../css/roles.css';

const RolesPage = () => {
  const { t } = useTranslation("rbac");
  const { roles, loading, deleteRole, fetchRoles } = useRoles();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setSelectedRoleId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedRoleId) {
      await deleteRole(selectedRoleId);
      setShowDeleteDialog(false);
      setSelectedRoleId(null);
    }
  };

  const columns = [
    { key: 'name', label: t('rbac.roles.name'), sortable: true },
    { key: 'description', label: t('rbac.roles.description') },
    {
      key: 'type',
      label: t('rbac.roles.type'),
      render: (role) => (
        <span className={`badge bg-${getRoleBadgeVariant(role.type)}`}>
          {role.type || 'custom'}
        </span>
      ),
    },
    {
      key: 'permissionsCount',
      label: t('rbac.roles.permissions'),
      render: (role) => role.permissions?.length || 0,
    },
    {
      key: 'actions',
      label: t('common.actions'),
      render: (role) => (
        <>
          <button className="btn btn-sm btn-primary" onClick={() => window.location.href = `/rbac/roles/${role.id}`}>
            {t('common.view')}
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(role.id)}>
            {t('common.delete')}
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="roles-page">
      <PageHeader title={t('rbac.roles.title')} subtitle={t('rbac.roles.subtitle')}>
        <button className="btn btn-primary" onClick={() => setShowCreateDialog(true)}>
          {t('rbac.roles.createNew')}
        </button>
      </PageHeader>
      <div className="roles-toolbar">
        <SearchBox value={searchTerm} onChange={setSearchTerm} placeholder={t('rbac.roles.search')} />
      </div>
      <DataTable columns={columns} data={filteredRoles} loading={loading} rowKey="id" />
      <CreateRoleDialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} />
      <ConfirmDialog
        open={showDeleteDialog}
        title={t('rbac.roles.deleteConfirmTitle')}
        message={t('rbac.roles.deleteConfirmMessage')}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default RolesPage;