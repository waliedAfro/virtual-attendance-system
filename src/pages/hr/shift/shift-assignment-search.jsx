import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { ShiftAssignmentService } from "../../../services/shiftAssignmentService";
import { ShiftService } from "../../../services/shiftService";
import "./css/shift-assignment.css";

const ShiftAssignmentSearch = () => {
  const { t } = useTranslation("shift");
  const navigate = useNavigate();

  // Data states
  const [assignments, setAssignments] = useState([]);
  const [shifts, setShifts] = useState([]);

  // UI states
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingShifts, setLoadingShifts] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [searchUserId, setSearchUserId] = useState("");
  const [searchShiftId, setSearchShiftId] = useState("");
  const [searchStartDateFrom, setSearchStartDateFrom] = useState("");
  const [searchStartDateTo, setSearchStartDateTo] = useState("");
  const [searchActiveOnly, setSearchActiveOnly] = useState(true);

  // Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Debounce timer for searchUserId
  const debounceTimer = useRef(null);

  // Fetch assignments with current filters + pagination
  const fetchAssignments = useCallback(async () => {
    setLoadingAssignments(true);
    setError("");
    try {
      const searchParams = {
        search: searchUserId || "",
        shiftId: searchShiftId || "",
        fromDate: searchStartDateFrom || "",
        toDate: searchStartDateTo || "",
        active: searchActiveOnly,
      };
      const res = await ShiftAssignmentService.searchShiftAssign(searchParams, {
        page,
        size,
      });
      setAssignments(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error(err);
      setError(t("shiftAssignment.common.notifications.errLoadAssignment"));
    } finally {
      setLoadingAssignments(false);
    }
  }, [searchUserId, searchShiftId, searchStartDateFrom, searchStartDateTo, searchActiveOnly, page, size, t]);

  // Debounced search when userId changes
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (page !== 0) setPage(0);
      else fetchAssignments();
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchUserId, fetchAssignments, page]);

  // Trigger fetch when other filters change
  useEffect(() => {
    if (page !== 0) setPage(0);
    else fetchAssignments();
  }, [searchShiftId, searchStartDateFrom, searchStartDateTo, searchActiveOnly]);

  // Fetch all shifts for dropdown
  const fetchShifts = useCallback(async () => {
    setLoadingShifts(true);
    try {
      const res = await ShiftService.getSearch();
      setShifts(res.data || []);
    } catch (err) {
      console.error(err);
      setError(t("shiftAssignment.common.notifications.errLoadShifts"));
    } finally {
      setLoadingShifts(false);
    }
  }, [t]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  // Reset all filters to initial state
  const resetFilters = () => {
    setSearchUserId("");
    setSearchShiftId("");
    setSearchStartDateFrom("");
    setSearchStartDateTo("");
    setSearchActiveOnly(true);
    setPage(0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString();
  };

  // Pagination handlers
  const totalPages = Math.ceil(totalElements / size);
  const canGoPrev = page > 0;
  const canGoNext = (page + 1) * size < totalElements;

  const handlePageSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(0);
  };

  return (
    <div className="shift-assignment-manager">
      <div className="card">
        <div className="card-header">
          <h2>{t("shiftAssignment.search.title")}</h2>
          <button
            onClick={() => navigate("/shift-assignment/new")}
            className="btn btn-primary"
          >
            {t("shiftAssignment.search.btnNewAssignment")}
          </button>
        </div>

        <div className="search-form">
          <div className="form-row">
            <div className="form-group">
              <label>{t("shiftAssignment.common.labels.userId")}</label>
              <input
                type="text"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                placeholder={t("shiftAssignment.search.placeholderUserId")}
              />
            </div>
            <div className="form-group">
              <label>{t("shiftAssignment.common.labels.shift")}</label>
              <select
                value={searchShiftId}
                onChange={(e) => setSearchShiftId(e.target.value)}
                disabled={loadingShifts}
              >
                <option value="">{t("shiftAssignment.search.allShifts")}</option>
                {loadingShifts && <option disabled>{t("shiftAssignment.common.labels.loading")}</option>}
                {!loadingShifts &&
                  shifts.map((s) => (
                    <option key={s.shiftId} value={s.shiftId}>
                      {s.shiftName}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t("shiftAssignment.common.labels.startDate")}</label>
              <input
                type="date"
                value={searchStartDateFrom}
                onChange={(e) => setSearchStartDateFrom(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t("shiftAssignment.common.labels.endDate")}</label>
              <input
                type="date"
                value={searchStartDateTo}
                onChange={(e) => setSearchStartDateTo(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row checkbox-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={searchActiveOnly}
                onChange={(e) => setSearchActiveOnly(e.target.checked)}
              />
              {t("shiftAssignment.common.labels.activeOnly")}
            </label>
          </div>

          <div className="search-actions">
            <button onClick={() => fetchAssignments()} className="btn btn-primary">
              {t("shiftAssignment.common.buttons.search")}
            </button>
            <button onClick={resetFilters} className="btn btn-secondary">
              {t("shiftAssignment.common.buttons.reset")}
            </button>
          </div>
        </div>

        {error && <div className="alert error">{error}</div>}

        {loadingAssignments && <div className="loading">{t("shiftAssignment.search.loadingAssignments")}</div>}

        {!loadingAssignments && assignments.length === 0 && !error && (
          <div className="no-data">{t("shiftAssignment.search.noAssignmentsFound")}</div>
        )}

        {assignments.length > 0 && (
          <>
            <div className="table-responsive">
              <table className="assignments-table">
                <thead>
                  <tr>
                    <th>{t("shiftAssignment.common.labels.user")}</th>
                    <th>{t("shiftAssignment.common.labels.shift")}</th>
                    <th>{t("shiftAssignment.common.labels.startDate")}</th>
                    <th>{t("shiftAssignment.common.labels.endDate")}</th>
                    <th>{t("shiftAssignment.common.labels.active")}</th>
                    <th>{t("shiftAssignment.common.labels.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr key={a.id}>
                      <td>{a.user?.fullName || a.user?.username || "—"}</td>
                      <td>{a.shift?.shiftName || "—"}</td>
                      <td>{formatDate(a.startDate)}</td>
                      <td>{formatDate(a.endDate)}</td>
                      <td>
                        <span className={`status-badge ${a.active ? "active" : "inactive"}`}>
                          {a.active ? t("shiftAssignment.common.status.active") : t("shiftAssignment.common.status.inactive")}
                        </span>
                      </td>
                      <td>
                        <Link to={`/shift-assignment/${a.id}/edit`} className="btn btn-secondary btn-sm">
                          {t("shiftAssignment.common.buttons.edit")}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls">
              <div className="pagination-buttons">
                <button onClick={() => setPage(0)} disabled={!canGoPrev} className="btn btn-secondary">
                  {t("shiftAssignment.search.pagination.first")}
                </button>
                <button onClick={() => setPage(page - 1)} disabled={!canGoPrev} className="btn btn-secondary">
                  {t("shiftAssignment.search.pagination.previous")}
                </button>
                <span className="pagination-info">
                  {t("shiftAssignment.search.pagination.pageInfo", { current: page + 1, total: totalPages || 1 })}
                </span>
                <button onClick={() => setPage(page + 1)} disabled={!canGoNext} className="btn btn-secondary">
                  {t("shiftAssignment.search.pagination.next")}
                </button>
                <button onClick={() => setPage(totalPages - 1)} disabled={!canGoNext} className="btn btn-secondary">
                  {t("shiftAssignment.search.pagination.last")}
                </button>
              </div>
              <div className="page-size-selector">
                <label>{t("shiftAssignment.search.pagination.show")}</label>
                <select value={size} onChange={handlePageSizeChange}>
                  {[5, 10, 20, 50].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span>{t("shiftAssignment.search.pagination.entries")}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShiftAssignmentSearch;