import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoleTemplates } from '../hooks/useRoleTemplates';
import PageHeader from '../../../../components/common/PageHeader';
import TemplateCard from '../components/templates/TemplateCard';
import TemplatePermissionView from '../components/templates/TemplatePermissionView';
import ConfirmDialog from '../../../../components/common/ConfirmDialog';
import './../css/templates.css';

const RoleTemplatesPage = () => {
  const { t } = useTranslation("rbac");
  const { templates, fetchTemplates, deleteTemplate } = useRoleTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPermissionView, setShowPermissionView] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleViewPermissions = (template) => {
    setSelectedTemplate(template);
    setShowPermissionView(true);
  };

  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId) {
      await deleteTemplate(deleteTargetId);
      setShowDeleteDialog(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="templates-page">
      <PageHeader title={t('rbac.templates.title')} subtitle={t('rbac.templates.subtitle')}>
        <button className="btn btn-primary" onClick={() => { /* open create template dialog */ }}>
          {t('rbac.templates.createNew')}
        </button>
      </PageHeader>
      <div className="template-grid">
        {templates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onViewPermissions={handleViewPermissions}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {selectedTemplate && (
        <TemplatePermissionView
          open={showPermissionView}
          template={selectedTemplate}
          onClose={() => setShowPermissionView(false)}
        />
      )}
      <ConfirmDialog
        open={showDeleteDialog}
        title={t('rbac.templates.deleteConfirmTitle')}
        message={t('rbac.templates.deleteConfirmMessage')}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
};

export default RoleTemplatesPage;