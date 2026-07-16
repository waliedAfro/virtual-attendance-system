import React, { useState, useEffect, useCallback } from "react";
import "./css/attendance-report.css";
import { Download, Search, Users, Clock, CheckCircle } from "lucide-react";
import { DepartmentService } from "../../services/departmentService";
import { DeviceService } from "../../services/deviceService";
import { DashboardService } from "../../services/dashboardService";
import { ReportService } from "../../services/reportService";
import { X } from "lucide-react";
import useApi from "../../hooks/useApi";
import { useNotification } from "../../context/NotificationContext";
import { useTranslation } from "react-i18next"; // or your translation hook

const DetailAttendanceReport = () => {
  const { t } = useTranslation("report");

  // --- State for Image Modal ---
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState();
  const { showNotification } = useNotification();

  const [criteria, setCriteria] = useState({
    employeeSearch: "",
    departmentId: "",
    deviceId: "",
    dateFrom: "",
    dateTo: "",
    eventType: "",
  });

  // Pagination
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const totalPages = Math.ceil(totalElements / size);
  const canGoPrev = page > 0;
  const canGoNext = (page + 1) * size < totalElements;

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

  const fetchDetailAttendanceReport = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await ReportService.searchDetailAttendanceReport(criteria, {
        page,
        size,
      });
      setReportData(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
    } catch (err) {
      console.error("Caught error:", err);
      setError(err.message || t("detailAttendanceReport.notifications.unexpected"));

      switch (err.errorCode) {
        case "INVALID_DATE_RANGE":
          showNotification(
            t("detailAttendanceReport.notifications.invalidDateRange"),
            "error"
          );
          break;
        case "INVALID_PAGE_SIZE":
          showNotification(
            t("detailAttendanceReport.notifications.invalidPageSize"),
            "error"
          );
          break;
        case "UNAUTHORIZED":
          showNotification(
            t("detailAttendanceReport.notifications.unauthorized"),
            "warning"
          );
          break;
        default:
          showNotification(
            err.message || t("detailAttendanceReport.notifications.unexpected"),
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
    criteria.eventType,
  ]);

  // Debounced fetch
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDetailAttendanceReport();
    }, 300);
    return () => clearTimeout(handler);
  }, [criteria, page, size, fetchDetailAttendanceReport]);

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

  // Export to CSV (fixed to use reportData)
  const exportToCSV = () => {
    const headers = [
      t("detailAttendanceReport.table.employee"),
      t("detailAttendanceReport.table.department"),
      t("detailAttendanceReport.table.deviceLocation"),
      t("detailAttendanceReport.table.date"),
      t("detailAttendanceReport.table.eventType"),
      t("detailAttendanceReport.table.time"),
      t("detailAttendanceReport.table.status"),
    ];

    const rows = reportData.map((item) => [
      item.user?.fullName || "",
      item.user?.department?.departmentName || "",
      item.device?.deviceName || "",
      item.attendanceDate || "",
      item.move || "",
      formatEventTime(item.eventTime),
      item.status || "",
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

  const clearFilters = () => {
    setCriteria({
      employeeSearch: "",
      departmentId: "",
      deviceId: "",
      dateFrom: "",
      dateTo: "",
      eventType: "",
    });
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

  const handlePageSizeChange = (e) => {
    setSize(Number(e.target.value));
    setPage(0);
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

  return (
    <div className="dashboardContainer">
      <header className="header">
        <div className="title">
          <h1>{t("detailAttendanceReport.title")}</h1>
          <p className="subtitle">{t("detailAttendanceReport.subtitle")}</p>
        </div>
        <button className="exportBtn" onClick={exportToCSV}>
          <Download size={18} /> {t("detailAttendanceReport.exportCsv")}
        </button>
      </header>

      {/* KPI Cards */}
      <section className="statsGrid">
        <div className="statCard">
          <div className="statIcon primary">
            <Users size={32} />
          </div>
          <div>
            <span className="statLabel">
              {t("detailAttendanceReport.stats.totalEmployees")}
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
              {t("detailAttendanceReport.stats.onTimeRate")}
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
              {t("detailAttendanceReport.stats.avgLateMin")}
            </span>
            <div className="statValue">
              {dashboardData?.averageLateMinute || 0}m
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
            placeholder={t("detailAttendanceReport.filters.searchPlaceholder")}
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
            <option value="">
              {t("detailAttendanceReport.filters.allDepartments")}
            </option>
            {departmentData?.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.departmentName}
              </option>
            ))}
          </select>
        </div>

        <div className="filterGroup">
          <select
            name="deviceId"
            value={criteria.deviceId}
            onChange={handleCriteriaChange}
            className="filterSelect"
          >
            <option value="">
              {t("detailAttendanceReport.filters.allDevices")}
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
          <span className="dateSeparator">—</span>
          <input
            type="date"
            name="dateTo"
            value={criteria.dateTo}
            onChange={handleCriteriaChange}
            placeholder="Date to"
            className="filterInput dateInput"
          />
        </div>

        {/* Event Type Dropdown */}
        <div className="filterGroup">
          <select
            name="eventType"
            value={criteria.eventType}
            onChange={handleCriteriaChange}
            className="filterSelect"
          >
            <option value="">{t("detailAttendanceReport.filters.allEvents")}</option>
            <option value="ENTRY">
              {t("detailAttendanceReport.filters.checkInOnly")}
            </option>
            <option value="EXIT">
              {t("detailAttendanceReport.filters.checkOutOnly")}
            </option>
          </select>
        </div>

        <button className="clearFiltersBtn" onClick={clearFilters}>
          {t("detailAttendanceReport.filters.clearFilters")}
        </button>
      </div>

      <div className="resultsSummary">
        {t("detailAttendanceReport.summary", { total: totalElements })}
      </div>

      {/* Data Table */}
      <div className="tableWrapper">
        <div className="tableResponsive">
          <table className="attendanceTable">
            <thead>
              <tr>
                <th>{t("detailAttendanceReport.table.employee")}</th>
                <th>{t("detailAttendanceReport.table.department")}</th>
                <th>{t("detailAttendanceReport.table.deviceLocation")}</th>
                <th>{t("detailAttendanceReport.table.date")}</th>
                <th>{t("detailAttendanceReport.table.eventType")}</th>
                <th>{t("detailAttendanceReport.table.time")}</th>
                <th>{t("detailAttendanceReport.table.status")}</th>
                <th>{t("detailAttendanceReport.table.image")}</th>
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
                    <td className="locationCell">{item.device?.deviceName}</td>
                    <td>{item.attendanceDate}</td>
                    <td>{item.move}</td>
                    <td>{formatEventTime(item.eventTime)}</td>
                    <td>
                      <span className={getStatusBadgeClass(item.status)}>
                        {item.status?.toUpperCase()}
                      </span>
                    </td>
                    <td className="locationCell">
                      <button
                        className="imageTriggerBtn"
                        onClick={() => handleShowImage(item.id)}
                        disabled={imageLoading}
                      >
                        {imageLoading
                          ? t("detailAttendanceReport.imageTrigger.loading")
                          : t("detailAttendanceReport.imageTrigger.show")}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="noData">
                    {loading
                      ? t("detailAttendanceReport.loading")
                      : t("detailAttendanceReport.noData")}
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
            {t("detailAttendanceReport.pagination.first")}
          </button>
          <button
            onClick={() => setPage(page - 1)}
            disabled={!canGoPrev}
            className="btn btn-secondary"
          >
            {t("detailAttendanceReport.pagination.previous")}
          </button>
          <span className="pagination-info">
            {t("detailAttendanceReport.pagination.pageInfo", {
              current: page + 1,
              total: totalPages || 1,
            })}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!canGoNext}
            className="btn btn-secondary"
          >
            {t("detailAttendanceReport.pagination.next")}
          </button>
          <button
            onClick={() => setPage(totalPages - 1)}
            disabled={!canGoNext}
            className="btn btn-secondary"
          >
            {t("detailAttendanceReport.pagination.last")}
          </button>
        </div>
        <div className="page-size-selector">
          <label>{t("detailAttendanceReport.pagination.show")}</label>
          <select value={size} onChange={handlePageSizeChange}>
            {[5, 10, 20, 50].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span>{t("detailAttendanceReport.pagination.entries")}</span>
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
                alt={t("detailAttendanceReport.modal.altText")}
                className="imageModalImg"
              />
            ) : (
              <p>{t("detailAttendanceReport.modal.noImage")}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailAttendanceReport;