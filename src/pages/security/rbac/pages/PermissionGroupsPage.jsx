import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
// import { usePermissions } from '../hooks/usePermissions';

import PageHeader from "../../../../component/common/PageHeader";
import * as permissionApi from "../api/permissionApi";
import "./../css/permissionGroupManager.css";

const PermissionGroupsPage = () => {
  const { t } = useTranslation("rbac");

  // --- State matching PermissionGroupForm ---
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Main group DTO
  const [group, setGroup] = useState({
    groupCode: "",
    groupName: "",
    groupNameAr: "",
    module: "",
    moduleAr: "",
    icon: "",
    displayOrder: 0,
    description: "",
    color: "#3b82f6",
    permission: [], // list of PermissionRequestDTO
  });

  // Temporary permission being drafted
  const [currentPermission, setCurrentPermission] = useState({
    permissionCode: "",
    permissionName: "",
    permissionNameAr: "",
    description: "",
    module: "",
    displayOrder: 0,
    active: true,
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // --- Fetch groups ---
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await permissionApi.getPermissionGroups();
      setGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // --- Handlers for main group fields ---
  const handleGroupChange = (e) => {
    const { name, value, type } = e.target;
    setGroup((prev) => ({
      ...prev,
      [name]:
        type === "number" || name === "displayOrder"
          ? parseInt(value, 10) || 0
          : value,
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // --- Handlers for draft permission fields ---
  const handlePermissionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentPermission((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "displayOrder"
            ? parseInt(value, 10) || 0
            : value,
    }));
  };

  // Add drafted permission to group.permission list
  const addPermission = () => {
    if (!currentPermission.permissionCode.trim()) {
      alert(t("rbac.permissionGroups.permissionCodeRequired"));
      return;
    }
    setGroup((prev) => ({
      ...prev,
      permission: [...prev.permission, { ...currentPermission }],
    }));
    // Reset draft form
    setCurrentPermission({
      permissionCode: "",
      permissionName: "",
      permissionNameAr: "",
      description: "",
      module: "",
      displayOrder: 0,
      active: true,
    });
  };

  // Remove a permission from the list by index
  const removePermission = (indexToRemove) => {
    setGroup((prev) => ({
      ...prev,
      permission: prev.permission.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // --- Form validation (matching the provided logic) ---
  const validateForm = () => {
    const tempErrors = {};

    if (!group.groupCode.trim())
      tempErrors.groupCode = t("rbac.permissionGroups.requiredGroupCode");
    else if (group.groupCode.length > 50)
      tempErrors.groupCode = t("rbac.permissionGroups.maxLength50");

    if (!group.groupName.trim())
      tempErrors.groupName = t("rbac.permissionGroups.requiredGroupName");
    else if (group.groupName.length > 100)
      tempErrors.groupName = t("rbac.permissionGroups.maxLength100");

    if (!group.groupNameAr.trim())
      tempErrors.groupNameAr = t("rbac.permissionGroups.requiredGroupNameAr");
    else if (group.groupNameAr.length > 100)
      tempErrors.groupNameAr = t("rbac.permissionGroups.maxLength100");

    if (group.module && group.module.length > 50)
      tempErrors.module = t("rbac.permissionGroups.maxLength50");
    if (group.moduleAr && group.moduleAr.length > 50)
      tempErrors.moduleAr = t("rbac.permissionGroups.maxLength50");
    if (group.icon && group.icon.length > 50)
      tempErrors.icon = t("rbac.permissionGroups.maxLength50");
    if (group.displayOrder === undefined || group.displayOrder === null) {
      tempErrors.displayOrder = t("rbac.permissionGroups.requiredDisplayOrder");
    }
    if (group.description && group.description.length > 500)
      tempErrors.description = t("rbac.permissionGroups.maxLength500");
    if (group.color && group.color.length > 20)
      tempErrors.color = t("rbac.permissionGroups.maxLength20");

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // --- Submit (create or update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert(t("rbac.permissionGroups.fixErrors"));
      return;
    }

    try {
      if (editingId || group.permissionGroupId ) {
        await permissionApi.updatePermissionGroup(editingId, group);
      } else {
        await permissionApi.createPermissionGroup(group);
      }
      resetForm();
      fetchGroups();
    } catch (error) {
      console.error("Error saving group:", error);
      alert(t("rbac.permissionGroups.saveError"));
    }
  };

  // --- Reset form ---
  const resetForm = () => {
    setGroup({
      groupCode: "",
      groupName: "",
      groupNameAr: "",
      module: "",
      moduleAr: "",
      icon: "",
      displayOrder: 0,
      description: "",
      color: "#3b82f6",
      permission: [],
    });
    setCurrentPermission({
      permissionCode: "",
      permissionName: "",
      permissionNameAr: "",
      description: "",
      module: "",
      displayOrder: 0,
      active: true,
    });
    setEditingId(null);
    setErrors({});
  };

  // --- Edit: populate form from selected group ---
  const handleEdit = (groupToEdit) => {
    setGroup({
      groupCode: groupToEdit.groupCode || "",
      groupName: groupToEdit.groupName || "",
      groupNameAr: groupToEdit.groupNameAr || "",
      module: groupToEdit.module || "",
      moduleAr: groupToEdit.moduleAr || "",
      icon: groupToEdit.icon || "",
      displayOrder: groupToEdit.displayOrder || 0,
      description: groupToEdit.description || "",
      color: groupToEdit.color || "#3b82f6",
      // Ensure permission array contains full objects (as returned by API)
      permission: Array.isArray(groupToEdit.permission)
        ? groupToEdit.permission
        : [],
    });
    setEditingId(groupToEdit.permissionGroupId);
    // Scroll to form
    document
      .querySelector(".pg-form-wrapper")
      .scrollIntoView({ behavior: "smooth" });
  };

  // --- Delete ---
  const handleDelete = async (id) => {
    if (!window.confirm(t("rbac.permissionGroups.confirmDelete"))) return;
    try {
      await permissionApi.deletePermissionGroup(id);
      fetchGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  return (
    <div className="permission-groups-page pg-container">
      <PageHeader
        title={t("rbac.permissionGroups.title")}
        subtitle={t("rbac.permissionGroups.subtitle")}
      >
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            document
              .querySelector(".pg-form-wrapper")
              .scrollIntoView({ behavior: "smooth" });
          }}
        >
          {t("rbac.permissionGroups.createNew")}
        </button>
      </PageHeader>

      {/* --- Form Section --- */}
      <div className="pg-form-wrapper">
        <h2>
          {editingId
            ? t("rbac.permissionGroups.editGroup")
            : t("rbac.permissionGroups.createGroup")}
        </h2>

        <form onSubmit={handleSubmit} className="pg-form">
          {/* 1. Group Identity */}
          <div className="pg-form-section">
            <h3>{t("rbac.permissionGroups.groupIdentity")}</h3>
            <div className="form-row">
              <label>{t("rbac.permissionGroups.groupCode")} *</label>
              <input
                type="text"
                name="groupCode"
                value={group.groupCode}
                onChange={handleGroupChange}
                maxLength="50"
                className={errors.groupCode ? "error" : ""}
              />
              {errors.groupCode && (
                <span className="error-text">{errors.groupCode}</span>
              )}
            </div>
            <div className="form-row">
              <label>{t("rbac.permissionGroups.groupName")} *</label>
              <input
                type="text"
                name="groupName"
                value={group.groupName}
                onChange={handleGroupChange}
                maxLength="100"
                className={errors.groupName ? "error" : ""}
              />
              {errors.groupName && (
                <span className="error-text">{errors.groupName}</span>
              )}
            </div>
            <div className="form-row">
              <label>{t("rbac.permissionGroups.groupNameAr")} *</label>
              <input
                type="text"
                name="groupNameAr"
                value={group.groupNameAr}
                onChange={handleGroupChange}
                maxLength="100"
                dir="rtl"
                className={errors.groupNameAr ? "error" : ""}
              />
              {errors.groupNameAr && (
                <span className="error-text">{errors.groupNameAr}</span>
              )}
            </div>
          </div>

          {/* 2. Module & Aesthetics */}
          <div className="pg-form-section">
            <h3>{t("rbac.permissionGroups.moduleSettings")}</h3>
            <div className="form-row">
              <label>{t("rbac.permissionGroups.module")}</label>
              <input
                type="text"
                name="module"
                value={group.module}
                onChange={handleGroupChange}
                maxLength="50"
              />
            </div>
            <div className="form-row">
              <label>{t("rbac.permissionGroups.moduleAr")}</label>
              <input
                type="text"
                name="moduleAr"
                value={group.moduleAr}
                onChange={handleGroupChange}
                maxLength="50"
                dir="rtl"
              />
            </div>
            <div className="form-row">
              <label>{t("rbac.permissionGroups.displayOrder")} *</label>
              <input
                type="number"
                name="displayOrder"
                value={group.displayOrder}
                onChange={handleGroupChange}
                className={errors.displayOrder ? "error" : ""}
              />
              {errors.displayOrder && (
                <span className="error-text">{errors.displayOrder}</span>
              )}
            </div>
            <div className="form-row">
              <label>{t("rbac.permissionGroups.icon")}</label>
              <input
                type="text"
                name="icon"
                value={group.icon}
                onChange={handleGroupChange}
                maxLength="50"
                placeholder="fa-users"
              />
            </div>
            <div className="form-row">
              <label>{t("rbac.permissionGroups.color")}</label>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <input
                  type="color"
                  name="color"
                  value={group.color}
                  onChange={handleGroupChange}
                  style={{ width: "50px", padding: 0 }}
                />
                <input
                  type="text"
                  name="color"
                  value={group.color}
                  onChange={handleGroupChange}
                  maxLength="20"
                  style={{ flex: 1 }}
                />
              </div>
            </div>
            <div className="form-row">
              <label>{t("rbac.permissionGroups.description")}</label>
              <textarea
                name="description"
                rows="3"
                value={group.description}
                onChange={handleGroupChange}
                maxLength="500"
              />
              {errors.description && (
                <span className="error-text">{errors.description}</span>
              )}
            </div>
          </div>

          {/* 3. Dynamic Permissions */}
          <div className="pg-form-section">
            <h3>{t("rbac.permissionGroups.definePermissions")}</h3>

            {/* Draft permission inputs */}
            <div className="permission-draft-box">
              <h4>{t("rbac.permissionGroups.addPermissionRow")}</h4>
              <div className="form-row-grid">
                <div className="form-row">
                  <label>{t("rbac.permissionGroups.permissionCode")}</label>
                  <input
                    type="text"
                    name="permissionCode"
                    value={currentPermission.permissionCode}
                    onChange={handlePermissionChange}
                    placeholder="CREATE_USER"
                  />
                </div>
                <div className="form-row">
                  <label>{t("rbac.permissionGroups.permissionName")}</label>
                  <input
                    type="text"
                    name="permissionName"
                    value={currentPermission.permissionName}
                    onChange={handlePermissionChange}
                  />
                </div>
                <div className="form-row">
                  <label>{t("rbac.permissionGroups.permissionNameAr")}</label>
                  <input
                    type="text"
                    name="permissionNameAr"
                    value={currentPermission.permissionNameAr}
                    onChange={handlePermissionChange}
                    dir="rtl"
                  />
                </div>
                <div className="form-row">
                  <label>{t("rbac.permissionGroups.permissionModule")}</label>
                  <input
                    type="text"
                    name="module"
                    value={currentPermission.module}
                    onChange={handlePermissionChange}
                  />
                </div>
                <div className="form-row">
                  <label>{t("rbac.permissionGroups.permissionOrder")}</label>
                  <input
                    type="number"
                    name="displayOrder"
                    value={currentPermission.displayOrder}
                    onChange={handlePermissionChange}
                  />
                </div>
                <div className="form-row" style={{ justifyContent: "center" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="active"
                      checked={currentPermission.active}
                      onChange={handlePermissionChange}
                    />
                    {t("rbac.permissionGroups.active")}
                  </label>
                </div>
              </div>
              <div className="form-row">
                <label>
                  {t("rbac.permissionGroups.permissionDescription")}
                </label>
                <input
                  type="text"
                  name="description"
                  value={currentPermission.description}
                  onChange={handlePermissionChange}
                />
              </div>
              <button
                type="button"
                onClick={addPermission}
                className="btn-add-permission"
              >
                + {t("rbac.permissionGroups.addToList")}
              </button>
            </div>

            {/* Permission table */}
            {group.permission.length > 0 ? (
              <table className="pg-table">
                <thead>
                  <tr>
                    <th>{t("rbac.permissionGroups.permissionCode")}</th>
                    <th>{t("rbac.permissionGroups.permissionName")}</th>
                    <th>{t("rbac.permissionGroups.permissionModule")}</th>
                    <th>{t("rbac.permissionGroups.permissionOrder")}</th>
                    <th>{t("rbac.permissionGroups.active")}</th>
                    <th>{t("rbac.permissionGroups.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {group.permission.map((p, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{p.permissionCode}</strong>
                      </td>
                      <td>{p.permissionName || "-"}</td>
                      <td>{p.module || "-"}</td>
                      <td>{p.displayOrder}</td>
                      <td>{p.active ? "✅" : "❌"}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removePermission(idx)}
                          className="btn-remove-permission"
                        >
                          {t("rbac.common.remove")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-permissions-box">
                {t("rbac.permissionGroups.noPermissionsAdded")}
              </div>
            )}
          </div>

          {/* Form actions */}
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {editingId
                ? t("rbac.permissionGroups.update")
                : t("rbac.permissionGroups.create")}
            </button>
            <button type="button" onClick={resetForm} className="btn-cancel">
              {t("rbac.permissionGroups.cancel")}
            </button>
          </div>
        </form>
      </div>

      {/* --- Table Listing --- */}
      <div className="pg-list-wrapper">
        <h2>{t("rbac.permissionGroups.listTitle")}</h2>
        {loading ? (
          <p>{t("rbac.common.loading")}</p>
        ) : (
          <table className="pg-table">
            <thead>
              <tr>
                <th>{t("rbac.permissionGroups.groupCode")}</th>
                <th>{t("rbac.permissionGroups.groupName")}</th>
                <th>{t("rbac.permissionGroups.groupNameAr")}</th>
                <th>{t("rbac.permissionGroups.module")}</th>
                <th>{t("rbac.permissionGroups.displayOrder")}</th>
                <th>{t("rbac.permissionGroups.color")}</th>
                <th>{t("rbac.permissionGroups.permissions")}</th>
                <th>{t("rbac.permissionGroups.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(groups) &&
                groups.map((g) => (
                  <tr key={g.id}>
                    <td>{g.groupCode}</td>
                    <td>{g.groupName}</td>
                    <td>{g.groupNameAr}</td>
                    <td>{g.module}</td>
                    <td>{g.displayOrder}</td>
                    <td>
                      <span
                        style={{
                          backgroundColor: g.color,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "4px",
                        }}
                      >
                        {g.color}
                      </span>
                    </td>
                    <td>
                      {g.permission && g.permission.length > 0
                        ? g.permission.map((p) => p.permissionName).join(", ")
                        : "—"}
                    </td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(g)}
                      >
                        {t("rbac.common.edit")}
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(g.id)}
                      >
                        {t("rbac.common.delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              {groups.length === 0 && (
                <tr>
                  <td colSpan="8">{t("rbac.permissionGroups.noGroups")}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PermissionGroupsPage;
