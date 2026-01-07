import React, { useMemo, useState } from "react";
import NotificationItem from "./NotificationItem";
import "./notifications.css";

const NotificationFeed = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: "!",
      title: "New Message",
      message: "Hey! Are we still meeting tomorrow?",
      time: "5m ago",
      isRead: false,
    },
    {
      id: 2,
      icon: "✓",
      title: "Task Updated",
      message: 'Your task "Notifications UI" was updated.',
      time: "30m ago",
      isRead: true,
    },
    {
      id: 3,
      icon: "★",
      title: "New Comment",
      message: 'Someone commented: "Looks great!"',
      time: "2h ago",
      isRead: false,
    },
  ]);

  const [activeFilter, setActiveFilter] = useState("all");

  const allCount = notifications.length;

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "unread") {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, activeFilter]);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="notification-page">
      <div className="notification-wrapper">
        <div className="notification-header-card">
          <div className="notification-header">
            <div>
              <h1 className="notification-title">Notifications</h1>
              <p className="notification-subtitle">{unreadCount} unread notifications</p>
            </div>
          </div>

          <div className="notification-toolbar">
            <div className="notification-tabs">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`btn ${activeFilter === "all" ? "btn-primary" : ""}`}
              >
                All ({allCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter("unread")}
                className={`btn ${activeFilter === "unread" ? "btn-primary" : ""}`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            <div className="spacer" />

            <button
              onClick={handleMarkAllAsRead}
              disabled={notifications.length === 0 || unreadCount === 0}
              className="btn"
            >
              Mark all as read
            </button>

            <button
              onClick={handleClearAll}
              disabled={notifications.length === 0}
              className={`btn ${notifications.length === 0 ? "" : "btn-danger"}`}
            >
              Clear all
            </button>
          </div>
        </div>

        <div className="notification-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">No notifications to show.</div>
          ) : (
            filteredNotifications.map((n) => (
              <NotificationItem
                key={n.id}
                icon={n.icon}
                title={n.title}
                message={n.message}
                time={n.time}
                isRead={n.isRead}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationFeed;
