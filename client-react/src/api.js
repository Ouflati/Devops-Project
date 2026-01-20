const API_URL = 'http://localhost:3000/auth';

export async function register(data) {
  return fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function login(data) {
  return fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

export async function me(token) {
  return fetch(`${API_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json());
}

export async function changePassword(token, data) {
  return fetch(`${API_URL}/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}

/* Notifications API helpers */
// NOTE: backend mounts notification routes at /api/notifications.
// Vite proxy rewrites requests starting with /api/node to the backend root,
// so request path should be '/api/node/api/notifications' -> backend '/api/notifications'.
const NOTIF_BASE = '/api/node/api/notifications';

function _getToken(candidate) {
  if (candidate) return candidate;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('token');
    }
  } catch (e) {
    // ignore
  }
  return null;
}

function _authHeaders(token) {
  const t = _getToken(token);
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function getNotifications(token, { limit = 50, offset = 0 } = {}) {
  const headers = _authHeaders(token);
  const res = await fetch(`${NOTIF_BASE}?limit=${limit}&offset=${offset}`, { headers });
  if (!res.ok) {
    let body = null;
    try { body = await res.json(); } catch (e) { /* ignore */ }
    const msg = (body && body.message) || res.statusText || `Status ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}

export async function getUnreadCount(token) {
  const headers = _authHeaders(token);
  const res = await fetch(`${NOTIF_BASE}/unread-count`, { headers });
  if (!res.ok) {
    let body = null;
    try { body = await res.json(); } catch (e) {}
    const msg = (body && body.message) || res.statusText || `Status ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}

export async function markAllNotificationsRead(token) {
  const headers = _authHeaders(token);
  const res = await fetch(`${NOTIF_BASE}/read-all`, {
    method: 'PATCH',
    headers,
  });
  if (!res.ok) {
    let body = null;
    try { body = await res.json(); } catch (e) {}
    const msg = (body && body.message) || res.statusText || `Status ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}

export async function markNotificationRead(token, id) {
  const headers = _authHeaders(token);
  const res = await fetch(`${NOTIF_BASE}/${id}/read`, {
    method: 'PATCH',
    headers,
  });
  if (!res.ok) {
    let body = null;
    try { body = await res.json(); } catch (e) {}
    const msg = (body && body.message) || res.statusText || `Status ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}

export async function deleteNotification(token, id) {
  const headers = _authHeaders(token);
  const res = await fetch(`${NOTIF_BASE}/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) {
    let body = null;
    try { body = await res.json(); } catch (e) {}
    const msg = (body && body.message) || res.statusText || `Status ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}
