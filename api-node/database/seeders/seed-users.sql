INSERT INTO users (id, username, email, password, bio, display_name, theme, timezone)
VALUES
(1, 'imane', 'imane@test.com', 'hashedpassword', 'Backend dev', 'Imane', 'light', 'Africa/Casablanca'),
(2, 'rim', 'rim@test.com', 'hashedpassword', 'DB & models', 'Rim', 'dark', 'Africa/Casablanca')
ON CONFLICT (id) DO NOTHING;
