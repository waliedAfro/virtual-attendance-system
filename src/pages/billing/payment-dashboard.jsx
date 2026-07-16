import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  CreditCard,
  Calendar,
  DollarSign,
  FileText
} from 'lucide-react';
import "./css/payments-dashboard.css" ;

/**
 * Payment Status Configuration
 */
const STATUS_CONFIG = {
  SUCCESSFUL: { label: 'Successful', className: 'status-success', icon: CheckCircle2 },
  PENDING: { label: 'Pending', className: 'status-pending', icon: Clock },
  FAILED: { label: 'Failed', className: 'status-failed', icon: XCircle },
  REFUNDED: { label: 'Refunded', className: 'status-refunded', icon: RotateCcw },
};

const MOCK_PAYMENTS = [
  {
    paymentId: "550e8400-e29b-41d4-a716-446655440000",
    tenantId: "t-9982",
    invoice: { invoiceNumber: "INV-2023-001" },
    amount: 1250.50,
    currency: "USD",
    paymentMethod: "STRIPE",
    transactionReference: "ch_3N4jK2L9xPz...",
    status: "SUCCESSFUL",
    createdAt: "2023-10-24T14:25:00"
  },
  {
    paymentId: "660e8400-e29b-41d4-a716-446655440011",
    tenantId: "t-9982",
    invoice: { invoiceNumber: "INV-2023-002" },
    amount: 85.00,
    currency: "USD",
    paymentMethod: "PAYPAL",
    transactionReference: "PAYID-MR7652...",
    status: "PENDING",
    createdAt: "2023-10-25T09:15:00"
  },
  {
    paymentId: "770e8400-e29b-41d4-a716-446655440022",
    tenantId: "t-4421",
    invoice: { invoiceNumber: "INV-2023-003" },
    amount: 3200.00,
    currency: "EUR",
    paymentMethod: "BANK_TRANSFER",
    transactionReference: "BT-9921-X",
    status: "FAILED",
    createdAt: "2023-10-23T16:45:00"
  }
];

const PaymentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [payments] = useState(MOCK_PAYMENTS);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesSearch = 
        p.transactionReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, payments]);

  const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
    const Icon = config.icon;
    return (
      <span className={`status-badge ${config.className}`}>
        <Icon size={14} style={{ marginRight: '4px' }} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="payment-page-container">
    
      <div className="max-container">
        {/* Header Section */}
        <header className="page-header">
          <div className="header-title">
            <h1>Payments</h1>
            <p>Manage and monitor transaction history</p>
          </div>
          <div className="action-buttons">
            <button className="btn btn-white">
              <Download size={16} style={{ marginRight: '8px' }} />
              Export CSV
            </button>
            <button className="btn btn-primary">
              <Plus size={16} style={{ marginRight: '8px' }} />
              Manual Record
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-grid">
          {[
            { label: 'Total Volume', value: '$45,231.89', icon: DollarSign, color: '#4f46e5' },
            { label: 'Successful', value: '128', icon: CheckCircle2, color: '#059669' },
            { label: 'Pending', value: '12', icon: Clock, color: '#d97706' },
            { label: 'Failed/Refunded', value: '3', icon: XCircle, color: '#e11d48' },
          ].map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-header">
                <span className="stat-label">{stat.label}</span>
                <stat.icon size={20} color={stat.color} />
              </div>
              <div className="stat-value">{stat.value}</div>
            </div>
          ))}
        </section>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div >
            <Search className="search-icon" />
            <input 
              type="text"
              placeholder="Search reference or invoice..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-actions">
            <div className="status-toggle-group">
              {['ALL', 'SUCCESSFUL', 'PENDING', 'FAILED'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`toggle-btn ${statusFilter === s ? 'active' : ''}`}
                >
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <button className="btn btn-white" style={{ padding: '0.5rem' }}>
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="table-container">
          <div style={{ overflowX: 'auto' }}>
            <table className="responsive-table">
              <thead>
                <tr>
                  <th>Transaction Info</th>
                  <th>Invoice</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.paymentId}>
                    <td>
                      <div className="font-mono text-sm font-semibold">{payment.transactionReference}</div>
                      <div className="text-xs text-slate-400">ID: {payment.paymentId.substring(0, 8)}...</div>
                    </td>
                    <td>
                      <div className="text-sm flex items-center">
                        <FileText size={14} className="text-slate-400" style={{ marginRight: '8px' }} />
                        {payment.invoice.invoiceNumber}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm font-bold">
                        {payment.currency} {payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm flex items-center">
                        <CreditCard size={14} className="text-slate-400" style={{ marginRight: '8px' }} />
                        {payment.paymentMethod}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={payment.status} />
                    </td>
                    <td>
                      <div className="text-sm">{new Date(payment.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-400">{new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn-white" style={{ border: 'none', padding: '4px' }}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <footer className="pagination-footer">
            <p className="text-sm text-slate-400">
              Showing <strong>{filteredPayments.length}</strong> of <strong>{payments.length}</strong> results
            </p>
            <div className="action-buttons">
              <button className="btn btn-white" disabled><ChevronLeft size={14} /></button>
              <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem' }}>1</button>
              <button className="btn btn-white" style={{ padding: '0.25rem 0.75rem' }}>2</button>
              <button className="btn btn-white"><ChevronRight size={14} /></button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PaymentDashboard;