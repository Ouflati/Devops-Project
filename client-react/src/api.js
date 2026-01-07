// Proxy base (see vite.config.js): '/api/node' → http://localhost:3000
const API_BASE = '/api/node';
const AUTH_URL = `${API_BASE}/auth`;
const NOTIF_URL = `${API_BASE}/api/notifications`;

export async function register(data) {
  return fetch(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function login(data) {
  return fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function me(token) {
  return fetch(`${AUTH_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json());
}

export async function changePassword(token, data) {
  return fetch(`${AUTH_URL}/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

// --- Notifications API ---
export async function fetchNotifications(token, { limit = 10, offset = 0, is_read, type, sort = 'desc', meta = true } = {}) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  params.set('sort', sort);
  if (meta) params.set('meta', 'true');
  if (is_read !== undefined) params.set('is_read', String(is_read));
  if (type) params.set('type', type);

  return fetch(`${NOTIF_URL}?${params.toString()}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json());
}

export async function fetchUnreadCount(token) {
  return fetch(`${NOTIF_URL}/unread-count`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json());
}

export async function markNotificationRead(token, id) {
  return fetch(`${NOTIF_URL}/${id}/read`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json());
}

export async function markAllNotificationsRead(token) {
  return fetch(`${NOTIF_URL}/read-all`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json());
}

export async function deleteNotification(token, id) {
  return fetch(`${NOTIF_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json());
}
