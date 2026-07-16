import React, { useState, useEffect, useMemo } from "react";
import {
  Download,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import "./css/payment-management.css";
import { PaymentService } from "../../services/paymentService";
import TotalPaidStat from "./TotalPaidStat";
import LastPaymentStat from "./LastPaymentStat";

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const statusText = t(`paymentManagement.statuses.${status}`, {
    defaultValue: status,
  });

  const configs = {
    SUCCESSFUL: { icon: <CheckCircle2 size={14} />, class: "status-success" },
    FAILED: { icon: <AlertCircle size={14} />, class: "status-failed" },
    REFUNDED: { icon: <Clock size={14} />, class: "status-refunded" },
    PENDING: { icon: <Clock size={14} />, class: "status-pending" },
  };
  const config = configs[status] || configs.SUCCESSFUL;

  return (
    <span className={`history-status ${config.class}`}>
      {config.icon} {statusText}
    </span>
  );
};

const PaymentManagement = () => {
  const { t } = useTranslation("payment");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const formatDate = (dateString) => {
    if (!dateString) return t("common.noData");
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await PaymentService.getPayments();

        if (response?.success) {
          setPayments(response.data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch = p.invoice.invoiceNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "ALL" || p.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [payments, searchTerm, filterStatus]);

  // Map filter statuses to translated labels
  const filterLabels = {
    ALL: t("paymentManagement.filterAll"),
    SUCCESSFUL: t("paymentManagement.filterSuccessful"),
    FAILED: t("paymentManagement.filterFailed"),
    REFUNDED: t("paymentManagement.filterRefunded"),
    PENDING: t("paymentManagement.filterPending"),
  };

  if (loading)
    return (
      <div className="loading-state">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="history-container">
      <header className="history-header">
        <div>
          <h1>{t("paymentManagement.title")}</h1>
          <p className="subtitle">{t("paymentManagement.subtitle")}</p>
        </div>
        <button className="btn-export">
          <Download size={18} /> {t("paymentManagement.exportCsv")}
        </button>
      </header>

      {/* Quick Stats */}
      <section className="statsGrid">
        <div className="statCard">
          <TotalPaidStat transactions={payments} />
        </div>
        <div className="statCard">
          <LastPaymentStat transactions={payments} />
        </div>
        {/* Optional third stat card – you can add more here */}
      </section>

      {/* Filters Bar */}
      <div className="history-controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={t("paymentManagement.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          {["ALL", "SUCCESSFUL", "FAILED", "REFUNDED", "PENDING"].map(
            (status) => (
              <button
                key={status}
                className={`tab-btn ${filterStatus === status ? "active" : ""}`}
                onClick={() => setFilterStatus(status)}
              >
                {filterLabels[status]}
              </button>
            )
          )}
        </div>
      </div>

      {/* Payments Table */}
      <div className="table-responsive">
        <table className="history-table">
          <thead>
            <tr>
              <th>{t("paymentManagement.tableHeaders.date")}</th>
              <th>{t("paymentManagement.tableHeaders.invoiceReference")}</th>
              <th>{t("paymentManagement.tableHeaders.method")}</th>
              <th>{t("paymentManagement.tableHeaders.amount")}</th>
              <th>{t("paymentManagement.tableHeaders.paidDate")}</th>
              <th>{t("paymentManagement.tableHeaders.status")}</th>
              <th>{t("paymentManagement.tableHeaders.action")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments?.map((pay) => (
              <tr key={pay.paymentId}>
                <td className="date-col">{formatDate(pay.createdAt)}</td>
                <td>
                  <div className="invoice-info">
                    <span className="inv-no">{pay.invoice?.invoiceNumber}</span>
                    <span className="ref-no"></span>
                  </div>
                </td>
                <td className="method-col">{pay.paymentMethod}</td>
                <td className="amount-col">
                  <strong>
                    QAR{" "}
                    {pay.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                </td>
                <td className="amount-col">{formatDate(pay.paidAt)}</td>
                <td>
                  <StatusBadge status={pay.status} />
                </td>
                <td>
                  <button
                    className="btn-receipt"
                    title={t("paymentManagement.downloadReceipt")}
                  >
                    <Download size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentManagement;