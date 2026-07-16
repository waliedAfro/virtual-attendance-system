import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { ShiftService } from "../../../services/shiftService";
import "./css/shift-manager.css";

const ShiftSearch = () => {
  const { t } = useTranslation("shift");
  const navigate = useNavigate();
  
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;

  const SHIFT_TYPE_OPTIONS = [
    { value: "", label: t("shiftManagement.list.allTypes") },
    { value: "MORNING", label: t("shiftManagement.form.types.morning") },
    { value: "EVENING", label: t("shiftManagement.form.types.evening") },
    { value: "NIGHT", label: t("shiftManagement.form.types.night") },
    { value: "GENERAL", label: t("shiftManagement.form.types.general") },
    { value: "FLEXIBLE", label: t("shiftManagement.form.types.flexible") },
    { value: "ROTATIONAL", label: t("shiftManagement.form.types.rotational") },
  ];

  const fetchShifts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ShiftService.searchShifts({
        searchTerm: searchName,
        shiftType: searchType || "",
        page,
        size,
      });
      if (response.success) {
        setShifts(response.data.content);
        setTotalPages(response.data.totalPages);
      } else {
        setError(t("shiftManagement.form.notifications.errFetchGeneric"));
      }
    } catch (err) {
      setError(err.message || t("shiftManagement.form.notifications.errFetchGeneric"));
    } finally {
      setLoading(false);
    }
  }, [searchName, searchType, page, t]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  const handleSearch = () => {
    setPage(0);
    fetchShifts();
  };

  const handleReset = () => {
    setSearchName("");
    setSearchType("");
    setPage(0);
  };

  const formatTime = (timeStr) => timeStr?.substring(0, 5) || "";

  return (
    <div className="shift-manager">
      <h1 className="title">{t("shiftManagement.list.title")}</h1>

      {/* Search Section */}
      <div className="search-section card">
        <h2>{t("shiftManagement.list.searchTitle")}</h2>
        <div className="search-form">
          <div className="form-group">
            <label htmlFor="searchName">{t("shiftManagement.form.labels.shiftName")}</label>
            <input
              type="text"
              id="searchName"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder={t("shiftManagement.list.placeholderName")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="searchType">{t("shiftManagement.form.labels.shiftType")}</label>
            <select
              id="searchType"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              {SHIFT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="search-actions">
            <button onClick={handleSearch} className="btn btn-primary">
              {t("shiftAssignment.common.buttons.search")}
            </button>
            <button onClick={handleReset} className="btn btn-secondary">
              {t("shiftAssignment.common.buttons.reset")}
            </button>
            <button
              onClick={() => navigate("/settings/shift/new")}
              className="btn btn-success"
            >
              {t("shiftManagement.list.btnNewShift")}
            </button>
          </div>
        </div>
      </div>

      {/* Shifts List Section */}
      <div className="list-section card">
        <h2>{t("shiftManagement.list.listTitle")}</h2>
        {loading && <div className="loading">{t("shiftAssignment.common.labels.loading")}</div>}
        {error && <div className="alert error">{error}</div>}

        {!loading && shifts.length === 0 && (
          <div className="no-data">
            {t("shiftManagement.list.noShiftsFound")}
          </div>
        )}

        {shifts.length > 0 && (
          <>
            <div className="table-responsive">
              <table className="shifts-table">
                <thead>
                  <tr>
                    <th>{t("shiftManagement.list.table.name")}</th>
                    <th>{t("shiftManagement.list.table.type")}</th>
                    <th>{t("shiftManagement.list.table.start")}</th>
                    <th>{t("shiftManagement.list.table.end")}</th>
                    <th>{t("shiftManagement.list.table.crossDay")}</th>
                    <th>{t("shiftManagement.list.table.working")}</th>
                    <th>{t("shiftManagement.list.table.grace")}</th>
                    <th>{t("shiftManagement.list.table.break")}</th>
                    <th>{t("shiftManagement.list.table.overtime")}</th>
                    <th>{t("shiftManagement.list.table.flexible")}</th>
                    <th>{t("shiftManagement.list.table.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift) => (
                    <tr key={shift.shiftId}>
                      <td>{shift.shiftName}</td>
                      <td>
                        {t(`shiftManagement.form.types.${shift.shiftType?.toLowerCase()}`)}
                      </td>
                      <td>{formatTime(shift.startTime)}</td>
                      <td>{formatTime(shift.endTime)}</td>
                      <td>
                        {shift.crossDay 
                          ? t("shiftManagement.form.previews.yes") 
                          : "—"}
                      </td>
                      <td>{shift.workingMinutes}</td>
                      <td>{shift.gracePeriodMinutes}</td>
                      <td>{shift.breakMinutes}</td>
                      <td>
                        {shift.overtimeAllowed
                          ? `${t("shiftManagement.form.previews.yes")} (max ${shift.maxOvertimeMinutes})`
                          : t("shiftManagement.form.previews.no")}
                      </td>
                      <td>
                        {shift.flexibleStart
                          ? `±${shift.earlyCheckinMinutes}/${shift.lateCheckoutMinutes}`
                          : t("shiftManagement.form.previews.no")}
                      </td>
                      <td>
                        <Link
                          to={`/settings/shift/${shift.shiftId}`}
                          className="btn-link"
                        >
                          {t("shiftAssignment.common.buttons.edit")}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  {t("shiftAssignment.search.pagination.previous")}
                </button>
                <span>
                  {t("shiftAssignment.search.pagination.pageInfo", { current: page + 1, total: totalPages })}
                </span>
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t("shiftAssignment.search.pagination.next")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShiftSearch;