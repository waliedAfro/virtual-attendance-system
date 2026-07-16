import React from 'react';
import { Link } from 'react-router-dom';
import { getRoleBadgeVariant } from '../../utils/roleUtils';
import './RoleCard.css';

const RoleCard = ({ role }) => {
  return (
    <div className="role-card">
      <div className="role-card-header">
        <h5>{role.name}</h5>
        <span className={`badge bg-${getRoleBadgeVariant(role.type)}`}>{role.type || 'custom'}</span>
      </div>
      <p className="role-description">{role.description}</p>
      <div className="role-card-footer">
        <span>{role.permissions?.length || 0} permissions</span>
        <Link to={`/rbac/roles/${role.id}`} className="btn btn-sm btn-outline-primary">
          View
        </Link>
      </div>
    </div>
  );
};

export default RoleCard;