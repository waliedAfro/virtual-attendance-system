import React from 'react';
import { buildPermissionTree } from '../../utils/permissionUtils';
import './PermissionSelector.css';

const PermissionSelector = ({ permissions, selectedIds, onChange }) => {
  const tree = buildPermissionTree(permissions);

  const togglePermission = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(pid => pid !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const renderNode = (node) => (
    <li key={node.id}>
      <label>
        <input
          type="checkbox"
          checked={selectedIds.includes(node.id)}
          onChange={() => togglePermission(node.id)}
        />
        {node.name}
      </label>
      {node.children && node.children.length > 0 && (
        <ul>{node.children.map(child => renderNode(child))}</ul>
      )}
    </li>
  );

  return (
    <div className="permission-selector">
      <ul className="permission-tree">
        {tree.map(node => renderNode(node))}
      </ul>
    </div>
  );
};

export default PermissionSelector;