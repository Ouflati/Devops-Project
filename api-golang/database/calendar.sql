CREATE TABLE IF NOT EXISTS calendar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    start_time TEXT DEFAULT '00:00',
    end_time TEXT DEFAULT '00:00',
    user_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
