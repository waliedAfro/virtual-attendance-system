import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoles } from '../hooks/useRoles';
import { usePermissions } from '../hooks/usePermissions';
import { useRoleTemplates } from '../hooks/useRoleTemplates';
import PageHeader from '../../../../components/common/PageHeader';
import RoleCard from '../components/roles/RoleCard';
import TemplateCard from '../components/templates/TemplateCard';
import './../css/rbac.css';

const RBACDashboard = () => {
  const { t } = useTranslation("rbac");
  const { roles, fetchRoles, loading: rolesLoading } = useRoles();
  const { permissions, fetchPermissions } = usePermissions();
  const { templates, fetchTemplates } = useRoleTemplates();

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
    fetchTemplates();
  }, []);

  const stats = [
    { label: t('rbac.dashboard.totalRoles'), value: roles.length },
    { label: t('rbac.dashboard.totalPermissions'), value: permissions.length },
    { label: t('rbac.dashboard.totalTemplates'), value: templates.length },
  ];

  return (
    <div className="rbac-dashboard">
      <PageHeader title={t('rbac.dashboard.title')} subtitle={t('rbac.dashboard.subtitle')} />
      <div className="stats-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="dashboard-sections">
        <section>
          <h2>{t('rbac.dashboard.recentRoles')}</h2>
          <div className="card-grid">
            {roles.slice(0, 4).map(role => (
              <RoleCard key={role.id} role={role} />
            ))}
          </div>
        </section>
        <section>
          <h2>{t('rbac.dashboard.recentTemplates')}</h2>
          <div className="card-grid">
            {templates.slice(0, 4).map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RBACDashboard;