// types/access.ts
export interface Permission {
  permissionId: string;
  permissionCode: string;
  permissionName: string;
  resourceName: string | null;
  description: string | null;
}

export interface RoleTemplate {
  roleTemplateId: string;
  roleCode: string;          // e.g. "TENANT_ADMIN"
  roleName: string;
  systemRole: boolean;
  description: string | null;
  roleTemplatePermissions: RoleTemplatePermission[];
}

export interface RoleTemplatePermission {
  id: string;
  permission: Permission;
}

export interface Role {
  roleId: string;
  tenantId: string;
  roleTemplate: RoleTemplate | null;   // non‑null if not custom
  customName: string | null;           // non‑null if custom
  isCustom: boolean;
  // for custom roles, permissions are fetched separately via RolePermission
}

export interface RolePermission {
  id: string;
  permission: Permission;
}

export interface UserRole {
  userRoleId: string;
  tenantId: string;
  userId: string;
  role: Role;
}