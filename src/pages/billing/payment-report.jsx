import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  AttachMoney as AttachMoneyIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon,
  Visibility as VisibilityIcon,
  PictureAsPdf as PdfIcon,
  InsertChart as ChartIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

const PaymentReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewType, setViewType] = useState('summary');
  const [filter, setFilter] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1), // Start of year
    endDate: new Date(),
    paymentMethod: 'all',
    status: 'all',
    companyId: 'all'
  });

  const [reportData, setReportData] = useState({
    summary: {
      totalPayments: 0,
      totalAmount: 0,
      avgPayment: 0,
      successRate: 0,
      failedPayments: 0,
      pendingPayments: 0,
      monthOverMonthGrowth: 0,
      refundAmount: 0
    },
    monthlyTrend: [],
    paymentMethods: [],
    dailyPayments: [],
    topCompanies: [],
    failedTransactions: [],
    paymentDetails: []
  });

  const [companies, setCompanies] = useState([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchReportData();
    fetchCompanies();
  }, [filter]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: filter.startDate.toISOString(),
        endDate: filter.endDate.toISOString(),
        paymentMethod: filter.paymentMethod,
        status: filter.status,
        companyId: filter.companyId
      });

      const response = await fetch(`/api/reports/payments?${params}`);
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError('Failed to fetch payment report data');
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const params = new URLSearchParams({
        ...filter,
        startDate: filter.startDate.toISOString(),
        endDate: filter.endDate.toISOString(),
        format
      });

      const response = await fetch(`/api/reports/payments/export?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payment-report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  const handleViewTypeChange = (event, newType) => {
    if (newType !== null) {
      setViewType(newType);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'refunded': return 'info';
      default: return 'default';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card': return <CreditCardIcon />;
      case 'bank_transfer': return <AccountBalanceIcon />;
      case 'paypal': return <AttachMoneyIcon />;
      case 'stripe': return <ReceiptIcon />;
      default: return <AttachMoneyIcon />;
    }
  };

  // Chart colors
  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#ef4444'];

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Payment Report
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Analyze payment performance and transaction details
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <ToggleButtonGroup
              value={viewType}
              exclusive
              onChange={handleViewTypeChange}
              size="small"
            >
              <ToggleButton value="summary">
                <ChartIcon />
                <Typography variant="caption" sx={{ ml: 1 }}>Summary</Typography>
              </ToggleButton>
              <ToggleButton value="detailed">
                <ReceiptIcon />
                <Typography variant="caption" sx={{ ml: 1 }}>Details</Typography>
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => handleExport('csv')}
              disabled={exporting}
            >
              {exporting ? 'Exporting...' : 'Export CSV'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<PdfIcon />}
              onClick={() => handleExport('pdf')}
              disabled={exporting}
            >
              Export PDF
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Start Date"
                value={filter.startDate}
                onChange={(date) => setFilter({ ...filter, startDate: date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="End Date"
                value={filter.endDate}
                onChange={(date) => setFilter({ ...filter, endDate: date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={filter.paymentMethod}
                  onChange={(e) => setFilter({ ...filter, paymentMethod: e.target.value })}
                  label="Payment Method"
                >
                  <MenuItem value="all">All Methods</MenuItem>
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                  <MenuItem value="stripe">Stripe</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Company</InputLabel>
                <Select
                  value={filter.companyId}
                  onChange={(e) => setFilter({ ...filter, companyId: e.target.value })}
                  label="Company"
                >
                  <MenuItem value="all">All Companies</MenuItem>
                  {companies.map((company) => (
                    <MenuItem key={company.companyId} value={company.companyId}>
                      {company.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => {
                    setFilter({
                      startDate: new Date(new Date().getFullYear(), 0, 1),
                      endDate: new Date(),
                      paymentMethod: 'all',
                      status: 'all',
                      companyId: 'all'
                    });
                  }}
                >
                  Reset Filters
                </Button>
                <Button
                  variant="contained"
                  startIcon={<FilterIcon />}
                  onClick={fetchReportData}
                >
                  Apply Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoneyIcon color="primary" sx={{ mr: 2 }} />
                  <Typography color="textSecondary">Total Payments</Typography>
                </Box>
                <Typography variant="h4">
                  {formatCurrency(reportData.summary.totalAmount)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {reportData.summary.monthOverMonthGrowth > 0 ? (
                    <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                  ) : (
                    <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                  )}
                  <Typography
                    variant="body2"
                    color={reportData.summary.monthOverMonthGrowth > 0 ? 'success.main' : 'error.main'}
                  >
                    {reportData.summary.monthOverMonthGrowth > 0 ? '+' : ''}
                    {formatPercent(reportData.summary.monthOverMonthGrowth)} MoM
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ReceiptIcon color="info" sx={{ mr: 2 }} />
                  <Typography color="textSecondary">Transactions</Typography>
                </Box>
                <Typography variant="h4">
                  {reportData.summary.totalPayments}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Avg: {formatCurrency(reportData.summary.avgPayment)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CreditCardIcon color="success" sx={{ mr: 2 }} />
                  <Typography color="textSecondary">Success Rate</Typography>
                </Box>
                <Typography variant="h4">
                  {formatPercent(reportData.summary.successRate)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={reportData.summary.successRate}
                  color="success"
                  sx={{ mt: 2, height: 6, borderRadius: 3 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalanceIcon color="warning" sx={{ mr: 2 }} />
                  <Typography color="textSecondary">Pending/Failed</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" color="warning.main">
                      {reportData.summary.pendingPayments}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">Pending</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box>
                    <Typography variant="h6" color="error.main">
                      {reportData.summary.failedPayments}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">Failed</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box>
                    <Typography variant="h6" color="info.main">
                      {formatCurrency(reportData.summary.refundAmount)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">Refunded</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        {viewType === 'summary' && (
          <Grid container spacing={3}>
            {/* Payment Trend Chart */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Trend
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reportData.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        name="Payment Amount"
                        stroke="#667eea"
                        fill="#667eea"
                        fillOpacity={0.3}
                      />
                      <Line
                        type="monotone"
                        dataKey="transactions"
                        name="Transactions"
                        stroke="#f59e0b"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Payment Methods Distribution */}
            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Methods
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.paymentMethods}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="amount"
                        label={(entry) => `${entry.name}: ${formatPercent(entry.percentage)}`}
                      >
                        {reportData.paymentMethods.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Daily Payments */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Daily Payment Activity
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.dailyPayments}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={formatDate} />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [formatCurrency(value), 'Amount']}
                        labelFormatter={formatDate}
                      />
                      <Bar dataKey="amount" name="Daily Amount" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Top Companies */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Companies by Payments
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Company</TableCell>
                        <TableCell align="right">Payments</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Avg. Payment</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.topCompanies.map((company) => (
                        <TableRow key={company.companyId}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {company.companyName}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{company.paymentCount}</TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="medium">
                              {formatCurrency(company.totalAmount)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(company.averageAmount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Detailed View */}
        {viewType === 'detailed' && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Payment Details</Typography>
              <Typography variant="body2" color="textSecondary">
                {reportData.paymentDetails.length} transactions found
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Payment #</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Invoice</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.paymentDetails.map((payment) => (
                    <TableRow key={payment.paymentId} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {payment.paymentNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {payment.companyName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {payment.invoiceNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getPaymentMethodIcon(payment.paymentMethod)}
                          <Typography variant="body2">
                            {payment.paymentMethod.replace('_', ' ')}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium">
                          {formatCurrency(payment.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          color={getStatusColor(payment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                          {payment.transactionId || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Failed Transactions */}
            {reportData.failedTransactions.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" color="error" gutterBottom>
                  Failed Transactions Requiring Attention
                </Typography>
                <Alert severity="warning">
                  {reportData.failedTransactions.length} failed transactions found. These require investigation.
                </Alert>
                <TableContainer sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Payment #</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Error Code</TableCell>
                        <TableCell>Error Message</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.failedTransactions.slice(0, 5).map((failed) => (
                        <TableRow key={failed.paymentId}>
                          <TableCell>{failed.paymentNumber}</TableCell>
                          <TableCell>
                            {new Date(failed.paymentDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{failed.companyName}</TableCell>
                          <TableCell>{formatCurrency(failed.amount)}</TableCell>
                          <TableCell>
                            <Chip label={failed.errorCode} size="small" color="error" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="error">
                              {failed.errorMessage}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Paper>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default PaymentReport;