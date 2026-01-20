import React, { useEffect, useMemo, useState } from "react";
import NotificationItem from "./NotificationItem";
import "./notifications.css";
import { getNotifications, markAllNotificationsRead, markNotificationRead, deleteNotification } from "../../api";
import AuthApp from "../../AuthApp";
import { formatDistanceToNow } from "date-fns"; // You might need to install this or use native Intl

// Simple icon mapping
const getIconForType = (type) => {
  switch (type) {
    case 'info': return 'ℹ️';
    case 'warning': return '⚠️';
    case 'success': return '✅';
    case 'error': return '❌';
    default: return 'bell';
  }
};

const NotificationFeed = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(() => {
    try { return typeof window !== 'undefined' ? window.localStorage.getItem('token') : null; } catch (e) { return null; }
  });

  const [activeFilter, setActiveFilter] = useState("all");

  const allCount = notifications.length;

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "unread") {
      return notifications.filter((n) => !n.is_read);
    }
    return notifications;
  }, [notifications, activeFilter]);

  const handleMarkAllAsRead = () => {
    // optimistic update + backend
    (async () => {
      try {
        await markAllNotificationsRead(token);
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
      } catch (err) {
        console.error(err);
        setError('Unable to mark all as read');
      }
    })();
  };

  const handleClearAll = () => {
    // delete each notification on backend then clear local state
    (async () => {
      try {
        await Promise.all(notifications.map((n) => deleteNotification(token, n.id)));
        setNotifications([]);
      } catch (err) {
        console.error(err);
        setError('Unable to clear notifications');
      }
    })();
  };

  // mark single notification as read
  const handleMarkAsRead = (id) => {
    (async () => {
      try {
        await markNotificationRead(token, id);
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n)));
      } catch (err) {
        console.error(err);
        setError('Unable to mark notification as read');
      }
    })();
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // require authentication token
      if (!token) {
        setNotifications([]);
        setLoading(false);
        setError('Token manquant — veuillez vous connecter.');
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await getNotifications(token);
        if (!cancelled) setNotifications(data || []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError(err.message || 'Failed to load notifications');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  // listen for login events (other tabs or AuthApp storing token)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'token') setToken(e.newValue);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

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
          {!token ? (
            <div className="empty-state">
              <div style={{ marginBottom: 12 }}>Token manquant — veuillez vous connecter pour voir vos notifications.</div>
              <AuthApp />
            </div>
          ) : loading ? (
            <div className="empty-state">Loading notifications...</div>
          ) : error ? (
            <div className="empty-state">{error}</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state">No notifications to show.</div>
          ) : (
            filteredNotifications.map((n) => (
              <NotificationItem
                key={n.id}
                id={n.id}
                icon={getIconForType(n.type)}
                title={n.type.toUpperCase()} // or n.title if backend adds it
                message={n.message}
                time={n.created_at ? new Date(n.created_at).toLocaleString() : 'Just now'}
                isRead={!!n.is_read} // Backend uses is_read (0/1)
                onMarkRead={() => handleMarkAsRead(n.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationFeed;
