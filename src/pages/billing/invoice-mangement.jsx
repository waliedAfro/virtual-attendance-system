import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Building2,
  Wallet,
} from "lucide-react";
import { InvoiceService } from "../../services/invoiceService";
import { PaymentService } from "../../services/paymentService";
import "./css/invoice-management.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatCurrency = (amount, currency = "QR") => {
  const currencyMap = { QR: "QAR" };
  const isoCurrency = currencyMap[currency] || currency;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: isoCurrency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
};

const StatusBadge = ({ status }) => {
  const { t } = useTranslation("invoice");
  const s = status?.toUpperCase();
  let colorClass = "status-default";
  let Icon = Clock;
  if (s === "PAID") {
    colorClass = "status-paid";
    Icon = CheckCircle2;
  } else if (s === "OPEN") {
    colorClass = "status-open";
    Icon = Clock;
  } else if (s === "OVERDUE") {
    colorClass = "status-overdue";
    Icon = XCircle;
  }
  // Translate the status text (fallback to original if no translation)
  const statusText = t(`invoiceManagement.statuses.${s}`, { defaultValue: status });
  return (
    <span className={`status-badge ${colorClass}`}>
      <Icon size={14} style={{ marginRight: "4px" }} />
      {statusText}
    </span>
  );
};

const InvoiceManagement = () => {
  const { t } = useTranslation("invoice");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [tenantName, setTenantName] = useState(null);

  const handlePay = async (invoiceId) => {
    setLoading(true);
    try {
      const response = await PaymentService.createCheckout(invoiceId);
      
      if (response.success) {
        const checkoutUrl = response.data;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          console.error("No checkout URL returned");
        }
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const response = await InvoiceService.getInvoices(searchTerm);
        if (response && response.success) {
          setInvoices(response.data || []);
          const invoiceWithTenant = response.data.find((inv) => inv.tenantName);
          if (invoiceWithTenant) {
            setTenantName(invoiceWithTenant?.tenantName);
          }
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getNextDueDate = (invoices) => {
    if (!invoices || invoices.length === 0) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingInvoices = invoices
      .filter((inv) => inv.status === "OPEN" || inv.status === "PENDING")
      .map((inv) => ({
        ...inv,
        parsedDate: new Date(inv.dueDate),
      }))
      .filter((inv) => inv.parsedDate >= today)
      .sort((a, b) => a.parsedDate - b.parsedDate);

    return upcomingInvoices.length > 0 ? upcomingInvoices[0].dueDate : null;
  };

  const nextDue = useMemo(() => {
    const date = getNextDueDate(invoices);
    return date ? formatDate(date) : t("invoiceManagement.noUpcomingPayments");
  }, [invoices, t]);

  const filteredInvoices = useMemo(() => {
    return invoices?.filter((inv) => {
      const matchesSearch = inv.invoiceNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const pending = invoices
      ?.filter((i) => i.status !== "PAID")
      .reduce((a, b) => a + b.totalAmount, 0);
    const paid = invoices
      ?.filter((i) => i.status === "PAID")
      .reduce((a, b) => a + b.totalAmount, 0);
    return { pending, paid };
  }, [invoices]);

  // Map status filter values to translation keys
  const statusFilterLabels = {
    ALL: t("invoiceManagement.filterAll", "All"),
    PAID: t("invoiceManagement.filterPaid", "Paid"),
    OPEN: t("invoiceManagement.filterOpen", "Open"),
    OVERDUE: t("invoiceManagement.filterOverdue", "Overdue"),
  };

  if (loading)
    return (
      <div className="loading-state">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="invoice-page-container">
      <div className="max-container">
        <header className="page-header">
          <div className="header-title">
            <p className="flex items-center text-indigo font-semibold text-sm mb-1">
              <Building2 size={16} className="mr-1" /> {tenantName} {t("invoiceManagement.tenantPortal")}
            </p>
            <h1>{t("invoiceManagement.title")}</h1>
            <p>{t("invoiceManagement.subtitle")}</p>
          </div>
          <div className="action-buttons">
            <button className="btn btn-white">
              <Download size={16} className="mr-2" /> {t("invoiceManagement.downloadStatement")}
            </button>
            <button className="btn btn-primary">
              <Wallet size={16} className="mr-2" /> {t("invoiceManagement.autopaySettings")}
            </button>
          </div>
        </header>

        <section className="tenant-card">
          <div className="tenant-stat-item">
            <div className="tenant-stat-label">{t("invoiceManagement.totalOutstanding")}</div>
            <div className="tenant-stat-value">
              {formatCurrency(stats.pending)}
            </div>
          </div>
          <div
            className="tenant-stat-item"
            style={{
              borderLeft: "1px solid rgba(255,255,255,0.1)",
              paddingLeft: "2rem",
            }}
          >
            <div className="tenant-stat-label">{t("invoiceManagement.paidYearToDate")}</div>
            <div className="tenant-stat-value">
              {formatCurrency(stats.paid)}
            </div>
          </div>
          <div
            className="tenant-stat-item"
            style={{
              borderLeft: "1px solid rgba(255,255,255,0.1)",
              paddingLeft: "2rem",
            }}
          >
            <div className="tenant-stat-label">{t("invoiceManagement.nextDueDate")}</div>
            <div className="tenant-stat-value">{nextDue}</div>
          </div>
        </section>

        <div className="filter-bar">
          <div>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder={t("invoiceManagement.searchPlaceholder")}
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="status-toggle-group">
            {["ALL", "PAID", "OPEN", "OVERDUE"].map((status) => (
              <button
                key={status}
                className={`toggle-btn ${
                  statusFilter === status ? "active" : ""
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {statusFilterLabels[status]}
              </button>
            ))}
          </div>
        </div>

        <div className="table-container">
          <div style={{ overflowX: "auto" }}>
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>{t("invoiceManagement.tableHeaders.invoiceRef")}</th>
                  <th>{t("invoiceManagement.tableHeaders.customer")}</th>
                  <th>{t("invoiceManagement.tableHeaders.issueDate")}</th>
                  <th>{t("invoiceManagement.tableHeaders.amount")}</th>
                  <th>{t("invoiceManagement.tableHeaders.status")}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices?.length > 0 ? (
                  filteredInvoices?.map((inv) => (
                    <tr
                      key={inv.invoiceId}
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      <td className="font-bold">{inv.invoiceNumber}</td>
                      <td className="text-slate-500 font-medium">
                        {inv.tenantName}
                      </td>
                      <td>{formatDate(inv.createdAt)}</td>
                      <td className="font-bold text-slate-900">
                        {formatCurrency(inv.totalAmount, inv.currency)}
                      </td>
                      <td>
                        <StatusBadge status={inv.status} />
                      </td>
                      <td>
                        <Link to={`${inv.invoiceId}`} className="view-link">
                          {t("invoiceManagement.viewDetails")}
                        </Link>
                      </td>
                      <td className="text-right">
                        {inv.status !== "PAID" ? (
                          <button
                            className="btn btn-primary"
                            style={{
                              padding: "0.4rem 0.8rem",
                              fontSize: "0.75rem",
                            }}
                            onClick={() => handlePay(inv.invoiceId)}
                          >
                            {t("invoiceManagement.payNow")}
                          </button>
                        ) : (
                          <FileText
                            size={18}
                            className="text-slate-300 ml-auto"
                          />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "4rem",
                        color: "#94a3b8",
                      }}
                    >
                      {t("invoiceManagement.noInvoicesFound")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceManagement;