import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function setupTestDB() {
  const db = await open({
    filename: ':memory:', // base en mémoire pour les tests
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  return db;
}
