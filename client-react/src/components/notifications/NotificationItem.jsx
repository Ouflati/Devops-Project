import React from "react";

const NotificationItem = ({ id, icon, title, message, time, isRead, onMarkRead }) => {
  const handleClick = () => {
    if (!isRead && typeof onMarkRead === 'function') onMarkRead(id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
      className={`notification-item ${isRead ? "read" : "unread"}`}
    >
      <div className="notification-icon">{icon}</div>

      <div className="notification-content">
        <div className="notification-title-row">{title}</div>
        <div className="notification-message">{message}</div>
        <div className="notification-time">{time}</div>
      </div>

      {!isRead && <div className="unread-dot" />}
    </div>
  );
};

export default NotificationItem;
