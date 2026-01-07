import React from "react";

const NotificationItem = ({ icon, title, message, time, isRead }) => {
  return (
    <div className={`notification-item ${isRead ? "read" : "unread"}`}>
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
