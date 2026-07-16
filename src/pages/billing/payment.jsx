import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import './css/payments.css';

const Payment = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState({
    status: 'all',
    paymentMethod: 'all',
    startDate: null,
    endDate: null
  });
  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: 0,
    paymentDate: new Date(),
    paymentMethod: 'credit_card',
    transactionId: '',
    status: 'completed',
    notes: ''
  });
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    pendingPayments: 0,
    failedPayments: 0
  });

  useEffect(() => {
    fetchPayments();
    fetchInvoices();
  }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      let url = '/api/payments';
      const params = new URLSearchParams();
      
      if (filter.status !== 'all') params.append('status', filter.status);
      if (filter.paymentMethod !== 'all') params.append('paymentMethod', filter.paymentMethod);
      if (filter.startDate) params.append('startDate', filter.startDate.toISOString());
      if (filter.endDate) params.append('endDate', filter.endDate.toISOString());
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setPayments(data.payments || data);
      
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      setError('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices?status=sent,overdue,partially_paid');
      const data = await response.json();
      setInvoices(data);
    } catch (err) {
      console.error('Failed to fetch invoices');
    }
  };

  const handleOpenDialog = (payment = null) => {
    if (payment) {
      setFormData({
        invoiceId: payment.invoice?.invoiceId || '',
        amount: payment.amount,
        paymentDate: new Date(payment.paymentDate),
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId || '',
        status: payment.status,
        notes: payment.notes || ''
      });
    } else {
      setFormData({
        invoiceId: '',
        amount: 0,
        paymentDate: new Date(),
        paymentMethod: 'credit_card',
        transactionId: '',
        status: 'completed',
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      const url = formData.paymentId ? `/api/payments/${formData.paymentId}` : '/api/payments';
      const method = formData.paymentId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchPayments();
        handleCloseDialog();
      } else {
        setError('Failed to save payment');
      }
    } catch (err) {
      setError('Error saving payment');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'pending':
        return '⏰';
      case 'failed':
        return '❌';
      case 'refunded':
        return '↩️';
      default:
        return '';
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      completed: { label: 'Completed', color: '#2e7d32', bgColor: '#edf7ed' },
      pending: { label: 'Pending', color: '#ed6c02', bgColor: '#fff4e5' },
      failed: { label: 'Failed', color: '#d32f2f', bgColor: '#fdeded' },
      refunded: { label: 'Refunded', color: '#0288d1', bgColor: '#e3f2fd' }
    };

    const config = statusConfig[status] || { label: status, color: '#9e9e9e', bgColor: '#f5f5f5' };
    
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
        <span>{config.label}</span>
      </div>
    );
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card': return '💳';
      case 'bank_transfer': return '🏦';
      case 'paypal': return '💰';
      case 'stripe': return '💳';
      default: return '💰';
    }
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    const statusMap = ['all', 'completed', 'pending', 'failed'];
    setFilter({ ...filter, status: statusMap[newValue] });
  };

  const handleExportPayments = async () => {
    try {
      const response = await fetch('/api/payments/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export payments');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Payments</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => {/* Implement filter dialog */}}>
            <span className="btn-icon">🔍</span> Filter
          </button>
          <button className="btn btn-outline" onClick={handleExportPayments}>
            <span className="btn-icon">⬇️</span> Export
          </button>
          <button className="btn btn-primary" onClick={() => handleOpenDialog()}>
            <span className="btn-icon">+</span> Record Payment
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button className="alert-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">💰</span>
            <div className="stat-label">Total Revenue</div>
          </div>
          <div className="stat-value">{formatCurrency(stats.totalAmount)}</div>
          <div className="stat-meta">{stats.totalPayments} payments</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">✓</span>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-value">{stats.totalPayments - stats.pendingPayments - stats.failedPayments}</div>
          <div className="stat-meta">Successful payments</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">⏰</span>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-value">{stats.pendingPayments}</div>
          <div className="stat-meta">Awaiting confirmation</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">❌</span>
            <div className="stat-label">Failed</div>
          </div>
          <div className="stat-value">{stats.failedPayments}</div>
          <div className="stat-meta">Require attention</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 0 ? 'active' : ''}`}
            onClick={() => handleTabChange(0)}
          >
            All Payments
          </button>
          <button 
            className={`tab ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => handleTabChange(1)}
          >
            <span className="badge-container">
              Completed
              <span className="badge badge-success">
                {stats.totalPayments - stats.pendingPayments - stats.failedPayments}
              </span>
            </span>
          </button>
          <button 
            className={`tab ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => handleTabChange(2)}
          >
            <span className="badge-container">
              Pending
              <span className="badge badge-warning">
                {stats.pendingPayments}
              </span>
            </span>
          </button>
          <button 
            className={`tab ${activeTab === 3 ? 'active' : ''}`}
            onClick={() => handleTabChange(3)}
          >
            <span className="badge-container">
              Failed
              <span className="badge badge-error">
                {stats.failedPayments}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Payment #</th>
              <th>Invoice</th>
              <th>Company</th>
              <th>Date</th>
              <th>Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Transaction ID</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.paymentId} className="payment-row">
                <td>
                  <div className="payment-number">{payment.paymentNumber}</div>
                </td>
                <td>
                  <div>
                    <div className="invoice-number">{payment.invoice?.invoiceNumber}</div>
                    <div className="invoice-company">{payment.invoice?.company?.companyName}</div>
                  </div>
                </td>
                <td>
                  <div className="company-name">{payment.invoice?.company?.companyName}</div>
                </td>
                <td>
                  <div className="payment-date">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div className="payment-method">
                    <span className="method-icon">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                    <span className="method-text">{payment.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </td>
                <td>
                  <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                </td>
                <td>
                  {getStatusChip(payment.status)}
                </td>
                <td>
                  <div className="transaction-id" title={payment.transactionId}>
                    {payment.transactionId || 'N/A'}
                  </div>
                </td>
                <td className="text-right">
                  <div className="action-buttons">
                    <button 
                      className="icon-btn"
                      onClick={() => navigate(`/invoices/view/${payment.invoice?.invoiceId}`)}
                      title="View Invoice"
                    >
                      👁️
                    </button>
                    <button 
                      className="icon-btn"
                      onClick={() => {/* Navigate to payment detail */}}
                      title="View Payment"
                    >
                      📄
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Record Payment Dialog */}
      {openDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Record Payment</h3>
              <button className="modal-close" onClick={handleCloseDialog}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-grid">
                <div className="form-group">
                  <label>Invoice *</label>
                  <select
                    className="form-control"
                    value={formData.invoiceId}
                    onChange={(e) => {
                      const invoice = invoices.find(inv => inv.invoiceId === e.target.value);
                      setFormData({
                        ...formData,
                        invoiceId: e.target.value,
                        amount: invoice?.amountDue || 0
                      });
                    }}
                    required
                  >
                    <option value="">Select an invoice</option>
                    {invoices.map((invoice) => (
                      <option key={invoice.invoiceId} value={invoice.invoiceId}>
                        {invoice.invoiceNumber} - {invoice.company?.companyName} - 
                        Due: {formatCurrency(invoice.amountDue)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Amount</label>
                  <div className="input-with-icon">
                    <span className="input-icon">$</span>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Payment Date</label>
                  <DatePicker
                    selected={formData.paymentDate}
                    onChange={(date) => setFormData({ ...formData, paymentDate: date })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    className="form-control"
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Transaction ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                    placeholder="Gateway transaction ID (optional)"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="form-control"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes about this payment"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={handleCloseDialog}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;