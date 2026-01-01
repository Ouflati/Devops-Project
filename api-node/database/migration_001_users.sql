-- Table des utilisateurs (Feature 0)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL, -- Sera stocké hashé (bcrypt)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index pour accélérer la recherche par email ou username lors du login
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);