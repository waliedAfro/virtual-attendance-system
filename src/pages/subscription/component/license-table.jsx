import React from 'react';
import { useTranslation } from "react-i18next";

export const LicenseTable = ({ licenses, onRevoke, isRevoking }) => {
  const { t, i18n } = useTranslation("subscription");

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE': return 'status-active';
      case 'REVOKED': return 'status-revoked';
      case 'EXPIRED': return 'status-expired';
      case 'PENDING': return 'status-pending';
      default: return '';
    }
  };

  const getStatusTranslation = (status) => {
    return t(`licenseTable.status.${status}`, { defaultValue: status });
  };

  return (
    <table className="license-table">
      <thead>
        <tr>
          <th>{t('licenseTable.headers.licenseId')}</th>
          <th>{t('licenseTable.headers.subscription')}</th>
          <th>{t('licenseTable.headers.device')}</th>
          <th>{t('licenseTable.headers.assignedAt')}</th>
          <th>{t('licenseTable.headers.revokedAt')}</th>
          <th>{t('licenseTable.headers.status')}</th>
          <th>{t('licenseTable.headers.actions')}</th>
        </tr>
      </thead>
      <tbody>
        {licenses.map((license) => (
          <tr key={license.licenseId}>
            <td className="mono">{license.licenseId.substring(0, 8)}...</td>
            <td className="mono">{license.subscriptionId.substring(0, 8)}...</td>
            <td>
              {license.deviceId ? `${license.deviceId.substring(0, 8)}...` : '-'}
            </td>
            <td>{formatDate(license.assignedAt)}</td>
            <td>{formatDate(license.revokedAt)}</td>
            <td>
              <span className={`status-badge ${getStatusClass(license.status)}`}>
                {getStatusTranslation(license.status)}
              </span>
            </td>
            <td>
              {license.status === 'ACTIVE' && (
                <button
                  onClick={() => onRevoke(license.licenseId)}
                  disabled={isRevoking}
                  className="revoke-button"
                >
                  {t('licenseTable.revoke')}
                </button>
              )}
            </td>
          </tr>
        ))}
        {licenses.length === 0 && (
          <tr>
            <td colSpan="7" className="empty-state">
              {t('licenseTable.empty')}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};