import React from 'react';
import './PermissionGroupCard.css';

const PermissionGroupCard = ({ group, permissions }) => {
  const groupPermissions = permissions.filter(p => p.groupId === group.id);

  return (
    <div className="permission-group-card">
      <h5>{group.name}</h5>
      <p>{group.description}</p>
      <div className="permission-badges">
        {groupPermissions.map(p => (
          <span key={p.id} className="badge bg-secondary">{p.name}</span>
        ))}
      </div>
    </div>
  );
};

export default PermissionGroupCard;