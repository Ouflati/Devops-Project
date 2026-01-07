const { openDb } = require('../db');

async function getNotifications(userId, limit = 10, offset = 0) {
  const db = await openDb();
  const notifications = await db.all(
    `SELECT * FROM notifications 
     WHERE user_id = ? 
     ORDER BY created_at DESC 
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  );
  await db.close();
  return notifications;
}

// NEW: Filtered + meta-aware fetch (returns items and total)
async function getNotificationsFiltered(userId, { limit = 10, offset = 0, isRead, type, sort = 'desc' } = {}) {
  const db = await openDb();

  const whereClauses = ['user_id = ?'];
  const params = [userId];

  if (isRead !== undefined && isRead !== null && isRead !== '') {
    whereClauses.push('is_read = ?');
    params.push(Number(isRead));
  }
  if (type) {
    whereClauses.push('type = ?');
    params.push(type);
  }

  const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
  const orderSQL = sort && sort.toLowerCase() === 'asc' ? 'ORDER BY created_at ASC' : 'ORDER BY created_at DESC';

  // Total count
  const totalRow = await db.get(
    `SELECT COUNT(*) as total FROM notifications ${whereSQL}`,
    params
  );

  // Paged items
  const items = await db.all(
    `SELECT * FROM notifications ${whereSQL} ${orderSQL} LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  await db.close();
  return { items, total: totalRow ? totalRow.total : 0 };
}

async function countUnread(userId) {
  const db = await openDb();
  const result = await db.get(
    `SELECT COUNT(*) as count FROM notifications 
     WHERE user_id = ? AND is_read = 0`,
    [userId]
  );
  await db.close();
  return result ? result.count : 0;
}

async function markAsRead(id, userId) {
  const db = await openDb();
  const result = await db.run(
    `UPDATE notifications SET is_read = 1 
     WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  await db.close();
  return result.changes > 0;
}

async function markAllAsRead(userId) {
  const db = await openDb();
  const result = await db.run(
    `UPDATE notifications SET is_read = 1 
     WHERE user_id = ?`,
    [userId]
  );
  await db.close();
  return result.changes;
}

async function getNotificationById(id, userId) {
  const db = await openDb();
  const notification = await db.get(
    `SELECT * FROM notifications 
     WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  await db.close();
  return notification;
}

async function createNotification(userId, type, message) {
  const db = await openDb();
  const result = await db.run(
    `INSERT INTO notifications (user_id, type, message) 
     VALUES (?, ?, ?)`,
    [userId, type, message]
  );
  await db.close();
  return result.lastID;
}

async function updateNotification(id, userId, updates) {
  const db = await openDb();
  const { type, message, is_read } = updates;
  const fields = [];
  const values = [];

  if (type !== undefined) {
    fields.push('type = ?');
    values.push(type);
  }
  if (message !== undefined) {
    fields.push('message = ?');
    values.push(message);
  }
  if (is_read !== undefined) {
    fields.push('is_read = ?');
    values.push(is_read);
  }

  if (fields.length === 0) {
    await db.close();
    return false;
  }

  values.push(id, userId);
  const result = await db.run(
    `UPDATE notifications SET ${fields.join(', ')} 
     WHERE id = ? AND user_id = ?`,
    values
  );
  await db.close();
  return result.changes > 0;
}

async function deleteNotification(id, userId) {
  const db = await openDb();
  const result = await db.run(
    `DELETE FROM notifications 
     WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  await db.close();
  return result.changes > 0;
}

module.exports = {
  getNotifications,
  getNotificationsFiltered,
  getNotificationById,
  countUnread,
  markAsRead,
  markAllAsRead,
  createNotification,
  updateNotification,
  deleteNotification
};