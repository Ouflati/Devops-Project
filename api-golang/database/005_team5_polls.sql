-- Polls table
CREATE TABLE  polls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    type TEXT CHECK(type IN ('single','multiple')) NOT NULL,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ends_at DATETIME,
    is_closed BOOLEAN DEFAULT 0
);

-- Poll options
CREATE TABLE  poll_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poll_id INTEGER NOT NULL,
    option_text TEXT NOT NULL,
    FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
);

-- Votes
CREATE TABLE  votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poll_id INTEGER NOT NULL,
    option_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (poll_id, user_id, option_id),
    FOREIGN KEY (poll_id) REFERENCES polls(id),
    FOREIGN KEY (option_id) REFERENCES poll_options(id)
);
