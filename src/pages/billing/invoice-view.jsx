import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './css/invoice-view.css';

const InvoiceView = () => {

  const { t } = useTranslation("invoice");

  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentMethod: 'credit_card',
    transactionId: '',
    notes: ''
  });
  const [sendData, setSendData] = useState({
    email: '',
    cc: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    fetchInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/invoices/${id}`);
      const data = await response.json();
      setInvoice(data);
      
      setPaymentData(prev => ({
        ...prev,
        amount: data.amountDue
      }));
      
      // Set default email with translated subject and message
      if (data.company?.email) {
        const amountFormatted = formatCurrency(data.finalAmount, data.currency);
        const subject = t('invoiceView.emailTemplates.subject', {
          invoiceNumber: data.invoiceNumber,
          defaultValue: `Invoice ${data.invoiceNumber} from SmartLogs`
        });
        const message = t('invoiceView.emailTemplates.message', {
          companyName: data.company.companyName,
          invoiceNumber: data.invoiceNumber,
          amount: amountFormatted,
          defaultValue: `Dear ${data.company.companyName},\n\nPlease find attached your invoice ${data.invoiceNumber} for ${amountFormatted}.\n\nThank you for your business!\n\nBest regards,\nSmartLogs Team`
        });
        setSendData(prev => ({
          ...prev,
          email: data.company.email,
          subject,
          message
        }));
      }
    } catch (err) {
      setError(t('invoiceView.errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || invoice?.currency || 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return '✓';
      case 'overdue': return '⚠️';
      case 'sent': return '✉️';
      case 'draft': return '📝';
      default: return '';
    }
  };

  const getStatusChip = (status) => {
    // Map status to translation key
    const statusKeyMap = {
      draft: 'draft',
      sent: 'sent',
      paid: 'paid',
      overdue: 'overdue',
      void: 'void',
      partially_paid: 'partially_paid'
    };
    const key = statusKeyMap[status] || status;
    const label = t(`invoiceView.statuses.${key}`, { defaultValue: status });

    const statusConfig = {
      draft: { color: '#9e9e9e', bgColor: '#f5f5f5' },
      sent: { color: '#0288d1', bgColor: '#e3f2fd' },
      paid: { color: '#2e7d32', bgColor: '#edf7ed' },
      overdue: { color: '#d32f2f', bgColor: '#fdeded' },
      void: { color: '#ed6c02', bgColor: '#fff4e5' },
      partially_paid: { color: '#ed6c02', bgColor: '#fff4e5' }
    };

    const config = statusConfig[status] || { color: '#9e9e9e', bgColor: '#f5f5f5' };

    return (
      <div 
        className="status-chip"
        style={{
          backgroundColor: config.bgColor,
          color: config.color,
          borderColor: config.color
        }}
      >
        {getStatusIcon(status)}
        <span>{label}</span>
      </div>
    );
  };

  const handlePaymentSubmit = async () => {
    try {
      const response = await fetch(`/api/invoices/${id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        fetchInvoice();
        setOpenPaymentDialog(false);
      } else {
        setError(t('invoiceView.errors.paymentFailed'));
      }
    } catch (err) {
      setError(t('invoiceView.errors.genericError'));
    }
  };

  const handleSendInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendData)
      });

      if (response.ok) {
        fetchInvoice();
        setOpenSendDialog(false);
      } else {
        setError(t('invoiceView.errors.sendFailed'));
      }
    } catch (err) {
      setError(t('invoiceView.errors.genericError'));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="container">
        <div className="alert alert-error">{t('invoiceView.invoiceNotFound')}</div>
        <button className="btn" onClick={() => navigate('/invoices')}>
          <span className="btn-icon">←</span> {t('invoiceView.backToInvoices')}
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="page-header">
        <div>
          <button className="btn" onClick={() => navigate('/invoices')}>
            <span className="btn-icon">←</span> {t('invoiceView.backToInvoices')}
          </button>
          <h1>{t('invoiceView.title', { invoiceNumber: invoice.invoiceNumber })}</h1>
          <p className="subtitle">{invoice.company?.companyName}</p>
        </div>
        <div className="header-actions">
          {getStatusChip(invoice.status)}
          <button className="btn btn-outline" onClick={() => window.open(`/api/invoices/${id}/pdf`, '_blank')}>
            <span className="btn-icon">⬇️</span> {t('invoiceView.downloadPDF')}
          </button>
          <button className="btn btn-outline" onClick={handlePrint}>
            <span className="btn-icon">🖨️</span> {t('invoiceView.print')}
          </button>
          {invoice.status !== 'paid' && invoice.status !== 'void' && (
            <button className="btn btn-primary" onClick={() => setOpenPaymentDialog(true)}>
              <span className="btn-icon">💳</span> {t('invoiceView.recordPayment')}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button className="alert-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Invoice Details */}
      <div className="invoice-grid">
        {/* Left Column - Invoice Info */}
        <div className="invoice-main">
          <div className="paper">
            {/* Header */}
            <div className="invoice-header">
              <div>
                <h2 className="company-name">SmartLogs</h2>
                <p className="company-address">123 Business Street</p>
                <p className="company-address">Suite 100, San Francisco, CA 94107</p>
                <p className="company-email">contact@smartlogs.com</p>
              </div>
              <div className="invoice-title">
                <h2 className="invoice-title-text">{t('invoiceView.invoiceLabel')}</h2>
                <h3 className="invoice-number-large">{invoice.invoiceNumber}</h3>
              </div>
            </div>

            {/* Billing Info */}
            <div className="billing-section">
              <div className="billing-card">
                <h4 className="section-subtitle">{t('invoiceView.billTo')}</h4>
                <h3 className="bill-to-name">{invoice.company?.companyName}</h3>
                {invoice.company?.address && (
                  <p className="bill-to-address">{invoice.company.address}</p>
                )}
                {invoice.company?.email && (
                  <p className="bill-to-email">{invoice.company.email}</p>
                )}
                {invoice.company?.phone && (
                  <p className="bill-to-phone">{invoice.company.phone}</p>
                )}
              </div>
              <div className="invoice-dates">
                <div className="date-grid">
                  <div className="date-item">
                    <div className="date-label">{t('invoiceView.invoiceDate')}</div>
                    <div className="date-value">{formatDate(invoice.invoiceDate)}</div>
                  </div>
                  <div className="date-item">
                    <div className="date-label">{t('invoiceView.dueDate')}</div>
                    <div className={`date-value ${invoice.status === 'overdue' ? 'overdue' : ''}`}>
                      {formatDate(invoice.dueDate)}
                    </div>
                  </div>
                  <div className="date-item">
                    <div className="date-label">{t('invoiceView.paymentTerms')}</div>
                    <div className="date-value">{invoice.paymentTerms || 'Net 30'}</div>
                  </div>
                  <div className="date-item">
                    <div className="date-label">{t('invoiceView.currency')}</div>
                    <div className="date-value">{invoice.currency}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <h3 className="section-title">{t('invoiceView.items')}</h3>
            <div className="table-container">
              <table className="invoice-items-table">
                <thead>
                  <tr>
                    <th>{t('invoiceView.description')}</th>
                    <th className="text-right">{t('invoiceView.quantity')}</th>
                    <th className="text-right">{t('invoiceView.unitPrice')}</th>
                    <th className="text-right">{t('invoiceView.amount')}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="item-description">{item.description}</div>
                        {item.itemType && (
                          <div className="item-type">{item.itemType}</div>
                        )}
                      </td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                      <td className="text-right item-amount">{formatCurrency(item.totalAmount, invoice.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="totals-section">
              <div className="totals-box">
                <div className="total-row">
                  <span>{t('invoiceView.subtotal')}</span>
                  <span>{formatCurrency(invoice.totalAmount, invoice.currency)}</span>
                </div>
                {invoice.taxAmount > 0 && (
                  <div className="total-row">
                    <span>{t('invoiceView.tax')}</span>
                    <span>{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
                  </div>
                )}
                {invoice.discountAmount > 0 && (
                  <div className="total-row">
                    <span>{t('invoiceView.discount')}</span>
                    <span>-{formatCurrency(invoice.discountAmount, invoice.currency)}</span>
                  </div>
                )}
                <div className="total-divider"></div>
                <div className="total-row total-row-main">
                  <span>{t('invoiceView.total')}</span>
                  <span>{formatCurrency(invoice.finalAmount, invoice.currency)}</span>
                </div>
                {invoice.amountPaid > 0 && (
                  <div className="total-row">
                    <span>{t('invoiceView.amountPaid')}</span>
                    <span className="amount-paid">-{formatCurrency(invoice.amountPaid, invoice.currency)}</span>
                  </div>
                )}
                {invoice.amountDue > 0 && (
                  <div className="total-row total-row-due">
                    <span>{t('invoiceView.amountDue')}</span>
                    <span className="amount-due">{formatCurrency(invoice.amountDue, invoice.currency)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="notes-section">
                <h4 className="section-subtitle">{t('invoiceView.notes')}</h4>
                <p className="notes-content">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Actions & History */}
        <div className="invoice-sidebar">
          <div className="sidebar-stack">
            {/* Quick Actions */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">{t('invoiceView.quickActions')}</h3>
              <div className="action-buttons">
                <button
                  className="btn btn-outline full-width"
                  onClick={() => setOpenSendDialog(true)}
                  disabled={invoice.status === 'paid' || invoice.status === 'void'}
                >
                  <span className="btn-icon">✉️</span> {t('invoiceView.sendInvoice')}
                </button>
                <button
                  className="btn btn-outline full-width"
                  onClick={() => navigate(`/invoices/edit/${id}`)}
                >
                  <span className="btn-icon">✏️</span> {t('invoiceView.editInvoice')}
                </button>
                <button
                  className="btn btn-outline full-width"
                  onClick={() => navigate(`/subscriptions/${invoice.subscription?.subscriptionId}`)}
                >
                  <span className="btn-icon">📄</span> {t('invoiceView.viewSubscription')}
                </button>
              </div>
            </div>

            {/* Payment History */}
            {invoice.payments && invoice.payments.length > 0 && (
              <div className="sidebar-card">
                <h3 className="sidebar-title">{t('invoiceView.paymentHistory')}</h3>
                <div className="payment-history">
                  {invoice.payments.map((payment) => (
                    <div key={payment.paymentId} className="payment-item">
                      <div className="payment-header">
                        <div className="payment-amount">{formatCurrency(payment.amount, invoice.currency)}</div>
                        <div className={`payment-status ${payment.status}`}>
                          {t(`invoiceView.statuses.${payment.status}`, { defaultValue: payment.status })}
                        </div>
                      </div>
                      <div className="payment-details">
                        {new Date(payment.paymentDate).toLocaleDateString()} • {payment.paymentMethod}
                      </div>
                      {payment.transactionId && (
                        <div className="payment-transaction">
                          {t('invoiceView.transactionIdLabel')}: {payment.transactionId}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invoice Info */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">{t('invoiceView.invoiceInformation')}</h3>
              <div className="info-grid">
                <div className="info-row">
                  <span className="info-label">{t('invoiceView.statusLabel')}</span>
                  {getStatusChip(invoice.status)}
                </div>
                <div className="info-row">
                  <span className="info-label">{t('invoiceView.createdLabel')}</span>
                  <span className="info-value">{new Date(invoice.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">{t('invoiceView.lastUpdatedLabel')}</span>
                  <span className="info-value">{new Date(invoice.updatedAt).toLocaleDateString()}</span>
                </div>
                {invoice.pdfUrl && (
                  <div className="info-row">
                    <span className="info-label">{t('invoiceView.pdfLabel')}</span>
                    <button className="btn-text" onClick={() => window.open(invoice.pdfUrl, '_blank')}>
                      {t('invoiceView.viewPDF')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      {openPaymentDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{t('invoiceView.recordPaymentDialogTitle')}</h3>
              <button className="modal-close" onClick={() => setOpenPaymentDialog(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="payment-info">
                <p>{t('invoiceView.invoiceRefLabel')} <strong>{invoice.invoiceNumber}</strong></p>
                <p className="text-muted">{t('invoiceView.amountDueLabel')} {formatCurrency(invoice.amountDue, invoice.currency)}</p>
              </div>
              <div className="form-group">
                <label>{t('invoiceView.amount')}</label>
                <div className="input-with-icon">
                  <span className="input-icon">{invoice.currency}</span>
                  <input
                    type="number"
                    className="form-control"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })}
                    step="0.01"
                    min="0"
                    max={invoice.amountDue}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t('invoiceView.paymentMethodLabel')}</label>
                <select
                  className="form-control"
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                >
                  <option value="credit_card">{t('invoiceView.paymentMethods.credit_card')}</option>
                  <option value="bank_transfer">{t('invoiceView.paymentMethods.bank_transfer')}</option>
                  <option value="cash">{t('invoiceView.paymentMethods.cash')}</option>
                  <option value="check">{t('invoiceView.paymentMethods.check')}</option>
                  <option value="paypal">{t('invoiceView.paymentMethods.paypal')}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t('invoiceView.transactionIdLabel')}</label>
                <input
                  type="text"
                  className="form-control"
                  value={paymentData.transactionId}
                  onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                  placeholder={t('invoiceView.transactionIdPlaceholder')}
                />
              </div>
              <div className="form-group">
                <label>{t('invoiceView.notesLabel')}</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                  placeholder={t('invoiceView.notesPlaceholder')}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setOpenPaymentDialog(false)}>{t('invoiceView.cancel')}</button>
              <button className="btn btn-primary" onClick={handlePaymentSubmit}>
                {t('invoiceView.recordPaymentButton')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Invoice Dialog */}
      {openSendDialog && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h3>{t('invoiceView.sendInvoiceDialogTitle')}</h3>
              <button className="modal-close" onClick={() => setOpenSendDialog(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label>{t('invoiceView.toEmail')}</label>
                <input
                  type="email"
                  className="form-control"
                  value={sendData.email}
                  onChange={(e) => setSendData({ ...sendData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('invoiceView.cc')}</label>
                <input
                  type="email"
                  className="form-control"
                  value={sendData.cc}
                  onChange={(e) => setSendData({ ...sendData, cc: e.target.value })}
                  placeholder={t('invoiceView.ccPlaceholder')}
                />
              </div>
              <div className="form-group">
                <label>{t('invoiceView.subject')}</label>
                <input
                  type="text"
                  className="form-control"
                  value={sendData.subject}
                  onChange={(e) => setSendData({ ...sendData, subject: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>{t('invoiceView.message')}</label>
                <textarea
                  className="form-control"
                  rows="6"
                  value={sendData.message}
                  onChange={(e) => setSendData({ ...sendData, message: e.target.value })}
                />
              </div>
              <div className="alert alert-info">
                {t('invoiceView.emailAttachmentNotice')}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setOpenSendDialog(false)}>{t('invoiceView.cancel')}</button>
              <button className="btn btn-primary" onClick={handleSendInvoice}>
                <span className="btn-icon">✉️</span> {t('invoiceView.sendInvoiceButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceView;