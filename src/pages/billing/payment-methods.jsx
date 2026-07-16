import React, { useState, useEffect } from 'react';
import './css/payment-methods.css';

const PaymentMethods = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const [showSecret, setShowSecret] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'gateway',
    gatewayType: 'stripe',
    apiKey: '',
    apiSecret: '',
    webhookSecret: '',
    isActive: true,
    isTestMode: false,
    currency: 'USD',
    processingFee: 2.9,
    fixedFee: 0.3,
    supportedCurrencies: ['USD'],
    additionalConfig: {}
  });

  const gatewayTypes = [
    { value: 'stripe', label: 'Stripe', icon: '💳' },
    { value: 'paypal', label: 'PayPal', icon: '💰' },
    { value: 'razorpay', label: 'Razorpay', icon: '🏦' },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
    { value: 'cash', label: 'Cash', icon: '💵' },
    { value: 'check', label: 'Check', icon: '📄' }
  ];

  const currencyOptions = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY'];

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payment-methods');
      const data = await response.json();
      setPaymentMethods(data);
    } catch (err) {
      setError('Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (method = null) => {
    if (method) {
      setEditingMethod(method);
      setFormData({
        name: method.name,
        type: method.type,
        gatewayType: method.gatewayType,
        apiKey: method.apiKey || '',
        apiSecret: method.apiSecret || '',
        webhookSecret: method.webhookSecret || '',
        isActive: method.isActive,
        isTestMode: method.isTestMode || false,
        currency: method.currency || 'USD',
        processingFee: method.processingFee || 2.9,
        fixedFee: method.fixedFee || 0.3,
        supportedCurrencies: method.supportedCurrencies || ['USD'],
        additionalConfig: method.additionalConfig || {}
      });
    } else {
      setEditingMethod(null);
      setFormData({
        name: '',
        type: 'gateway',
        gatewayType: 'stripe',
        apiKey: '',
        apiSecret: '',
        webhookSecret: '',
        isActive: true,
        isTestMode: false,
        currency: 'USD',
        processingFee: 2.9,
        fixedFee: 0.3,
        supportedCurrencies: ['USD'],
        additionalConfig: {}
      });
    }
    setShowSecret(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMethod(null);
  };

  const handleSubmit = async () => {
    try {
      const url = editingMethod 
        ? `/api/payment-methods/${editingMethod.id}`
        : '/api/payment-methods';
      
      const method = editingMethod ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(editingMethod ? 'Payment method updated successfully!' : 'Payment method added successfully!');
        fetchPaymentMethods();
        handleCloseDialog();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to save payment method');
      }
    } catch (err) {
      setError('Error saving payment method');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment method? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/payment-methods/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setSuccess('Payment method deleted successfully!');
          fetchPaymentMethods();
          setTimeout(() => setSuccess(''), 3000);
        }
      } catch (err) {
        setError('Failed to delete payment method');
      }
    }
  };

  const handleTestConnection = async (method) => {
    try {
      const response = await fetch(`/api/payment-methods/${method.id}/test`, {
        method: 'POST'
      });

      const result = await response.json();
      
      if (result.success) {
        setSuccess(`${method.name} connection test successful!`);
      } else {
        setError(`Connection test failed: ${result.message}`);
      }
    } catch (err) {
      setError('Connection test failed');
    }
  };

  const getGatewayIcon = (gatewayType) => {
    const gateway = gatewayTypes.find(g => g.value === gatewayType);
    return gateway?.icon || '💳';
  };

  const getStatusBadge = (isActive, isTestMode) => {
    if (isTestMode) {
      return <div className="badge badge-warning">Test Mode</div>;
    }
    return isActive ? 
      <div className="badge badge-success">✓ Active</div> :
      <div className="badge badge-error">✗ Inactive</div>;
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
          <h1>Payment Methods</h1>
          <p className="subtitle">Configure and manage payment gateways and methods</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenDialog()}>
          <span className="btn-icon">+</span> Add Payment Method
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button className="alert-close" onClick={() => setError('')}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {/* Payment Methods Grid */}
      <div className="methods-grid">
        {paymentMethods.map((method) => (
          <div className="method-card" key={method.id}>
            <div className="method-card-header">
              <div className="method-info">
                <div className={`method-icon ${method.isActive ? 'active' : 'inactive'}`}>
                  {getGatewayIcon(method.gatewayType)}
                </div>
                <div className="method-details">
                  <h3 className="method-name">{method.name}</h3>
                  <p className="method-type">
                    {method.gatewayType.charAt(0).toUpperCase() + method.gatewayType.slice(1)}
                  </p>
                </div>
              </div>
              {getStatusBadge(method.isActive, method.isTestMode)}
            </div>

            <div className="divider"></div>

            <div className="method-stats">
              <div className="stat-item">
                <div className="stat-label">Type</div>
                <div className="stat-value">
                  {method.type === 'gateway' ? 'Payment Gateway' : 'Manual Method'}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Currency</div>
                <div className="stat-value">{method.currency}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Processing Fee</div>
                <div className="stat-value">{method.processingFee}% + ${method.fixedFee}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Supported Currencies</div>
                <div className="currency-chips">
                  {method.supportedCurrencies?.slice(0, 3).map((currency) => (
                    <span key={currency} className="currency-chip">{currency}</span>
                  ))}
                  {method.supportedCurrencies?.length > 3 && (
                    <span className="currency-more" title={method.supportedCurrencies.slice(3).join(', ')}>
                      +{method.supportedCurrencies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="method-actions">
              <div>
                {method.type === 'gateway' && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleTestConnection(method)}
                  >
                    <span className="btn-icon">🔄</span> Test Connection
                  </button>
                )}
              </div>
              <div className="action-buttons">
                <button className="icon-btn" onClick={() => handleOpenDialog(method)} title="Edit">
                  ✏️
                </button>
                <button className="icon-btn" onClick={() => handleDelete(method.id)} title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usage Stats */}
      {paymentMethods.some(m => m.type === 'gateway') && (
        <div className="stats-section">
          <h2 className="section-title">Payment Gateway Usage Statistics</h2>
          <div className="table-container">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Gateway</th>
                  <th className="text-right">Total Transactions</th>
                  <th className="text-right">Success Rate</th>
                  <th className="text-right">Total Processed</th>
                  <th className="text-right">Avg. Transaction</th>
                  <th className="text-right">Fees Collected</th>
                </tr>
              </thead>
              <tbody>
                {paymentMethods
                  .filter(m => m.type === 'gateway')
                  .map((gateway) => (
                    <tr key={gateway.id}>
                      <td>
                        <div className="gateway-info">
                          <span className="gateway-icon">{getGatewayIcon(gateway.gatewayType)}</span>
                          <span className="gateway-name">{gateway.name}</span>
                        </div>
                      </td>
                      <td className="text-right">{gateway.stats?.totalTransactions || 0}</td>
                      <td className="text-right">
                        <div className="success-rate">
                          <span className="rate-value">{(gateway.stats?.successRate || 0).toFixed(1)}%</span>
                          <div className="progress-bar">
                            <div 
                              className={`progress-fill ${
                                gateway.stats?.successRate >= 95 ? 'success' : 
                                gateway.stats?.successRate >= 90 ? 'warning' : 'error'
                              }`}
                              style={{ width: `${gateway.stats?.successRate || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right">${(gateway.stats?.totalProcessed || 0).toLocaleString()}</td>
                      <td className="text-right">${(gateway.stats?.averageTransaction || 0).toFixed(2)}</td>
                      <td className="text-right">${(gateway.stats?.feesCollected || 0).toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      {openDialog && (
        <div className="modal-overlay">
          <div className="modal modal-lg">
            <div className="modal-header">
              <h3>{editingMethod ? 'Edit Payment Method' : 'Add New Payment Method'}</h3>
              <button className="modal-close" onClick={handleCloseDialog}>×</button>
            </div>
            <div className="modal-content">
              <div className="form-grid">
                <div className="form-group">
                  <label>Payment Method Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select
                    className="form-control"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="gateway">Payment Gateway</option>
                    <option value="manual">Manual Method</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Gateway Type</label>
                  <select
                    className="form-control"
                    value={formData.gatewayType}
                    onChange={(e) => setFormData({ ...formData, gatewayType: e.target.value })}
                    disabled={formData.type === 'manual'}
                  >
                    {gatewayTypes.map((gateway) => (
                      <option key={gateway.value} value={gateway.value}>
                        {gateway.icon} {gateway.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.type === 'gateway' && (
                  <>
                    <div className="form-group">
                      <label>API Key</label>
                      <div className="input-with-icon">
                        <input
                          type={showSecret ? 'text' : 'password'}
                          className="form-control"
                          value={formData.apiKey}
                          onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                        />
                        <button 
                          className="input-toggle"
                          onClick={() => setShowSecret(!showSecret)}
                          type="button"
                        >
                          {showSecret ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>API Secret</label>
                      <input
                        type={showSecret ? 'text' : 'password'}
                        className="form-control"
                        value={formData.apiSecret}
                        onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Webhook Secret</label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData.webhookSecret}
                        onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
                        placeholder="For receiving payment notifications"
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label>Default Currency</label>
                  <select
                    className="form-control"
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  >
                    {currencyOptions.map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Supported Currencies</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.supportedCurrencies.join(', ')}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      supportedCurrencies: e.target.value.split(',').map(c => c.trim().toUpperCase())
                    })}
                    placeholder="USD, EUR, GBP (comma separated)"
                  />
                </div>

                <div className="form-group">
                  <label>Processing Fee (%)</label>
                  <div className="input-with-icon">
                    <input
                      type="number"
                      className="form-control"
                      value={formData.processingFee}
                      onChange={(e) => setFormData({ ...formData, processingFee: parseFloat(e.target.value) })}
                      step="0.01"
                      min="0"
                    />
                    <span className="input-suffix">%</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Fixed Fee</label>
                  <div className="input-with-icon">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.fixedFee}
                      onChange={(e) => setFormData({ ...formData, fixedFee: parseFloat(e.target.value) })}
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <div className="switch-group">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                      <span className="switch-slider"></span>
                    </label>
                    <span className="switch-label">Active</span>
                  </div>
                  
                  {formData.type === 'gateway' && (
                    <div className="switch-group">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={formData.isTestMode}
                          onChange={(e) => setFormData({ ...formData, isTestMode: e.target.checked })}
                        />
                        <span className="switch-slider"></span>
                      </label>
                      <span className="switch-label">Test Mode</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={handleCloseDialog}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>
                {editingMethod ? 'Update' : 'Add'} Payment Method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;