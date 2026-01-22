const { openDb } = require('../db');

async function createUser(username, email, hashedPassword) {
  const db = await openDb();
  const result = await db.run(
    `INSERT INTO users (username, email, password)
     VALUES (?, ?, ?)`,
    [username, email, hashedPassword]
  );
  await db.close();
  return result.lastID;
}

async function findByEmailOrUsername(identifier) {
  const db = await openDb();
  const user = await db.get(
    `SELECT * FROM users WHERE email = ? OR username = ?`,
    [identifier, identifier]
  );
  await db.close();
  return user;
}

async function findById(id) {
  const db = await openDb();
  const user = await db.get(
    `SELECT id, username, email FROM users WHERE id = ?`,
    [id]
  );
  await db.close();
  return user;
}

async function findByIdWithPassword(id) {
  const db = await openDb();
  const user = await db.get(
    `SELECT * FROM users WHERE id = ?`,
    [id]
  );
  await db.close();
  return user;
}

module.exports = { createUser, findByEmailOrUsername, findById, findByIdWithPassword };
