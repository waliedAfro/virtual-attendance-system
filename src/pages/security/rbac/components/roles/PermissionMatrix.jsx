import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { groupPermissionsByResource } from '../../utils/permissionUtils';
import './PermissionMatrix.css';

const PermissionMatrix = ({ permissions, loading = false }) => {
  const { t } = useTranslation();

  if (loading) {
    return <div className="permission-matrix-loading">{t('common.loading')}</div>;
  }

  if (!permissions || permissions.length === 0) {
    return <div className="permission-matrix-empty">{t('permissions.noPermissions')}</div>;
  }

  const groupedPermissions = groupPermissionsByResource(permissions);

  // Sort resources alphabetically
  const sortedResources = Object.keys(groupedPermissions).sort();

  // Get all unique actions across all resources for the header
  const allActions = new Set();
  Object.values(groupedPermissions).forEach(perms => {
    perms.forEach(p => {
      if (p.action) allActions.add(p.action);
    });
  });
  const sortedActions = Array.from(allActions).sort();

  // Build a matrix: resource -> action -> permission object (or null if not defined)
  const matrix = {};
  sortedResources.forEach(resource => {
    matrix[resource] = {};
    const perms = groupedPermissions[resource];
    // Create a map of action -> permission
    const actionMap = {};
    perms.forEach(p => {
      if (p.action) {
        actionMap[p.action] = p;
      }
    });
    sortedActions.forEach(action => {
      matrix[resource][action] = actionMap[action] || null;
    });
  });

  return (
    <div className="permission-matrix-container">
      <div className="table-responsive">
        <table className="permission-matrix-table table table-bordered table-striped">
          <thead>
            <tr>
              <th className="resource-header">{t('permissions.resource')}</th>
              {sortedActions.map(action => (
                <th key={action} className="action-header">
                  {action}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedResources.map(resource => (
              <tr key={resource}>
                <td className="resource-cell">
                  <span className="resource-name">{resource}</span>
                </td>
                {sortedActions.map(action => {
                  const permission = matrix[resource][action];
                  return (
                    <td key={`${resource}-${action}`} className="action-cell">
                      {permission ? (
                        <span className="permission-badge badge bg-success">
                          ✓
                        </span>
                      ) : (
                        <span className="permission-badge badge bg-light">
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

PermissionMatrix.propTypes = {
  permissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      action: PropTypes.string,
      resource: PropTypes.string,
      parentId: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
};

PermissionMatrix.defaultProps = {
  permissions: [],
  loading: false,
};

export default PermissionMatrix;