import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  FileText,
  X,
  Printer,
  Mail,
  ExternalLink
} from 'lucide-react';
import "./css/invoice-dashboard.css";
/**
 * Mock Service Layer to simulate InvoiceService
 */
const MOCK_DATA = [
  {
    invoiceId: "inv-001",
    invoiceNumber: "INV-2023-001",
    tenantName: "TechCorp Solutions",
    email: "billing@techcorp.com",
    mobile: "+974 5555 1234",
    createdAt: "2023-10-24T14:25:00",
    dueDate: "2023-10-31T14:25:00",
    periodStart: "2023-10-01",
    periodEnd: "2023-10-31",
    totalAmount: 1250.50,
    currency: "QR",
    status: "PAID",
    items: [
      { description: "Cloud Hosting - Gold Plan", quantity: 1, unitPrice: 1000.00, amount: 1000.00 },
      { description: "Domain Maintenance", quantity: 1, unitPrice: 250.50, amount: 250.50 }
    ]
  },
  {
    invoiceId: "inv-002",
    invoiceNumber: "INV-2023-002",
    tenantName: "Global Logistics",
    email: "finance@globallogistics.qa",
    mobile: "+974 4444 9876",
    createdAt: "2023-11-01T09:15:00",
    dueDate: "2023-11-08T09:15:00",
    periodStart: "2023-11-01",
    periodEnd: "2023-11-30",
    totalAmount: 850.00,
    currency: "QR",
    status: "OPEN",
    items: [
      { description: "Fleet Management Software Sub", quantity: 1, unitPrice: 850.00, amount: 850.00 }
    ]
  },
  {
    invoiceId: "inv-003",
    invoiceNumber: "INV-2023-003",
    tenantName: "Desert Retail Ltd",
    email: "accounts@desertretail.com",
    mobile: "+974 3333 5544",
    createdAt: "2023-09-15T16:45:00",
    dueDate: "2023-09-22T16:45:00",
    periodStart: "2023-09-01",
    periodEnd: "2023-09-30",
    totalAmount: 3200.00,
    currency: "QR",
    status: "OVERDUE",
    items: [
      { description: "Inventory Management System", quantity: 1, unitPrice: 3000.00, amount: 3000.00 },
      { description: "Support Tier 2", quantity: 1, unitPrice: 200.00, amount: 200.00 }
    ]
  }
];

// --- Helpers ---

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
  } catch (error) {
    return `${amount} ${currency}`;
  }
};

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// --- Sub-Components ---

const StatusBadge = ({ status }) => {
  const s = status?.toUpperCase();
  let className = "status-default";
  let Icon = Clock;

  if (s === "PAID") { className = "status-paid"; Icon = CheckCircle2; }
  else if (s === "OPEN") { className = "status-open"; Icon = Clock; }
  else if (s === "OVERDUE") { className = "status-overdue"; Icon = XCircle; }

  return (
    <span className={`status-badge ${className}`}>
      <Icon size={14} style={{ marginRight: '4px' }} />
      {status || "UNKNOWN"}
    </span>
  );
};

