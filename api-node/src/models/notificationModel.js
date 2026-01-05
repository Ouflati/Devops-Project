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

module.exports = {
  getNotifications,
  countUnread,
  markAsRead,
  markAllAsRead,
  createNotification
};