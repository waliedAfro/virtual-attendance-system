import React, { useState, useEffect, useCallback } from "react";
import "./css/attendance-report.css";
import { Download, Search, Users, Clock, CheckCircle, X } from "lucide-react";
import { DepartmentService } from "../../services/departmentService";
import { DashboardService } from "../../services/dashboardService";
import { ReportService } from "../../services/reportService";
import useApi from "../../hooks/useApi";
import { useNotification } from "../../context/NotificationContext";
import { useTranslation } from "react-i18next"; // or your custom translation hook

const AttendanceReport = () => {
  const { t } = useTranslation("report"); // or use your own translation function

  // --- State for Image Modal ---
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState("");
  const { showNotification } = useNotification();

  // --- Filter criteria ---
  const [criteria, setCriteria] = useState({
    employeeSearch: "",
    departmentId: "",
    dateFrom: "",
    dateTo: "",
  });

  // --- Pagination ---
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const totalPages = Math.ceil(totalElements / size);
  const canGoPrev = page > 0;
  const canGoNext = (page + 1) * size < totalElements;

  // --- Helper to format time ---
  const formatTime = (timeStr) => {
    if (!timeStr) return "—";
    try {
      const parts = timeStr.split(":");
      if (parts.length < 2) return timeStr;
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return `${hours}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const formatMinutes = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const formatEventTime = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    if (isNaN(date)) return isoString;
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // --- Fetch aggregated daily report ---
  const fetchHRAttendaceReport = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await ReportService.searchHRAttendanceReport(criteria, {
        page,
        size,
      });
      setReportData(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error("Error fetching daily report:", err);
      setError(err.message || t("attendanceReport.notifications.error"));
      showNotification(
        err.message || t("attendanceReport.notifications.loadFailed"),
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [criteria, page, size, showNotification, t]);

  // --- Reset page to 0 when filters change ---
  useEffect(() => {
    setPage(0);
  }, [
    criteria.employeeSearch,
    criteria.departmentId,
    criteria.dateFrom,
    criteria.dateTo,
  ]);

  // --- Debounced fetch ---
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchHRAttendaceReport();
    }, 300);
    return () => clearTimeout(handler);
  }, [criteria, page, size, fetchHRAttendaceReport]);

  // --- Handlers ---
  const handleCriteriaChange = (e) => {
    setCriteria({ ...criteria, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setCriteria({
      employeeSearch: "",
      departmentId: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const handlePageSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(0);
  };

  // --- Export to CSV (fix: use reportData) ---
  const exportToCSV = () => {
    const headers = [
      t("attendanceReport.table.employee"),
      t("attendanceReport.table.department"),
      t("attendanceReport.table.date"),
      t("attendanceReport.table.checkIn"),
      t("attendanceReport.table.checkOut"),
      t("attendanceReport.table.status"),
      t("attendanceReport.table.workingHours"),
    ];

    const rows = reportData.map((item) => [
      item.user?.fullName || "",
      item.user.department?.departmentName || "",
      item.attendanceDate || "",
      formatEventTime(item.firstCheckIn),
      item.lastCheckOut != null ? formatEventTime(item.lastCheckOut) : "—",
      item.attendanceStatus || "",
      item.totalWorkedMinutes > 0 ? formatMinutes(item.totalWorkedMinutes) : "—",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily_attendance_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Fetch department data ---
  const {
    data: departmentData,
    loading: departLoading,
    error: departError,
    execute: departRefresh,
  } = useApi(DepartmentService.getDepartments, [], true);

  // --- Dashboard stats ---
  const {
    data: dashboardData,
    loading: dashLoading,
    error: dashError,
    execute: dashRefresh,
  } = useApi(DashboardService.getDashboard, [], true);

  const {
    data: dashboardMetricData,
    loading: dashboardMetricLoading,
    error: dashboardMetricError,
    execute: dashboardMetricRefresh,
  } = useApi(ReportService.getHRDashboardMetric, [], true);

  const formatWorkingHours = (value) => {
    if (value == null || isNaN(value)) return "—";
    return (Math.round(value * 10) / 10).toFixed(1) + "h";
  };

  const getStatusBadge = (status) => {
    if (status === "COMPLETE") return "badge approved";
    return "badge pending";
  };

  return (
    <div className="dashboardContainer">
      {/* Header */}
      <header className="header">
        <div className="title">
          <h1>{t("attendanceReport.title")}</h1>
          <p className="subtitle">{t("attendanceReport.subtitle")}</p>
        </div>
        <div>
          <button className="exportBtn" onClick={exportToCSV}>
            <Download size={18} /> {t("attendanceReport.exportCsv")}
          </button>

          <button className="exportBtn" onClick={exportToCSV}>
            <Download size={18} /> {t("attendanceReport.exportPdf")}
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="statsGrid">
        <div className="statCard">
          <div className="statIcon primary">
            <Users size={32} />
          </div>
          <div>
            <span className="statLabel">
              {t("attendanceReport.stats.totalEmployees")}
            </span>
            <div className="statValue">
              {dashboardData?.activeEmployee || 0}
            </div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon success">
            <CheckCircle size={32} />
          </div>
          <div>
            <span className="statLabel">
              {t("attendanceReport.stats.completeRate")}
            </span>
            <div className="statValue">
              {dashboardMetricData.completionPercentage || 0}%
            </div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon warning">
            <Clock size={32} />
          </div>
          <div>
            <span className="statLabel">
              {t("attendanceReport.stats.avgWorkingHours")}
            </span>
            <div className="statValue">
              {formatWorkingHours(dashboardMetricData?.avgWorkingHours)}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <div className="filtersBar">
        <div className="filterGroup">
          <Search size={16} className="filterIcon" />
          <input
            type="text"
            name="employeeSearch"
            placeholder={t("attendanceReport.filters.searchPlaceholder")}
            value={criteria.employeeSearch}
            onChange={handleCriteriaChange}
            className="filterInput"
          />
        </div>

        <div className="filterGroup">
          <select
            name="departmentId"
            value={criteria.departmentId}
            onChange={handleCriteriaChange}
            className="filterSelect"
          >
            <option value="">{t("attendanceReport.filters.allDepartments")}</option>
            {departmentData?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.departmentName}
              </option>
            ))}
          </select>
        </div>

        <div className="filterGroup dateRange">
          <input
            type="date"
            name="dateFrom"
            value={criteria.dateFrom}
            onChange={handleCriteriaChange}
            className="filterInput dateInput"
          />
          <span className="dateSeparator">
            {t("attendanceReport.filters.dateRangeSeparator")}
          </span>
          <input
            type="date"
            name="dateTo"
            value={criteria.dateTo}
            onChange={handleCriteriaChange}
            className="filterInput dateInput"
          />
        </div>

        <button className="clearFiltersBtn" onClick={clearFilters}>
          {t("attendanceReport.filters.clearFilters")}
        </button>
      </div>

      <div className="resultsSummary">
        {t("attendanceReport.summary", { total: totalElements })}
      </div>

      {/* Data Table */}
      <div className="tableWrapper">
        <div className="tableResponsive">
          <table className="attendanceTable">
            <thead>
              <tr>
                <th>{t("attendanceReport.table.employee")}</th>
                <th>{t("attendanceReport.table.department")}</th>
                <th>{t("attendanceReport.table.date")}</th>
                <th>{t("attendanceReport.table.checkIn")}</th>
                <th>{t("attendanceReport.table.checkOut")}</th>
                <th>{t("attendanceReport.table.status")}</th>
                <th>{t("attendanceReport.table.workingHours")}</th>
              </tr>
            </thead>
            <tbody>
              {totalElements > 0 ? (
                reportData.map((item) => (
                  <tr key={item.id || `${item.userId}_${item.attendanceDate}`}>
                    <td>
                      <strong>{item.user?.fullName}</strong>
                    </td>
                    <td>{item.user.department?.departmentName || "—"}</td>
                    <td>{item.attendanceDate}</td>
                    <td>{formatEventTime(item.firstCheckIn)}</td>
                    <td>
                      {item.lastCheckOut != null
                        ? formatEventTime(item.lastCheckOut)
                        : "—"}
                    </td>
                    <td>
                      <span className={getStatusBadge(item.attendanceStatus)}>
                        {item.attendanceStatus}
                      </span>
                    </td>
                    <td>
                      {item.totalWorkedMinutes > 0
                        ? formatMinutes(item.totalWorkedMinutes)
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="noData">
                    {loading
                      ? t("attendanceReport.loading")
                      : t("attendanceReport.noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <div className="pagination-buttons">
          <button
            onClick={() => setPage(0)}
            disabled={!canGoPrev}
            className="btn btn-secondary"
          >
            {t("attendanceReport.pagination.first")}
          </button>
          <button
            onClick={() => setPage(page - 1)}
            disabled={!canGoPrev}
            className="btn btn-secondary"
          >
            {t("attendanceReport.pagination.previous")}
          </button>
          <span className="pagination-info">
            {t("attendanceReport.pagination.pageInfo", {
              current: page + 1,
              total: totalPages || 1,
            })}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!canGoNext}
            className="btn btn-secondary"
          >
            {t("attendanceReport.pagination.next")}
          </button>
          <button
            onClick={() => setPage(totalPages - 1)}
            disabled={!canGoNext}
            className="btn btn-secondary"
          >
            {t("attendanceReport.pagination.last")}
          </button>
        </div>
        <div className="page-size-selector">
          <label>{t("attendanceReport.pagination.show")}</label>
          <select value={size} onChange={handlePageSizeChange}>
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span>{t("attendanceReport.pagination.entries")}</span>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="imageModalOverlay"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="imageModalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="imageModalClose"
              onClick={() => setShowImageModal(false)}
            >
              <X size={24} />
            </button>
            {imageUrl ? (
              <img src={imageUrl} alt="Attendance" className="imageModalImg" />
            ) : (
              <p>{t("attendanceReport.modal.noImage")}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceReport;