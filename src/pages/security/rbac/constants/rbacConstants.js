export const PERMISSION_ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
};

export const RESOURCE_TYPES = {
  ROLE: 'role',
  PERMISSION: 'permission',
  USER: 'user',
  TEMPLATE: 'template',
};

export const ROLE_TYPES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
  GUEST: 'guest',
};

export const DEFAULT_ROLE_TEMPLATES = [
  { id: 'template-admin', name: 'Admin Template', description: 'Full access' },
  { id: 'template-viewer', name: 'Viewer Template', description: 'Read-only' },
];