import React, { useMemo, useState } from "react";
import NotificationItem from "./NotificationItem";

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
      <h1>Notifications</h1>
      <p>{unreadCount} unread notifications</p>

      <div
        style={{
          display: "flex",
          gap: 10,
          margin: "14px 0",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setActiveFilter("all")}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
            background: activeFilter === "all" ? "#3b82f6" : "#f3f4f6",
            color: activeFilter === "all" ? "white" : "#111",
            fontWeight: 600,
          }}
        >
          All ({allCount})
        </button>

        <button
          onClick={() => setActiveFilter("unread")}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
            background: activeFilter === "unread" ? "#3b82f6" : "#f3f4f6",
            color: activeFilter === "unread" ? "white" : "#111",
            fontWeight: 600,
          }}
        >
          Unread ({unreadCount})
        </button>

        <div style={{ flex: 1 }} />

        <button
          onClick={handleMarkAllAsRead}
          disabled={notifications.length === 0 || unreadCount === 0}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
            background:
              notifications.length === 0 || unreadCount === 0 ? "#e5e7eb" : "#111",
            color:
              notifications.length === 0 || unreadCount === 0 ? "#6b7280" : "white",
            fontWeight: 600,
          }}
        >
          Mark all as read
        </button>

        <button
          onClick={handleClearAll}
          disabled={notifications.length === 0}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
            background: notifications.length === 0 ? "#e5e7eb" : "#ef4444",
            color: notifications.length === 0 ? "#6b7280" : "white",
            fontWeight: 600,
          }}
        >
          Clear all
        </button>
      </div>

      <div className="notification-list" style={{ display: "grid", gap: 12 }}>
        {filteredNotifications.length === 0 ? (
          <div
            style={{
              padding: 16,
              borderRadius: 12,
              border: "1px dashed #cbd5e1",
              color: "#6b7280",
            }}
          >
            No notifications to show.
          </div>
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
  );
};

export default NotificationFeed;
