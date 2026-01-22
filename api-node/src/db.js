const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const dbPath = path.join(__dirname, '..', '..', 'dev.db');

async function openDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}

const getDateTime = async () => {
  const db = await openDb();
  try {
    const row = await db.get("SELECT datetime('now') AS now");
    return { now: row.now };
  } finally {
    await db.close();
  }
};

module.exports = { openDb, getDateTime };
