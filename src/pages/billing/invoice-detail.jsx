import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Download,
  FileText,
  CreditCard,
  Printer,
} from "lucide-react";
import { InvoiceService } from "../../services/invoiceService";
import { PaymentService } from "../../services/paymentService"; // ensure this import exists
import "./css/invoice-detail.css";
import { useTranslation } from "react-i18next";

const InvoiceDetail = () => {
  const { t } = useTranslation("invoice");
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await InvoiceService.getInvoice(id);
        setInvoice(response.data);
      } catch (err) {
        console.error("Error fetching invoice:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handlePay = async () => {
    setPaying(true);
    try {
      const response = await PaymentService.createCheckout(invoice.invoiceId);
      if (response.success) {
        const checkoutUrl = response.data.sessionURL;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          setError(t("invoiceDetail.noCheckoutUrl"));
        }
      }
    } catch (err) {
      setError(t("invoiceDetail.failedToLoadServices"));
    } finally {
      setPaying(false);
    }
  };

  // Helper: format date
  const formatDate = (dateString) => {
    if (!dateString) return t("common.noData");
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading)
    return <div className="p-10 text-center">{t("invoiceDetail.loadingInvoice")}</div>;
  if (!invoice)
    return <div className="p-10 text-center">{t("invoiceDetail.invoiceNotFound")}</div>;

  const subtotal =
    invoice.items?.reduce((sum, item) => sum + item.amount, 0) || 0;

  // Translate status
  const statusKey = invoice.status?.toUpperCase();
  const statusText = t(`invoiceDetail.statuses.${statusKey}`, {
    defaultValue: invoice.status,
  });

  return (
    <div className="invoice-detail-page">
      {/* Navigation Header */}
      <div className="page-nav-bar">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ChevronLeft size={20} /> {t("invoiceDetail.backToInvoices")}
        </button>
        <div className="nav-actions">
          <button className="btn-secondary" onClick={() => window.print()}>
            <Printer size={18} /> {t("invoiceDetail.print")}
          </button>
          <button className="btn-primary">
            <Download size={18} /> {t("invoiceDetail.downloadPDF")}
          </button>
        </div>
      </div>

      <div className="invoice-paper-container">
        <div className="invoice-paper">
          <div className="paper-header">
            <div>
              <h1 className="brand-title">AglanTech W.L.L</h1>
              <p>Smart Technologies</p>
              <p>Doha, Qatar</p>
            </div>
            <div className="invoice-meta-box">
              <div className="meta-tag">{t("invoiceDetail.officialInvoice")}</div>
              <div className="meta-row">
                <strong>{invoice.invoiceNumber}</strong>
              </div>
              <div className="meta-row">
                {new Date(invoice.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="paper-body">
            <div className="billing-grid">
              <div className="tenant-info-box">
                <h3 className="section-label">{t("invoiceDetail.billTo")}</h3>
                <p className="client-name">{invoice.tenantName}</p>
                <p className="text-sm text-slate-500">{invoice.email}</p>
                <p className="text-sm text-slate-500">{invoice.mobile}</p>
              </div>
              <div className="text-right">
                <h4 className="section-label">{t("invoiceDetail.paymentStatus")}</h4>
                <span
                  className={`status-badge ${invoice.status?.toLowerCase()}`}
                >
                  {statusText}
                </span>
                <div className="mt-2 text-xs text-slate-400">
                  {t("invoiceDetail.due")}{" "}
                  {formatDate(invoice.dueDate)}
                </div>
              </div>
            </div>

            {/* Subscription Period */}
            <div className="subscription-period">
              <h3>{t("invoiceDetail.subscriptionPeriod")}</h3>
              <p>
                {formatDate(invoice.periodStart)} — {formatDate(invoice.periodEnd)}
              </p>
            </div>

            <table className="items-table">
              <thead>
                <tr>
                  <th>{t("invoiceDetail.serviceDescription")}</th>
                  <th className="text-right">{t("invoiceDetail.total")}</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="font-medium text-slate-700">
                        {item.description}
                      </div>
                      <div className="text-xs text-slate-400">
                        {t("invoiceDetail.serviceFee")}
                      </div>
                    </td>
                    <td className="text-right font-semibold">
                      {invoice.currency} {item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="totals-area">
              <div className="totals-row">
                <span className="text-slate-500">{t("invoiceDetail.subtotal")}</span>
                <span>
                  {invoice.currency} {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="totals-row grand-total">
                <span>{t("invoiceDetail.amountDue")}</span>
                <span>
                  {invoice.currency} {invoice.totalAmount?.toLocaleString()}
                </span>
              </div>
            </div>

            {invoice.status !== "PAID" && (
              <div className="payment-cta">
                <button
                  className={`pay-btn ${paying ? "loading" : ""}`}
                  onClick={handlePay}
                  disabled={paying}
                >
                  {paying ? (
                    t("invoiceDetail.processing")
                  ) : (
                    <>
                      <CreditCard size={20} /> {t("invoiceDetail.payNow")}
                    </>
                  )}
                </button>
                {error && <div className="error-message">{error}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;