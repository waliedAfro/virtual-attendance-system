import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserRoles } from '../hooks/useUserRoles';
import { useRoles } from '../hooks/useRoles';
import UserRoleAssignment from '../components/users/UserRoleAssignment';
import PageHeader from '../../../../components/common/PageHeader';
import './../css/users.css';

const UserRoleAssignmentPage = () => {
  const { t } = useTranslation("rbac");
  const { assignments, fetchAssignments } = useUserRoles();
  const { roles, fetchRoles } = useRoles();
  const [users, setUsers] = useState([]); // Would come from user management service

  useEffect(() => {
    fetchAssignments();
    fetchRoles();
    // fetch users from user service
    setUsers([
      { id: 'user1', name: 'John Doe' },
      { id: 'user2', name: 'Jane Smith' },
    ]);
  }, []);

  return (
    <div className="user-role-assignment-page">
      <PageHeader title={t('rbac.userAssignments.title')} subtitle={t('rbac.userAssignments.subtitle')} />
      <UserRoleAssignment
        users={users}
        roles={roles}
        assignments={assignments}
        onAssignmentChange={() => fetchAssignments()}
      />
    </div>
  );
};

export default UserRoleAssignmentPage;