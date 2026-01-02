-- Migration 002 : chat messages table

CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at
  ON chat_messages(created_at);

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id
  ON chat_messages(user_id);
