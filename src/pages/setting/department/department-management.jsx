import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import "./css/department-management.css";
import { DepartmentService } from "../../../services/departmentService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DepartmentManagement = () => {
  const { t } = useTranslation("department");

  // Validation pulled into the component scope or executed with `t` reference
  const validateDepartment = (data) => {
    const errors = {};
    if (!data.departmentName?.trim())
      errors.departmentName = t("departmentManagement.validation.englishNameRequired");
    if (!data.departmentNameAr?.trim())
      errors.departmentNameAr = t("departmentManagement.validation.arabicNameRequired");
    if (!data.code?.trim()) 
      errors.code = t("departmentManagement.validation.codeRequired");
    return errors;
  };

  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    id: null,
    name: "",
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    departmentName: "",
    code: "",
    active: "",
  });
  const [modal, setModal] = useState({ open: false, mode: "add" });
  const [currentDept, setCurrentDept] = useState({
    departmentName: "",
    departmentNameAr: "",
    code: "",
    description: "",
    active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await DepartmentService.getDepartments();
      setDepartments(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(t("departmentManagement.messages.loadFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const filteredDepartments = useMemo(() => {
    return departments.filter((dept) => {
      const matchName = dept.departmentName
        ?.toLowerCase()
        .includes(searchParams.departmentName.toLowerCase());
      const matchCode = dept.code
        ?.toLowerCase()
        .includes(searchParams.code.toLowerCase());
      const matchActive =
        searchParams.active === "" ||
        String(dept.active) === searchParams.active;
      return matchName && matchCode && matchActive;
    });
  }, [departments, searchParams]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentDept((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const openModal = (mode, dept = null) => {
    setFormErrors({});
    if (mode === "add") {
      setCurrentDept({
        departmentName: "",
        departmentNameAr: "",
        code: "",
        description: "",
        active: true,
      });
    } else {
      setCurrentDept(dept);
    }
    setModal({ open: true, mode });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errors = validateDepartment(currentDept);
    if (Object.keys(errors).length > 0) return setFormErrors(errors);

    setSubmitting(true);
    try {
      if (modal.mode === "add") {
        await DepartmentService.createDepartment(currentDept);
        toast.success(t("departmentManagement.messages.createSuccess"));
      } else {
        await DepartmentService.updateDepartment(currentDept.id, currentDept);
        toast.success(t("departmentManagement.messages.updateSuccess"));
      }
      setModal({ open: false, mode: "add" });
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || t("departmentManagement.messages.saveError"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await DepartmentService.deleteDepartment(deleteConfirm.id);
      toast.success(t("departmentManagement.messages.deleteSuccess", { name: deleteConfirm.name }));
      setDeleteConfirm({ show: false, id: null, name: "" });
      fetchDepartments();
    } catch (err) {
      toast.error(t("departmentManagement.messages.deleteFailed"));
    }
  };

  return (
    <div className="dept-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="dept-header">
        <div>
          <h1>{t("departmentManagement.title")}</h1>
          <p>{t("departmentManagement.subtitle")}</p>
        </div>
        <button className="btn-primary" onClick={() => openModal("add")}>
          <span className="icon">+</span> {t("departmentManagement.addDepartment")}
        </button>
      </header>
      {error && (
        <div className="banner error">
          <span>{error}</span>
          <button className="close-banner" onClick={() => setError(null)}>
            &times;
          </button>
        </div>
      )}
      <section className="dept-search-section">
        <div className="search-group">
          <input
            placeholder={t("departmentManagement.searchByNamePlaceholder")}
            value={searchParams.departmentName}
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                departmentName: e.target.value,
              })
            }
          />
          <input
            placeholder={t("departmentManagement.searchByCodePlaceholder")}
            value={searchParams.code}
            onChange={(e) =>
              setSearchParams({ ...searchParams, code: e.target.value })
            }
          />
          <select
            value={searchParams.active}
            onChange={(e) =>
              setSearchParams({ ...searchParams, active: e.target.value })
            }
          >
            <option value="">{t("departmentManagement.allStatuses")}</option>
            <option value="true">{t("departmentManagement.activeOnly")}</option>
            <option value="false">{t("departmentManagement.inactiveOnly")}</option>
          </select>
        </div>
      </section>
      <div className="table-wrapper">
        <table className="dept-table">
          <thead>
            <tr>
              <th>{t("departmentManagement.sn")}</th>
              <th>{t("departmentManagement.code")}</th>
              <th>{t("departmentManagement.nameEn")}</th>
              <th>{t("departmentManagement.nameAr")}</th>
              <th>{t("departmentManagement.status")}</th>
              <th className="text-right">{t("departmentManagement.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(5)].map((_, i) => (
                  <tr key={`skeleton-${i}`} className="skeleton-row">
                    {[...Array(6)].map((_, colIdx) => (
                      <td key={colIdx}>
                        <div className="skeleton-line" style={{ width: "80px" }}></div>
                      </td>
                    ))}
                  </tr>
                ))
              : filteredDepartments.map((dept, index) => (
                  <tr key={dept.id || index}>
                    <td>{index + 1}</td>
                    <td>
                      <code className="code-tag">{dept.code}</code>
                    </td>
                    <td>{dept.departmentName}</td>
                    <td dir="rtl" className="arabic-text">
                      {dept.departmentNameAr}
                    </td>
                    <td>
                      <span className={`badge ${dept.active ? "active" : "inactive"}`}>
                        {dept.active ? t("departmentManagement.active") : t("departmentManagement.inactive")}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        className="btn-icon edit"
                        onClick={() => openModal("edit", dept)}
                      >
                        {t("departmentManagement.edit")}
                      </button>
                      <button
                        className="btn-icon delete"
                        onClick={() =>
                          setDeleteConfirm({
                            show: true,
                            id: dept.id,
                            name: dept.departmentName,
                          })
                        }
                      >
                        {t("departmentManagement.delete")}
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="modal-overlay">
          <div className="modal-content confirm-modal">
            <h3>{t("departmentManagement.deleteModal.title")}</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: t("departmentManagement.deleteModal.confirmation", {
                  name: deleteConfirm.name,
                }),
              }}
            />
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setDeleteConfirm({ show: false, id: null, name: "" })}
              >
                {t("departmentManagement.deleteModal.cancel")}
              </button>
              <button className="btn-danger" onClick={handleDelete}>
                {t("departmentManagement.deleteModal.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {modal.mode === "add"
                  ? t("departmentManagement.form.newDepartment")
                  : t("departmentManagement.form.editDepartment")}
              </h2>
              <button
                className="close-modal"
                onClick={() => setModal({ ...modal, open: false })}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className={`field ${formErrors.departmentName ? "has-error" : ""}`}>
                  <label>{t("departmentManagement.form.labelNameEn")}</label>
                  <input
                    name="departmentName"
                    value={currentDept.departmentName}
                    onChange={handleFormChange}
                    placeholder={t("departmentManagement.form.placeholderNameEn")}
                  />
                  {formErrors.departmentName && (
                    <span className="err-msg">{formErrors.departmentName}</span>
                  )}
                </div>
                <div className={`field ${formErrors.departmentNameAr ? "has-error" : ""}`}>
                  <label>{t("departmentManagement.form.labelNameAr")}</label>
                  <input
                    dir="rtl"
                    name="departmentNameAr"
                    value={currentDept.departmentNameAr}
                    onChange={handleFormChange}
                    placeholder={t("departmentManagement.form.placeholderNameAr")}
                  />
                  {formErrors.departmentNameAr && (
                    <span className="err-msg">{formErrors.departmentNameAr}</span>
                  )}
                </div>
                <div className={`field ${formErrors.code ? "has-error" : ""}`}>
                  <label>{t("departmentManagement.form.labelCode")}</label>
                  <input
                    name="code"
                    value={currentDept.code}
                    onChange={handleFormChange}
                    placeholder={t("departmentManagement.form.placeholderCode")}
                  />
                  {formErrors.code && (
                    <span className="err-msg">{formErrors.code}</span>
                  )}
                </div>
                <div className="field checkbox-field">
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="active"
                      checked={currentDept.active}
                      onChange={handleFormChange}
                    />
                    <span className="slider"></span>
                  </label>
                  <span>{t("departmentManagement.form.labelActiveStatus")}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setModal({ ...modal, open: false })}
                >
                  {t("departmentManagement.form.cancel")}
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? t("departmentManagement.form.saving")
                    : t("departmentManagement.form.saveChanges")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;