import { useNotification } from "../context/NotificationContext";
import "./css/notification.css";
const NotificationUI = () => {
  const { notifications, hideNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map((note) => (
        <div
          key={note.id}
          className={`toast ${note.type} ${note.visible ? "show" : "hide"}`}
        >
          <div className="toast-icon">
            {note.type === "success" ? "✔️" : "⚠️"}
          </div>

          <div className="toast-message">{note.message}</div>

          <button
            className="toast-close"
            onClick={() => hideNotification(note.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationUI;
