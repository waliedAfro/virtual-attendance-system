// src/api/roleApi.js
const API_BASE = '/api/v1';

// Mock data for development
const mockRoles = [
    { id: '1', name: 'Tenant Admin', isCustom: false, userCount: 2, permissionCount: 84, status: 'Active' },
    { id: '2', name: 'HR Manager', isCustom: true, userCount: 6, permissionCount: 28, status: 'Active' },
    { id: '3', name: 'Finance', isCustom: true, userCount: 3, permissionCount: 14, status: 'Active' },
    { id: '4', name: 'Supervisor', isCustom: false, userCount: 8, permissionCount: 18, status: 'Active' },
];

const mockPermissions = [
    { id: 'p1', resource: 'Dashboard', name: 'View Dashboard', code: 'DASHBOARD_VIEW', action: 'View' },
    { id: 'p2', resource: 'Dashboard', name: 'Export Dashboard', code: 'DASHBOARD_EXPORT', action: 'Export' },
    { id: 'p3', resource: 'Employee', name: 'Create Employee', code: 'EMPLOYEE_CREATE', action: 'Create' },
    { id: 'p4', resource: 'Employee', name: 'Update Employee', code: 'EMPLOYEE_UPDATE', action: 'Edit' },
    { id: 'p5', resource: 'Employee', name: 'Delete Employee', code: 'EMPLOYEE_DELETE', action: 'Delete' },
    { id: 'p6', resource: 'Employee', name: 'View Employee', code: 'EMPLOYEE_VIEW', action: 'View' },
    { id: 'p7', resource: 'Attendance', name: 'Check-In', code: 'ATTENDANCE_CHECKIN', action: 'Create' },
    { id: 'p8', resource: 'Attendance', name: 'Approve', code: 'ATTENDANCE_APPROVE', action: 'Edit' },
    { id: 'p9', resource: 'Attendance', name: 'Edit', code: 'ATTENDANCE_EDIT', action: 'Edit' },
    { id: 'p10', resource: 'Attendance', name: 'Export', code: 'ATTENDANCE_EXPORT', action: 'Export' },
    { id: 'p11', resource: 'Payroll', name: 'View', code: 'PAYROLL_VIEW', action: 'View' },
    { id: 'p12', resource: 'Payroll', name: 'Generate', code: 'PAYROLL_GENERATE', action: 'Create' },
    { id: 'p13', resource: 'Payroll', name: 'Approve', code: 'PAYROLL_APPROVE', action: 'Edit' },
    { id: 'p14', resource: 'Reports', name: 'View Reports', code: 'REPORTS_VIEW', action: 'View' },
    { id: 'p15', resource: 'Reports', name: 'Export Reports', code: 'REPORTS_EXPORT', action: 'Export' },
];

const mockTemplates = [
    { id: 't1', name: 'Tenant Admin', permissionCount: 84 },
    { id: 't2', name: 'HR Manager', permissionCount: 32 },
    { id: 't3', name: 'Finance', permissionCount: 20 },
    { id: 't4', name: 'Supervisor', permissionCount: 18 },
];

// Simulate API delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const roleApi = {
    // Roles
    async getRoles() {
        await delay();
        return [...mockRoles];
    },

    async getRole(id) {
        await delay();
        const role = mockRoles.find((r) => r.id === id);
        if (!role) throw new Error('Role not found');
        return {
            ...role,
            permissions: mockPermissions.map((p) => ({
                ...p,
                assigned: Math.random() > 0.5,
            })),
        };
    },

    async createRole(data) {
        await delay();
        const newRole = {
            id: String(Date.now()),
            name: data.name,
            description: data.description || '',
            isCustom: data.isCustom !== false,
            userCount: 0,
            permissionCount: 0,
            status: 'Active',
            ...data,
        };
        mockRoles.push(newRole);
        return newRole;
    },

    async updateRole(id, data) {
        await delay();
        const index = mockRoles.findIndex((r) => r.id === id);
        if (index === -1) throw new Error('Role not found');
        mockRoles[index] = { ...mockRoles[index], ...data };
        return mockRoles[index];
    },

    async deleteRole(id) {
        await delay();
        const index = mockRoles.findIndex((r) => r.id === id);
        if (index === -1) throw new Error('Role not found');
        mockRoles.splice(index, 1);
        return { success: true };
    },

    // Permissions
    async getAllPermissions() {
        await delay();
        return [...mockPermissions];
    },

    // Templates
    async getTemplates() {
        await delay();
        return [...mockTemplates];
    },

    async getTemplate(id) {
        await delay();
        const template = mockTemplates.find((t) => t.id === id);
        if (!template) throw new Error('Template not found');
        return {
            ...template,
            permissions: mockPermissions.slice(0, template.permissionCount),
        };
    },

    // Clone
    async cloneRole(id) {
        await delay();
        const role = mockRoles.find((r) => r.id === id);
        if (!role) throw new Error('Role not found');
        const cloned = {
            ...role,
            id: String(Date.now()),
            name: `${role.name} (Clone)`,
            isCustom: true,
            userCount: 0,
        };
        mockRoles.push(cloned);
        return cloned;
    },

    // Assign permissions
    async assignPermissions(roleId, permissionIds) {
        await delay();
        // In a real implementation, this would update the role's permissions
        return { success: true, assigned: permissionIds };
    },

    async removePermission(roleId, permissionId) {
        await delay();
        return { success: true };
    },

    // Permission matrix
    async getPermissionMatrix() {
        await delay();
        return mockPermissions.map((p) => ({
            ...p,
            roles: mockRoles.map((r) => ({
                roleId: r.id,
                assigned: Math.random() > 0.5,
            })),
        }));
    },
};