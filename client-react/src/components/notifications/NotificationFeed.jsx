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

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  return (
    <div className="notification-page">
      <h1>Notifications</h1>
      <p>{unreadCount} unread notifications</p>

      <div className="notification-list" style={{ display: "grid", gap: 12 }}>
        {notifications.map((n) => (
          <NotificationItem
            key={n.id}
            icon={n.icon}
            title={n.title}
            message={n.message}
            time={n.time}
            isRead={n.isRead}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationFeed;
