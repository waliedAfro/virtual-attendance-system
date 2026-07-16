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
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  TextField,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as AttachMoneyIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Download as DownloadIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const RevenueReport = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [timeRange, setTimeRange] = useState('month');
  const [filter, setFilter] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
    companyId: 'all',
    subscriptionPlan: 'all'
  });

  const [reportData, setReportData] = useState({
    summary: {
      totalRevenue: 0,
      totalInvoices: 0,
      paidInvoices: 0,
      outstandingAmount: 0,
      avgRevenuePerCustomer: 0,
      revenueGrowth: 0
    },
    monthlyData: [],
    topCustomers: [],
    revenueByPlan: [],
    revenueByPaymentMethod: [],
    invoices: []
  });

  const [companies, setCompanies] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchReportData();
    fetchCompanies();
    fetchPlans();
  }, [filter, timeRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        timeRange,
        startDate: filter.startDate.toISOString(),
        endDate: filter.endDate.toISOString(),
        companyId: filter.companyId,
        subscriptionPlan: filter.subscriptionPlan
      });

      const response = await fetch(`/api/reports/revenue?${params}`);
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError('Failed to fetch revenue report data');
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

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/subscription-plans');
      const data = await response.json();
      setPlans(data);
    } catch (err) {
      console.error('Failed to fetch plans');
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
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const handleExportReport = async (format = 'csv') => {
    try {
      const params = new URLSearchParams({
        ...filter,
        startDate: filter.startDate.toISOString(),
        endDate: filter.endDate.toISOString(),
        format
      });

      const response = await fetch(`/api/reports/revenue/export?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue-report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export report');
    }
  };

  const handleChartTypeChange = (event, newType) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  // Chart colors
  const COLORS = ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
  const PAYMENT_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

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
              Revenue Report
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Analyze revenue, growth, and financial performance
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={handleChartTypeChange}
              size="small"
            >
              <ToggleButton value="bar">
                <BarChartIcon />
              </ToggleButton>
              <ToggleButton value="line">
                <LineChartIcon />
              </ToggleButton>
              <ToggleButton value="pie">
                <PieChartIcon />
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => handleExportReport('csv')}
            >
              Export CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => handleExportReport('pdf')}
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
              <FormControl fullWidth>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Time Range"
                >
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="quarter">This Quarter</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
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
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Subscription Plan</InputLabel>
                <Select
                  value={filter.subscriptionPlan}
                  onChange={(e) => setFilter({ ...filter, subscriptionPlan: e.target.value })}
                  label="Subscription Plan"
                >
                  <MenuItem value="all">All Plans</MenuItem>
                  {plans.map((plan) => (
                    <MenuItem key={plan.planId} value={plan.planId}>
                      {plan.planName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<FilterIcon />}
                onClick={fetchReportData}
                fullWidth
                sx={{ height: '56px' }}
              >
                Apply Filters
              </Button>
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
                  <Typography color="textSecondary">Total Revenue</Typography>
                </Box>
                <Typography variant="h4">
                  {formatCurrency(reportData.summary.totalRevenue)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  {reportData.summary.revenueGrowth > 0 ? (
                    <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                  ) : (
                    <TrendingDownIcon color="error" sx={{ mr: 1 }} />
                  )}
                  <Typography 
                    variant="body2" 
                    color={reportData.summary.revenueGrowth > 0 ? 'success.main' : 'error.main'}
                  >
                    {formatPercent(reportData.summary.revenueGrowth)} vs previous period
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
                  <Typography color="textSecondary">Total Invoices</Typography>
                </Box>
                <Typography variant="h4">
                  {reportData.summary.totalInvoices}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {reportData.summary.paidInvoices} paid • {reportData.summary.totalInvoices - reportData.summary.paidInvoices} outstanding
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PaymentIcon color="warning" sx={{ mr: 2 }} />
                  <Typography color="textSecondary">Outstanding</Typography>
                </Box>
                <Typography variant="h4">
                  {formatCurrency(reportData.summary.outstandingAmount)}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={((reportData.summary.totalRevenue - reportData.summary.outstandingAmount) / reportData.summary.totalRevenue) * 100}
                  sx={{ mt: 2, height: 6, borderRadius: 3 }}
                />
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  Collection Rate: {Math.round(((reportData.summary.totalRevenue - reportData.summary.outstandingAmount) / reportData.summary.totalRevenue) * 100)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoneyIcon color="success" sx={{ mr: 2 }} />
                  <Typography color="textSecondary">Avg. per Customer</Typography>
                </Box>
                <Typography variant="h4">
                  {formatCurrency(reportData.summary.avgRevenuePerCustomer)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Based on {reportData.topCustomers.length} active customers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          {/* Revenue Trend Chart */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Revenue Trend
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={reportData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                      <Legend />
                      <Bar dataKey="revenue" name="Revenue" fill="#667eea" />
                      <Bar dataKey="invoices" name="Invoices" fill="#764ba2" />
                    </BarChart>
                  ) : chartType === 'line' ? (
                    <LineChart data={reportData.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#667eea" strokeWidth={2} />
                      <Line type="monotone" dataKey="target" name="Target" stroke="#f59e0b" strokeDasharray="5 5" />
                    </LineChart>
                  ) : (
                    <PieChart>
                      <Pie
                        data={reportData.revenueByPlan}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${formatCurrency(entry.value)}`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.revenueByPlan.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Revenue by Plan */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Revenue by Plan
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.revenueByPlan}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {reportData.revenueByPlan.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                {reportData.revenueByPlan.map((plan, index) => (
                  <Box key={plan.name} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          bgcolor: COLORS[index % COLORS.length],
                          borderRadius: '2px',
                          mr: 1
                        }}
                      />
                      <Typography variant="body2">{plan.name}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(plan.value)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Top Customers */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Top Customers
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Company</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Invoices</TableCell>
                      <TableCell align="right">Avg. Invoice</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.topCustomers.map((customer) => (
                      <TableRow key={customer.companyId}>
                        <TableCell>
                          <Typography fontWeight="medium">{customer.companyName}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="bold">
                            {formatCurrency(customer.revenue)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">{customer.invoiceCount}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(customer.revenue / customer.invoiceCount)}
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
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportData.invoices.slice(0, 5).map((invoice) => (
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
                            label={invoice.status}
                            size="small"
                            color={
                              invoice.status === 'paid' ? 'success' :
                              invoice.status === 'overdue' ? 'error' :
                              invoice.status === 'sent' ? 'info' : 'default'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default RevenueReport;