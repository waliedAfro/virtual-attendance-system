// src/hooks/useRBAC.js
import { useState, useCallback } from 'react';
import { rbacService } from '../services/rbacService';

export const useRBAC = () => {
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [error, setError] = useState(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [rolesData, permsData, templatesData] = await Promise.all([
                rbacService.getRoles(),
                rbacService.getPermissions(),
                rbacService.getTemplates(),
            ]);
            setRoles(rolesData);
            setPermissions(permsData);
            setTemplates(templatesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const createRole = useCallback(async (data) => {
        setLoading(true);
        try {
            const newRole = await rbacService.createRole(data);
            setRoles((prev) => [...prev, newRole]);
            return newRole;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateRole = useCallback(async (id, data) => {
        setLoading(true);
        try {
            const updated = await rbacService.updateRole(id, data);
            setRoles((prev) => prev.map((r) => (r.id === id ? updated : r)));
            return updated;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteRole = useCallback(async (id) => {
        setLoading(true);
        try {
            await rbacService.deleteRole(id);
            setRoles((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const cloneRole = useCallback(async (id) => {
        setLoading(true);
        try {
            const cloned = await rbacService.cloneRole(id);
            setRoles((prev) => [...prev, cloned]);
            return cloned;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const compareRoles = useCallback((roleA, roleB) => {
        return rbacService.compareRoles(roleA, roleB);
    }, []);

    return {
        loading,
        roles,
        permissions,
        templates,
        error,
        fetchAll,
        createRole,
        updateRole,
        deleteRole,
        cloneRole,
        compareRoles,
    };
};

export default useRBAC;