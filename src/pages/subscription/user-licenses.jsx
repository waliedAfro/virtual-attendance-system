import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLicenses } from './hooks/useLicenses';
import { LicenseTable } from './component/license-table';
import { AssignLicenseModal } from './component/assign-license-modal';
import './css/user-licenses.css';

export const UserLicenses = () => {
 const { t, i18n } = useTranslation("subscription");
  const { userId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    licenses,
    isLoading,
    error,
    revokeLicense,
    assignLicense,
    isRevoking,
    isAssigning,
  } = useLicenses(userId);

  const handleRevoke = (licenseId) => {
    if (window.confirm(t('userLicenses.revokeConfirmation.text'))) {
      revokeLicense(licenseId);
    }
  };

  if (!userId) {
    return <div className="message error-message">{t('userLicenses.missingUserId')}</div>;
  }

  if (isLoading) {
    return <div className="message">{t('userLicenses.loading')}</div>;
  }

  if (error) {
    return (
      <div className="message error-message">
        {t('userLicenses.error', { error: error.message })}
      </div>
    );
  }

  return (
    <div className="user-licenses-container">
      <div className="user-licenses-header">
        <h1 className="user-licenses-title">{t('userLicenses.title')}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="assign-btn"
        >
          {t('userLicenses.assignNew')}
        </button>
      </div>

      <LicenseTable
        licenses={licenses}
        onRevoke={handleRevoke}
        isRevoking={isRevoking}
      />

      <AssignLicenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssign={assignLicense}
        userId={userId}
        isAssigning={isAssigning}
      />
    </div>
  );
};