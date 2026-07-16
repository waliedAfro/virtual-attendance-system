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
  LinearProgress,
  Badge
} from '@mui/material';
import {
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
  Visibility as VisibilityIcon,
  PictureAsPdf as PdfIcon,
  InsertChart as ChartIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, ComposedChart
} from 'recharts';

const InvoiceReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewType, setViewType] = useState('overview');
  const [filter, setFilter] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date(),
    status: 'all',
    companyId: 'all',
    invoiceType: 'all'
  });

  const [reportData, setReportData] = useState({
    summary: {
      totalInvoices: 0,
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0,
      overdueAmount: 0,
      avgInvoiceValue: 0,
      collectionRate: 0,
      avgDaysToPay: 0
    },
    monthlyInvoices: [],
    statusDistribution: [],
    topCustomers: [],
    overdueInvoices: [],
    invoiceAging: [],
    recentInvoices: []
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
        status: filter.status,
        companyId: filter.companyId,
        invoiceType: filter.invoiceType
      });

      const response = await fetch(`/api/reports/invoices?${params}`);
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError('Failed to fetch invoice report data');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'sent': return 'info';
      case 'overdue': return 'error';
      case 'draft': return 'default';
      case 'void': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircleIcon />;
      case 'overdue': return <WarningIcon />;
      case 'sent': return <AccessTimeIcon />;
      default: return <ReceiptIcon />;
    }
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

      const response = await fetch(`/api/reports/invoices/export?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-report-${new Date().toISOString().split('T')[0]}.${format}`;
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

  // Calculate aging categories
  const getAgingCategory = (days) => {
    if (days <= 30) return '0-30 days';
    if (days <= 60) return '31-60 days';
    if (days <= 90) return '61-90 days';
    return '90+ days';
  };

  // Chart colors
  const STATUS_COLORS = {
    paid: '#10b981',
    sent: '#3b82f6',
    overdue: '#ef4444',
    draft: '#6b7280',
    void: '#f59e0b'
  };

  const AGING_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#dc2626'];

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
              Invoice Report
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Track invoice performance and aging analysis
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <ToggleButtonGroup
              value={viewType}
              exclusive
              onChange={handleViewTypeChange}
              size="small"
            >
              <ToggleButton value="overview">
                <ChartIcon />
                <Typography variant="caption" sx={{ ml: 1 }}>Overview</Typography>
              </ToggleButton>
              <ToggleButton value="aging">
                <CalendarIcon />
                <Typography variant="caption" sx={{ ml: 1 }}>Aging</Typography>
              </ToggleButton>
              <ToggleButton value="details">
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
                <InputLabel>Status</InputLabel>
                <Select
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="sent">Sent</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <MenuItem value="void">Void</MenuItem>
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
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Invoice Type</InputLabel>
                <Select
                  value={filter.invoiceType}
                  onChange={(e) => setFilter({ ...filter, invoiceType: e.target.value })}
                  label="Invoice Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="subscription">Subscription</MenuItem>
                  <MenuItem value="one_time">One Time</MenuItem>
                  <MenuItem value="credit">Credit</MenuItem>
                  <MenuItem value="adjustment">Adjustment</MenuItem>
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
                      status: 'all',
                      companyId: 'all',
                      invoiceType: 'all'
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
                  <Typography color="textSecondary">Total Invoices</Typography>
                </Box>
                <Typography variant="h4">
                  {formatCurrency(reportData.summary.totalAmount)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {reportData.summary.totalInvoices} invoices • Avg: {formatCurrency(reportData.summary.avgInvoiceValue)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 2 }} />
                  <Typography color="textSecondary">Paid Invoices</Typography>
                </Box>
                <Typography variant="h4">
                  {formatCurrency(reportData.summary.paidAmount)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={reportData.summary.collectionRate}
                  color="success"
                  sx={{ mt: 2, height: 6, borderRadius: 3 }}
                />
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  Collection Rate: {formatPercent(reportData.summary.collectionRate)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WarningIcon color="error" sx={{ mr: 2 }} />
                  <Typography color="textSecondary">Overdue</Typography>
                </Box>
                <Typography variant="h4" color="error.main">
                  {formatCurrency(reportData.summary.overdueAmount)}
                </Typography>
                <Typography variant="body2" color="error.main">
                  {reportData.overdueInvoices.length} invoices
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                  Avg. Days to Pay: {reportData.summary.avgDaysToPay} days
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccessTimeIcon color="warning" sx={{ mr: 2 }} />
                  <Typography color="textSecondary">Pending</Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  {formatCurrency(reportData.summary.pendingAmount)}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Box>
                    <Typography variant="caption" color="textSecondary">Sent</Typography>
                    <Typography variant="body2">
                      {reportData.statusDistribution.find(s => s.status === 'sent')?.count || 0}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="textSecondary">Draft</Typography>
                    <Typography variant="body2">
                      {reportData.statusDistribution.find(s => s.status === 'draft')?.count || 0}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Overview View */}
        {viewType === 'overview' && (
          <Grid container spacing={3}>
            {/* Monthly Invoice Trend */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Monthly Invoice Trend
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={reportData.monthlyInvoices}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip formatter={(value, name) => {
                        if (name === 'invoices') return [value, 'Invoice Count'];
                        if (name === 'amount') return [formatCurrency(value), 'Invoice Amount'];
                        if (name === 'paidAmount') return [formatCurrency(value), 'Paid Amount'];
                        return [value, name];
                      }} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="invoices" name="Invoice Count" fill="#8b5cf6" />
                      <Line yAxisId="right" type="monotone" dataKey="amount" name="Invoice Amount" stroke="#667eea" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="paidAmount" name="Paid Amount" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Status Distribution */}
            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Invoice Status Distribution
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData.statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="count"
                        label={(entry) => `${entry.status}: ${entry.count}`}
                      >
                        {reportData.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#6b7280'} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [
                        value,
                        props.payload.status
                      ]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={1}>
                  {reportData.statusDistribution.map((status) => (
                    <Grid item xs={6} key={status.status}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            bgcolor: STATUS_COLORS[status.status] || '#6b7280',
                            borderRadius: '2px',
                            mr: 1
                          }}
                        />
                        <Typography variant="body2">{status.status}</Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        {status.count} invoices
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatCurrency(status.amount)}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Top Customers */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Top Customers by Invoice Volume
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Company</TableCell>
                        <TableCell align="right">Invoices</TableCell>
                        <TableCell align="right">Total Amount</TableCell>
                        <TableCell align="right">Paid</TableCell>
                        <TableCell align="right">Outstanding</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.topCustomers.map((customer) => (
                        <TableRow key={customer.companyId}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {customer.companyName}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{customer.invoiceCount}</TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="medium">
                              {formatCurrency(customer.totalAmount)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography color="success.main">
                              {formatCurrency(customer.paidAmount)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography color={customer.outstandingAmount > 0 ? 'error.main' : 'textSecondary'}>
                              {formatCurrency(customer.outstandingAmount)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Recent Invoices */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Invoices
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Invoice #</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Status</TableCell>
                        <TableCell align="right">Due Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.recentInvoices.map((invoice) => (
                        <TableRow key={invoice.invoiceId}>
                          <TableCell>
                            <Typography variant="body2">{invoice.invoiceNumber}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{invoice.companyName}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {formatCurrency(invoice.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              icon={getStatusIcon(invoice.status)}
                              label={invoice.status}
                              size="small"
                              color={getStatusColor(invoice.status)}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2">
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </Typography>
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

        {/* Aging View */}
        {viewType === 'aging' && (
          <Grid container spacing={3}>
            {/* Aging Analysis */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Invoice Aging Analysis
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.invoiceAging}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="agingCategory" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                      <Legend />
                      <Bar dataKey="amount" name="Outstanding Amount" fill="#ef4444" />
                      <Bar dataKey="invoiceCount" name="Invoice Count" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Grid container spacing={2}>
                  {reportData.invoiceAging.map((aging, index) => (
                    <Grid item xs={6} md={3} key={aging.agingCategory}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            {aging.agingCategory}
                          </Typography>
                          <Typography variant="h6" color={index > 1 ? 'error.main' : 'inherit'}>
                            {formatCurrency(aging.amount)}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {aging.invoiceCount} invoices
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Overdue Invoices */}
            <Grid item xs={12} lg={4}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Overdue Invoices</Typography>
                  <Badge badgeContent={reportData.overdueInvoices.length} color="error">
                    <WarningIcon color="error" />
                  </Badge>
                </Box>
                <Alert severity="error" sx={{ mb: 2 }}>
                  Total overdue amount: {formatCurrency(reportData.summary.overdueAmount)}
                </Alert>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Invoice #</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Days Overdue</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.overdueInvoices.slice(0, 5).map((invoice) => (
                        <TableRow key={invoice.invoiceId}>
                          <TableCell>
                            <Typography variant="body2">{invoice.invoiceNumber}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(invoice.amount)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${invoice.daysOverdue} days`}
                              size="small"
                              color="error"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {reportData.overdueInvoices.length > 5 && (
                  <Button fullWidth sx={{ mt: 2 }}>View All Overdue Invoices</Button>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Detailed View */}
        {viewType === 'details' && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Invoice Details</Typography>
              <Typography variant="body2" color="textSecondary">
                Showing all invoices based on current filters
              </Typography>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice #</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Paid</TableCell>
                    <TableCell align="right">Balance</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Days Open</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.recentInvoices.map((invoice) => {
                    const daysOpen = Math.floor((new Date() - new Date(invoice.invoiceDate)) / (1000 * 60 * 60 * 24));
                    const isOverdue = invoice.status === 'overdue';
                    
                    return (
                      <TableRow key={invoice.invoiceId} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {invoice.invoiceNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(invoice.invoiceDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {invoice.companyName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color={isOverdue ? 'error.main' : 'inherit'}>
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="medium">
                            {formatCurrency(invoice.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography color="success.main">
                            {formatCurrency(invoice.paidAmount || 0)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography color={invoice.balance > 0 ? 'error.main' : 'success.main'}>
                            {formatCurrency(invoice.balance)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(invoice.status)}
                            label={invoice.status}
                            color={getStatusColor(invoice.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${daysOpen} days`}
                            size="small"
                            color={daysOpen > 60 ? 'error' : daysOpen > 30 ? 'warning' : 'default'}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View Invoice">
                            <IconButton size="small">
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default InvoiceReport;