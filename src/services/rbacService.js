// src/services/rbacService.js
import { roleApi } from '../api/roleApi';

class RBACService {
    async getRoles() {
        return await roleApi.getRoles();
    }

    async getRole(id) {
        return await roleApi.getRole(id);
    }

    async createRole(data) {
        return await roleApi.createRole(data);
    }

    async updateRole(id, data) {
        return await roleApi.updateRole(id, data);
    }

    async deleteRole(id) {
        return await roleApi.deleteRole(id);
    }

    async getPermissions() {
        return await roleApi.getAllPermissions();
    }

    async getTemplates() {
        return await roleApi.getTemplates();
    }

    async getTemplate(id) {
        return await roleApi.getTemplate(id);
    }

    async cloneRole(id) {
        return await roleApi.cloneRole(id);
    }

    async assignPermissions(roleId, permissionIds) {
        return await roleApi.assignPermissions(roleId, permissionIds);
    }

    async removePermission(roleId, permissionId) {
        return await roleApi.removePermission(roleId, permissionId);
    }

    async getPermissionMatrix() {
        return await roleApi.getPermissionMatrix();
    }

    // Advanced: Permission Dependency Engine
    getDependencies(permissionId, allPermissions) {
        const perm = allPermissions.find((p) => p.id === permissionId);
        if (!perm || !perm.dependsOn) return [];
        return perm.dependsOn.map((depId) => allPermissions.find((p) => p.id === depId)).filter(Boolean);
    }

    getRequiredPermissions(permissionIds, allPermissions) {
        const result = new Set();
        const queue = [...permissionIds];
        while (queue.length > 0) {
            const id = queue.shift();
            if (result.has(id)) continue;
            result.add(id);
            const deps = this.getDependencies(id, allPermissions);
            deps.forEach((dep) => {
                if (!result.has(dep.id)) queue.push(dep.id);
            });
        }
        return Array.from(result);
    }

    // Advanced: Role Comparison
    compareRoles(roleA, roleB) {
        const permsA = new Set((roleA.permissions || []).map((p) => p.id));
        const permsB = new Set((roleB.permissions || []).map((p) => p.id));

        const added = [...permsB].filter((id) => !permsA.has(id));
        const removed = [...permsA].filter((id) => !permsB.has(id));
        const common = [...permsA].filter((id) => permsB.has(id));

        return { added, removed, common };
    }
}

export const rbacService = new RBACService();
export default rbacService;