const InvoiceDetail = ({ invoice, onClose }) => {
  if (!invoice) return null;

  const subtotal = invoice.items?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const taxAmount = 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-header-left">
            <FileText size={20} className="text-indigo" />
            <h3>Invoice Details</h3>
          </div>
          <div className="modal-actions">
            <button className="icon-btn" title="Print"><Printer size={18} /></button>
            <button className="icon-btn" title="Email"><Mail size={18} /></button>
            <button className="icon-btn close-btn" onClick={onClose}><X size={20} /></button>
          </div>
        </div>

        <div className="invoice-paper">
          <div className="paper-header">
            <div className="vendor-info">
              <h1 className="brand-title">AglanTech W.L.L</h1>
              <p>123 Business Rd, Suite 100</p>
              <p>Doha, Qatar</p>
              <p>CR No: 123456</p>
            </div>
            <div className="invoice-meta-box">
              <div className="meta-tag">INVOICE</div>
              <div className="meta-row"><span>No:</span> <strong>{invoice.invoiceNumber}</strong></div>
              <div className="meta-row"><span>Date:</span> {formatDate(invoice.createdAt)}</div>
              <div className="meta-row"><span>Due:</span> {formatDate(invoice.dueDate)}</div>
            </div>
          </div>

          <div className="paper-body">
            <div className="billing-grid">
              <div className="bill-section">
                <h4 className="section-label">Bill To</h4>
                <p className="client-name">{invoice.tenantName}</p>
                <p>{invoice.email}</p>
                <p>{invoice.mobile}</p>
              </div>
              <div className="bill-section">
                <h4 className="section-label">Period</h4>
                <p>{formatDate(invoice.periodStart)} — {formatDate(invoice.periodEnd)}</p>
                <div style={{ marginTop: '12px' }}>
                  <StatusBadge status={invoice.status} />
                </div>
              </div>
            </div>

            <table className="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.description}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                    <td className="text-right font-semibold">{formatCurrency(item.amount, invoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="totals-area">
              <div className="totals-row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal, invoice.currency)}</span>
              </div>
              <div className="totals-row">
                <span>Tax (0%)</span>
                <span>{formatCurrency(taxAmount, invoice.currency)}</span>
              </div>
              <div className="totals-row grand-total">
                <span>Total Amount</span>
                <span>{formatCurrency(invoice.totalAmount, invoice.currency)}</span>
              </div>
            </div>
          </div>

          <div className="paper-footer">
            <p><strong>Payment Terms:</strong> Net 7 days from issue date.</p>
            <p>Thank you for choosing AglanTech W.L.L</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const InvoiceDashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setInvoices(MOCK_DATA);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const term = debouncedSearch.toLowerCase();
      const matchesSearch = 
        inv.invoiceNumber.toLowerCase().includes(term) ||
        inv.tenantName.toLowerCase().includes(term);
      const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, debouncedSearch, statusFilter]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Fetching Invoices...</p>
        
      </div>
    );
  }

  return (
    <div className="payment-page-container">
  
      <div className="max-container">
        <header className="page-header">
          <div className="header-title">
            <h1>Invoice Manager</h1>
            <p>AglanTech W.L.L Billing Dashboard</p>
          </div>
          <div className="action-buttons">
            <button className="btn btn-white">
              <Download size={16} style={{ marginRight: '8px' }} />
              Export
            </button>
            <button className="btn btn-primary">
              <Plus size={16} style={{ marginRight: '8px' }} />
              Create Invoice
            </button>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Receivables</span>
            <div className="stat-value">{formatCurrency(5300.50)}</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Collected</span>
            <div className="stat-value" style={{ color: '#166534' }}>{formatCurrency(1250.50)}</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending</span>
            <div className="stat-value" style={{ color: '#854d0e' }}>{formatCurrency(850.00)}</div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Overdue</span>
            <div className="stat-value" style={{ color: '#991b1b' }}>{formatCurrency(3200.00)}</div>
          </div>
        </section>

        <div className="filter-bar">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input 
              type="text"
              placeholder="Search by invoice #, customer name..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="status-toggle-group">
            {['ALL', 'PAID', 'OPEN', 'OVERDUE'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`toggle-btn ${statusFilter === s ? 'active' : ''}`}
              >
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="table-container">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Invoice Details</th>
                <th>Client</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No invoices found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.invoiceId} onClick={() => setSelectedInvoice(inv)}>
                    <td>
                      <div className="font-semibold text-indigo">{inv.invoiceNumber}</div>
                      <div className="text-xs text-slate-400 font-mono" style={{ fontSize: '0.7rem' }}>ID: {inv.invoiceId}</div>
                    </td>
                    <td>
                      <div className="font-semibold">{inv.tenantName}</div>
                      <div className="text-xs text-slate-400" style={{ fontSize: '0.75rem' }}>{inv.email}</div>
                    </td>
                    <td>
                      <div className="font-bold">{formatCurrency(inv.totalAmount, inv.currency)}</div>
                    </td>
                    <td>
                      <StatusBadge status={inv.status} />
                    </td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>{formatDate(inv.dueDate)}</div>
                    </td>
                    <td className="text-right">
                      <button className="icon-btn" style={{ border: 'none' }}>
                        <ExternalLink size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          <footer style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Showing <strong>{filteredInvoices.length}</strong> invoices
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-white" style={{ padding: '0.4rem 0.8rem' }}><ChevronLeft size={16} /></button>
              <button className="btn btn-white" style={{ padding: '0.4rem 0.8rem' }}><ChevronRight size={16} /></button>
            </div>
          </footer>
        </div>
      </div>

      {selectedInvoice && (
        <InvoiceDetail 
          invoice={selectedInvoice} 
          onClose={() => setSelectedInvoice(null)} 
        />
      )}
    </div>
  );
};

export default InvoiceDashboard;