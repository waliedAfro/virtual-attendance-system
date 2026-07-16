import React, { useState, useEffect, useCallback, useRef } from "react";
import "./css/daily-attendance-report.css";
import { Download, Search, Users, Clock, CheckCircle } from "lucide-react";
import { DepartmentService } from "../../services/departmentService";
import { DeviceService } from "../../services/deviceService";
import { DashboardService } from "../../services/dashboardService";
import { ReportService } from "../../services/reportService";
import { X } from "lucide-react";
import useApi from "../../hooks/useApi";
import { useNotification } from "../../context/NotificationContext";
import { useTranslation } from "react-i18next"; // or your translation hook

const DailyAttendanceReport = () => {
  const { t } = useTranslation("report");

  const [criteria, setCriteria] = useState({
    employeeSearch: "",
    departmentId: "",
    deviceId: "",
    dateFrom: "",
    dateTo: "",
  });

  // --- State for Image Modal ---
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState();
  const { showNotification } = useNotification();

  const handleShowImage = async (eventId) => {
    setImageLoading(true);
    try {
      const url = await ReportService.getAttendancePhoto(eventId);
      setImageUrl(url);
      setShowImageModal(true);
    } catch (error) {
      console.error("Error loading image:", error);
      alert(error.message);
    } finally {
      setImageLoading(false);
    }
  };

  const handleCloseModal = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
    setShowImageModal(false);
  };

  const handleCriteriaChange = (e) => {
    setCriteria({ ...criteria, [e.target.name]: e.target.value });
  };

  // Fetch department data
  const {
    data: departmentData,
    departLoading,
    departError,
    execute: departRefresh,
  } = useApi(DepartmentService.getDepartments, [], true);

  // Fetch DeviceService data
  const {
    data: deviceData,
    devicetLoading,
    devicetError,
    execute: deviceRefresh,
  } = useApi(DeviceService.searchActiveDevice, [], true);

  // Fetch dashboard data
  const {
    data: dashboardData,
    dashLoading,
    dashError,
    execute: dashRefresh,
  } = useApi(DashboardService.getDashboard, [], true);

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

  // Export to CSV (fixed to use reportData)
  const exportToCSV = () => {
    const headers = [
      t("dailyAttendanceReport.table.employee"),
      t("dailyAttendanceReport.table.department"),
      t("dailyAttendanceReport.table.date"),
      t("dailyAttendanceReport.table.checkIn"),
      t("dailyAttendanceReport.table.time"),
      t("dailyAttendanceReport.table.status"),
      t("dailyAttendanceReport.table.result"),
      t("dailyAttendanceReport.table.deviceLocation"),
    ];

    const rows = reportData.map((item) => [
      item.user?.fullName || "",
      item.user?.department?.departmentName || "",
      item.attendanceDate || "",
      item.move || "",
      formatEventTime(item.eventTime),
      item.status || "",
      item.late <= 0
        ? t("dailyAttendanceReport.result.onTime")
        : t("dailyAttendanceReport.result.late", { minutes: Math.abs(item.late) }),
      item.device?.deviceName || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "on time":
        return "badge approved";
      case "late":
        return "badge late";
      case "pending":
        return "badge pending";
      default:
        return "badge";
    }
  };

  const getResultBadgeClass = (value) => {
    if (value == null) return "badge pending";
    return value <= 0 ? "badge approved" : "badge late";
  };

  // Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const fetchDailyReport = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await ReportService.searchDailyReport(criteria, {
        page,
        size,
      });
      setReportData(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error("Caught error:", err);
      setError(err.message || t("dailyAttendanceReport.notifications.unexpected"));

      switch (err.errorCode) {
        case "INVALID_DATE_RANGE":
          showNotification(
            t("dailyAttendanceReport.notifications.invalidDateRange"),
            "error"
          );
          break;
        case "INVALID_PAGE_SIZE":
          showNotification(
            t("dailyAttendanceReport.notifications.invalidPageSize"),
            "error"
          );
          break;
        case "UNAUTHORIZED":
          showNotification(
            t("dailyAttendanceReport.notifications.unauthorized"),
            "warning"
          );
          break;
        default:
          showNotification(
            err.message || t("dailyAttendanceReport.notifications.unexpected"),
            "error"
          );
      }
    } finally {
      setLoading(false);
    }
  }, [criteria, page, size, showNotification, t]);

  // Reset page on filter change
  useEffect(() => {
    setPage(0);
  }, [
    criteria.employeeSearch,
    criteria.departmentId,
    criteria.deviceId,
    criteria.dateFrom,
    criteria.dateTo,
  ]);

  // Debounced fetch
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDailyReport();
    }, 300);
    return () => clearTimeout(handler);
  }, [criteria, page, size, fetchDailyReport]);

  const totalPages = Math.ceil(totalElements / size);
  const canGoPrev = page > 0;
  const canGoNext = (page + 1) * size < totalElements;

  const handlePageSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(0);
  };

  return (
    <div className="dashboardContainer">
      {/* Top Header */}
      <header className="header">
        <div className="title">
          <h1>{t("dailyAttendanceReport.title")}</h1>
          <p className="subtitle">{t("dailyAttendanceReport.subtitle")}</p>
        </div>
        <button className="exportBtn" onClick={exportToCSV}>
          <Download size={18} /> {t("dailyAttendanceReport.exportData")}
        </button>
      </header>

      {/* KPI Section */}
      <section className="statsGrid">
        <div className="statCard">
          <div className="statIcon primary">
            <Users size={32} />
          </div>
          <div>
            <span className="statLabel">
              {t("dailyAttendanceReport.stats.activeUsers")}
            </span>
            <div className="statValue">{dashboardData?.activeEmployee || 0}</div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon success">
            <CheckCircle size={32} />
          </div>
          <div>
            <span className="statLabel">
              {t("dailyAttendanceReport.stats.onTime")}
            </span>
            <div className="statValue">
              {dashboardData?.onTimePercentage || 0}%
            </div>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon warning">
            <Clock size={32} />
          </div>
          <div>
            <span className="statLabel">
              {t("dailyAttendanceReport.stats.avgLate")}
            </span>
            <div className="statValue">
              {dashboardData?.averageLateMinute || 0}m
            </div>
          </div>
        </div>
      </section>

      {/* Data Table */}
      <div className="tableWrapper">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchDailyReport();
          }}
        >
          <div className="tableControls">
            <div className="searchWrapper">
              <Search size={18} className="searchIcon" />
              <input
                type="text"
                name="employeeSearch"
                className="searchInput"
                placeholder={t("dailyAttendanceReport.filters.searchPlaceholder")}
                value={criteria.employeeSearch}
                onChange={handleCriteriaChange}
              />
            </div>

            <select
              className="departmentSelect"
              name="departmentId"
              value={criteria.departmentId}
              onChange={handleCriteriaChange}
            >
              <option value="">
                {t("dailyAttendanceReport.filters.allDepartments")}
              </option>
              {departmentData?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.departmentName}
                </option>
              ))}
            </select>

            <div className="filterGroup">
              <select
                name="deviceId"
                value={criteria.deviceId}
                onChange={handleCriteriaChange}
                className="filterSelect"
              >
                <option value="">
                  {t("dailyAttendanceReport.filters.allDevices")}
                </option>
                {deviceData?.map((dev) => (
                  <option key={dev.deviceId} value={dev.deviceId}>
                    {dev.deviceName}
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
                placeholder="Date from"
                className="filterInput dateInput"
              />
              <span className="dateSeparator">
                {t("dailyAttendanceReport.filters.dateRangeSeparator")}
              </span>
              <input
                type="date"
                name="dateTo"
                value={criteria.dateTo}
                onChange={handleCriteriaChange}
                placeholder="Date to"
                className="filterInput dateInput"
              />
            </div>

            <div>
              <button className="clearFiltersBtn" type="submit">
                <span>{t("dailyAttendanceReport.filters.searchButton")}</span>
              </button>
            </div>
          </div>
        </form>

        <div className="tableResponsive">
          <table className="attendanceTable">
            <thead>
              <tr>
                <th>{t("dailyAttendanceReport.table.employee")}</th>
                <th>{t("dailyAttendanceReport.table.department")}</th>
                <th>{t("dailyAttendanceReport.table.date")}</th>
                <th>{t("dailyAttendanceReport.table.checkIn")}</th>
                <th>{t("dailyAttendanceReport.table.time")}</th>
                <th>{t("dailyAttendanceReport.table.status")}</th>
                <th>{t("dailyAttendanceReport.table.result")}</th>
                <th>{t("dailyAttendanceReport.table.deviceLocation")}</th>
                <th>{t("dailyAttendanceReport.table.image")}</th>
              </tr>
            </thead>
            <tbody>
              {totalElements > 0 ? (
                reportData.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.user?.fullName}</strong>
                    </td>
                    <td>{item.user?.department?.departmentName || ""}</td>
                    <td>{item.attendanceDate}</td>
                    <td>{item.move}</td>
                    <td>{formatEventTime(item.eventTime)}</td>
                    <td>
                      <span className={getStatusBadgeClass(item.status)}>
                        {item.status?.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={getResultBadgeClass(item.late)}>
                        {item.late <= 0
                          ? t("dailyAttendanceReport.result.onTime")
                          : t("dailyAttendanceReport.result.late", {
                              minutes: Math.abs(item.late),
                            })}
                      </span>
                    </td>
                    <td className="locationCell">
                      {item.device?.deviceName || ""}
                    </td>
                    <td className="locationCell">
                      <button
                        className="imageTriggerBtn"
                        onClick={() => handleShowImage(item.id)}
                        disabled={imageLoading}
                      >
                        {imageLoading
                          ? t("dailyAttendanceReport.imageTrigger.loading")
                          : t("dailyAttendanceReport.imageTrigger.show")}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="noData">
                    {loading
                      ? t("dailyAttendanceReport.loading")
                      : t("dailyAttendanceReport.noData")}
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
            {t("dailyAttendanceReport.pagination.first")}
          </button>
          <button
            onClick={() => setPage(page - 1)}
            disabled={!canGoPrev}
            className="btn btn-secondary"
          >
            {t("dailyAttendanceReport.pagination.previous")}
          </button>
          <span className="pagination-info">
            {t("dailyAttendanceReport.pagination.pageInfo", {
              current: page + 1,
              total: totalPages || 1,
            })}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!canGoNext}
            className="btn btn-secondary"
          >
            {t("dailyAttendanceReport.pagination.next")}
          </button>
          <button
            onClick={() => setPage(totalPages - 1)}
            disabled={!canGoNext}
            className="btn btn-secondary"
          >
            {t("dailyAttendanceReport.pagination.last")}
          </button>
        </div>
        <div className="page-size-selector">
          <label>{t("dailyAttendanceReport.pagination.show")}</label>
          <select value={size} onChange={handlePageSizeChange}>
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span>{t("dailyAttendanceReport.pagination.entries")}</span>
        </div>
      </div>

      {/* IMAGE MODAL */}
      {showImageModal && (
        <div className="imageModalOverlay" onClick={handleCloseModal}>
          <div
            className="imageModalContent"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="imageModalClose" onClick={handleCloseModal}>
              <X size={24} />
            </button>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={t("dailyAttendanceReport.modal.altText")}
                className="imageModalImg"
              />
            ) : (
              <p>{t("dailyAttendanceReport.modal.noImage")}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyAttendanceReport;