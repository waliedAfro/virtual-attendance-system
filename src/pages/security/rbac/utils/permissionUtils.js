export const buildPermissionTree = (permissions) => {
  // Assuming permissions have { id, name, parentId, resource, action }
  const map = {};
  const roots = [];
  permissions.forEach(p => {
    map[p.id] = { ...p, children: [] };
  });
  permissions.forEach(p => {
    if (p.parentId && map[p.parentId]) {
      map[p.parentId].children.push(map[p.id]);
    } else {
      roots.push(map[p.id]);
    }
  });
  return roots;
};

export const flattenPermissionTree = (tree) => {
  const result = [];
  const traverse = (node) => {
    result.push(node);
    if (node.children) {
      node.children.forEach(traverse);
    }
  };
  tree.forEach(traverse);
  return result;
};

export const groupPermissionsByResource = (permissions) => {
  const groups = {};
  permissions.forEach(p => {
    if (!groups[p.resource]) groups[p.resource] = [];
    groups[p.resource].push(p);
  });
  return groups;
};