import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import "./css/home.css";
import useApi from "../../hooks/useApi";
import { DashboardService } from "../../services/dashboardService";
import { useTranslation } from "react-i18next";


const Home = () => {
  const navigate = useNavigate();
const { t, i18n } = useTranslation("dashboard");
  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  const {
    data: dashboardData,
    loading,
    error,
    execute: refresh,
  } = useApi(DashboardService.getDashboard, [], true);

  // Use translation suffixes for formatting
  const formatPercent = (value) =>
    value != null ? `${Number(value).toFixed(1)}${t('formats.percentSuffix')}` : "N/A";

  const formatMinutes = (value) =>
    value != null ? `${Number(value).toFixed(1)} ${t('formats.minutesSuffix')}` : "N/A";

  const handleRefresh = () => {
    refresh();
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>{t('home.title')}</h1>
        <div className="header-actions">
          <button className="btn-refresh" onClick={handleRefresh} disabled={loading}>
            {loading ? t('home.buttons.refreshing') : t('home.buttons.refresh')}
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            {t('home.buttons.logout')}
          </button>
        </div>
      </div>

      <h2>{t('dashboard.currentMonthOverview')}</h2>

      {error && (
        <div className="error-message">
          <p>{t('status.errorLoading')}</p>
          <button className="btn-retry" onClick={handleRefresh}>
            {t('home.buttons.retry')}
          </button>
        </div>
      )}

      {loading && !dashboardData && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{t('status.loadingDashboard')}</p>
        </div>
      )}

      {!loading && !error && dashboardData && (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>{t('dashboard.cards.activeEmployees')}</h3>
            <p className="card-value">{dashboardData.activeEmployee ?? 0}</p>
          </div>
          <div className="dashboard-card">
            <h3>{t('dashboard.cards.totalCheckIns')}</h3>
            <p className="card-value">{dashboardData.totalCheckIn ?? 0}</p>
          </div>
          <div className="dashboard-card">
            <h3>{t('dashboard.cards.onTimeCheckIns')}</h3>
            <p className="card-value">{dashboardData.onTimeCheckIn ?? 0}</p>
          </div>
          <div className="dashboard-card">
            <h3>{t('dashboard.cards.onTimePercentage')}</h3>
            <p className="card-value">{formatPercent(dashboardData.onTimePercentage)}</p>
          </div>
          <div className="dashboard-card">
            <h3>{t('dashboard.cards.averageLateMinutes')}</h3>
            <p className="card-value">{formatMinutes(dashboardData.averageLateMinute)}</p>
          </div>
        </div>
      )}

      {!loading && !error && !dashboardData && (
        <div className="empty-state">
          <p>{t('dashboard.emptyState')}</p>
        </div>
      )}
    </div>
  );
};

export default Home;