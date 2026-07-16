import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/invoice.css';

const invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);

  const statusOptions = [
    { value: 'draft', label: 'Draft', color: '#9e9e9e', bgColor: '#f5f5f5' },
    { value: 'sent', label: 'Sent', color: '#0288d1', bgColor: '#e3f2fd' },
    { value: 'paid', label: 'Paid', color: '#2e7d32', bgColor: '#edf7ed' },
    { value: 'overdue', label: 'Overdue', color: '#d32f2f', bgColor: '#fdeded' },
    { value: 'void', label: 'Void', color: '#ed6c02', bgColor: '#fff4e5' },
    { value: 'partially_paid', label: 'Partially Paid', color: '#ed6c02', bgColor: '#fff4e5' }
  ];

  const navigate = useNavigate();

  // Fetch data
  useEffect(() => {
    fetchInvoices();
    fetchCompanies();
    fetchSubscriptions();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/invoices');
      const data = await response.json();
      setInvoices(data);
    } catch (err) {
      setError('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      console.error('Failed to fetch companies');
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      const data = await response.json();
      setSubscriptions(data);
    } catch (err) {
      console.error('Failed to fetch subscriptions');
    }
  };

  const handleViewInvoice = (invoice) => {
    navigate(`/invoices/view/${invoice.invoiceId}`);
  };

  const handleDownloadInvoice = async (invoice) => {
    try {
      const response = await fetch(`/api/invoices/${invoice.invoiceId}/pdf`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download invoice');
    }
  };

  const handleSendInvoice = async (invoice) => {
    if (window.confirm(`Send invoice ${invoice.invoiceNumber} to company email?`)) {
      try {
        await fetch(`/api/invoices/${invoice.invoiceId}/send`, {
          method: 'POST'
        });
        fetchInvoices();
      } catch (err) {
        setError('Failed to send invoice');
      }
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
      case 'paid':
        return '✓';
      case 'overdue':
        return '⚠️';
      case 'sent':
        return '⏰';
      default:
        return '';
    }
  };

  const getStatusChip = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return (
      <div 
        className="status-chip"
        style={{
          backgroundColor: option?.bgColor || '#f5f5f5',
          color: option?.color || '#9e9e9e',
          borderColor: option?.color || '#9e9e9e'
        }}
      >
        {getStatusIcon(status)}
        <span>{option?.label || status}</span>
      </div>
    );
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
      <div className="page-header">
        <div className="header-content">
          <h1>Invoices</h1>
          <div className="header-actions">
            <button
              className="btn btn-outline"
              onClick={() => navigate('/invoices/generate')}
            >
              <span className="btn-icon">📄</span> Generate Invoices
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/invoices/create')}
            >
              <span className="btn-icon">+</span> Create Invoice
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button className="alert-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="table-container">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Company</th>
              <th>Subscription</th>
              <th>Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.invoiceId} className="invoice-row">
                <td>
                  <div className="invoice-number">
                    {invoice.invoiceNumber}
                  </div>
                </td>
                <td>
                  <div className="company-name">
                    {invoice.company?.companyName}
                  </div>
                </td>
                <td>
                  <div className="subscription-plan">
                    {invoice.subscription?.subscriptionPlan?.planName}
                  </div>
                </td>
                <td>
                  <div className="invoice-date">
                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div className={`due-date ${invoice.status === 'overdue' ? 'overdue' : ''}`}>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                    {invoice.status === 'overdue' && (
                      <span className="overdue-icon" title="Overdue">⚠️</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="amount-cell">
                    <div className="final-amount">
                      {formatCurrency(invoice.finalAmount)}
                    </div>
                    {invoice.amountDue > 0 && (
                      <div className="amount-due">
                        Due: {formatCurrency(invoice.amountDue)}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  {getStatusChip(invoice.status)}
                </td>
                <td className="text-right">
                  <div className="action-buttons">
                    <button 
                      className="icon-btn" 
                      onClick={() => handleViewInvoice(invoice)}
                      title="View Invoice"
                    >
                      👁️
                    </button>
                    <button 
                      className="icon-btn" 
                      onClick={() => handleDownloadInvoice(invoice)}
                      title="Download PDF"
                    >
                      ⬇️
                    </button>
                    {invoice.status === 'sent' && (
                      <button 
                        className="icon-btn" 
                        onClick={() => handleSendInvoice(invoice)}
                        title="Send Invoice"
                      >
                        ✉️
                    </button>
                    )}
                    <button 
                      className="icon-btn"
                      title="Record Payment"
                    >
                      💳
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default invoice;