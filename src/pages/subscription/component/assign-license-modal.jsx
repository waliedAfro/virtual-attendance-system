import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
export const AssignLicenseModal = ({
  isOpen,
  onClose,
  onAssign,
  userId,
  isAssigning,
}) => {
  const [subscriptionId, setSubscriptionId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const { t, i18n } = useTranslation("subscription");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign({ subscriptionId, deviceId: deviceId || undefined, userId });
    setSubscriptionId('');
    setDeviceId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="lisence-modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">{t('assignLicenseModal.title')}</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">{t('assignLicenseModal.subscriptionId')}</label>
            <input
              type="text"
              value={subscriptionId}
              onChange={(e) => setSubscriptionId(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('assignLicenseModal.deviceId')}</label>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-button"
            >
              {t('assignLicenseModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={isAssigning}
              className="submit-button"
            >
              {isAssigning ? t('assignLicenseModal.assigning') : t('assignLicenseModal.assign')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};