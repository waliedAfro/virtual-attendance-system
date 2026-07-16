import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from "react-i18next";

export const AssignUserModal = ({
  isOpen,
  onClose,
  onAssign,
  subscriptionId,
  isAssigning,
}) => {
  const [userId, setUserId] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const { t, i18n } = useTranslation("subscription");

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoadingUsers(true);
      axios.get('/api/users')
        .then(response => setUsers(response.data))
        .catch(error => console.error('Failed to load users', error))
        .finally(() => setLoadingUsers(false));
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId) return;
    onAssign({ subscriptionId, userId, deviceId: deviceId || undefined });
    setUserId('');
    setDeviceId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="lincense-modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">{t('assignUserModal.title')}</h3>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">{t('assignUserModal.selectUser')}</label>
            {loadingUsers ? (
              <div>{t('assignUserModal.loadingUsers')}</div>
            ) : (
              <select
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                className="form-input"
              >
                <option value="">{t('assignUserModal.chooseUser')}</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">{t('assignUserModal.deviceId')}</label>
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
              {t('assignUserModal.cancel')}
            </button>
            <button
              type="submit"
              disabled={isAssigning || loadingUsers || !userId}
              className="submit-button"
            >
              {isAssigning ? t('assignUserModal.assigning') : t('assignUserModal.assign')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};