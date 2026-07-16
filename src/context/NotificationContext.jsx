import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = "success") => {
    const id = Date.now(); // unique ID for each toast

    setNotifications((prev) => [...prev, { id, message, type, visible: true }]);

    // Auto remove after 5s
    setTimeout(() => hideNotification(id), 5000);
  };

  const hideNotification = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, visible: false } : n))
    );

    // Remove from DOM after fade-out animation (400ms)
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 400);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, hideNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
