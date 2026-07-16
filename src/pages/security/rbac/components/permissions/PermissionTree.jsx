import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { buildPermissionTree } from '../../utils/permissionUtils';
import './PermissionTree.css';

const PermissionTree = ({ permissions, loading = false, onPermissionClick }) => {
  const { t } = useTranslation();

  if (loading) {
    return <div className="permission-tree-loading">{t('common.loading')}</div>;
  }

  if (!permissions || permissions.length === 0) {
    return <div className="permission-tree-empty">{t('permissions.noPermissions')}</div>;
  }

  const tree = buildPermissionTree(permissions);

  const renderNode = (node) => (
    <li key={node.id} className="permission-tree-node">
      <div 
        className="permission-tree-node-label"
        onClick={() => onPermissionClick && onPermissionClick(node)}
      >
        <span className="permission-node-icon">
          {node.children && node.children.length > 0 ? '📁' : '📄'}
        </span>
        <span className="permission-node-name">{node.name}</span>
        <span className="permission-node-action">{node.action}</span>
        <span className="permission-node-resource">{node.resource}</span>
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="permission-tree-children">
          {node.children.map(child => renderNode(child))}
        </ul>
      )}
    </li>
  );

  return (
    <div className="permission-tree-container">
      <ul className="permission-tree-root">
        {tree.map(node => renderNode(node))}
      </ul>
    </div>
  );
};

PermissionTree.propTypes = {
  permissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      action: PropTypes.string,
      resource: PropTypes.string,
      parentId: PropTypes.string,
      children: PropTypes.array,
    })
  ),
  loading: PropTypes.bool,
  onPermissionClick: PropTypes.func,
};

PermissionTree.defaultProps = {
  permissions: [],
  loading: false,
  onPermissionClick: null,
};

export default PermissionTree;