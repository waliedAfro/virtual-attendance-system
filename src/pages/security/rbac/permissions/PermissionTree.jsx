import React from 'react';
import { buildPermissionTree } from '../../utils/permissionUtils';
import './PermissionTree.css';

const PermissionTree = ({ permissions, loading }) => {
  if (loading) return <div>Loading permissions...</div>;
  const tree = buildPermissionTree(permissions);

  const renderNode = (node) => (
    <li key={node.id}>
      <span>{node.name}</span>
      {node.children && node.children.length > 0 && (
        <ul>{node.children.map(child => renderNode(child))}</ul>
      )}
    </li>
  );

  return (
    <ul className="permission-tree">
      {tree.map(node => renderNode(node))}
    </ul>
  );
};

export default PermissionTree;