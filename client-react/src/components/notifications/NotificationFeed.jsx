import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NotificationItem from "./NotificationItem";
import "./notifications.css";
import { fetchNotifications, fetchUnreadCount, markAllNotificationsRead, deleteNotification, markNotificationRead } from "../../api";

const NotificationFeed = ({ token }) => {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("all");

  const isReadParam = activeFilter === "unread" ? 0 : undefined;

  const { data: listData, isLoading: listLoading } = useQuery({
    queryKey: ["notifications", { is_read: isReadParam }],
    queryFn: () => fetchNotifications(token, { limit: 10, offset: 0, is_read: isReadParam, meta: true }),
    enabled: !!token,
  });

  const notifications = listData?.items || [];
  const allCount = listData?.meta?.total ?? notifications.length;

  const { data: unreadData } = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => fetchUnreadCount(token),
    enabled: !!token,
  });

  const unreadCount = unreadData?.unreadCount ?? 0;

  const markAllMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteNotification(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => markNotificationRead(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });

  const handleMarkAllAsRead = () => markAllMutation.mutate();
  const handleClearAll = () => {
    notifications.forEach(n => deleteMutation.mutate(n.id));
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
              disabled={!notifications.length || unreadCount === 0 || markAllMutation.isLoading}
              className="btn"
            >
              {markAllMutation.isLoading ? "Marking..." : "Mark all as read"}
            </button>

            <button
              onClick={handleClearAll}
              disabled={!notifications.length || deleteMutation.isLoading}
              className={`btn ${notifications.length === 0 ? "" : "btn-danger"}`}
            >
              {deleteMutation.isLoading ? "Deleting..." : "Delete all"}
            </button>
          </div>
        </div>
        <div className="notification-list">
          {listLoading && <div className="empty-state">Loading notifications...</div>}
          {!listLoading && notifications.length === 0 && (
            <div className="empty-state">No notifications to show.</div>
          )}
          {!listLoading && notifications.map((n) => (
            <div key={n.id}>
              <NotificationItem
                icon={"🔔"}
                title={n.type}
                message={n.message}
                time={new Date(n.created_at).toLocaleString()}
                isRead={!!n.is_read}
              />
              <div className="notification-actions">
                {!n.is_read && (
                  <button className="btn" onClick={() => markReadMutation.mutate(n.id)}>Mark read</button>
                )}
                <button className="btn btn-danger" onClick={() => deleteMutation.mutate(n.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationFeed;
