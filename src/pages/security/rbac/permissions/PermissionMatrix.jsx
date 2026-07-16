import React from 'react';
import { groupPermissionsByResource } from '../../utils/permissionUtils';
import './PermissionMatrix.css';

const PermissionMatrix = ({ permissions, loading }) => {
  if (loading) return <div>Loading...</div>;
  const groups = groupPermissionsByResource(permissions);

  return (
    <table className="permission-matrix table table-bordered">
      <thead>
        <tr>
          <th>Resource</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(groups).map(([resource, perms]) => (
          <tr key={resource}>
            <td>{resource}</td>
            <td>
              {perms.map(p => (
                <span key={p.id} className="badge bg-info me-1">{p.action}</span>
              ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PermissionMatrix;