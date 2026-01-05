# DB Schema Summary – Team 4 (Global Search)

## Base de données
- Type: SQLite
- Fichier: dev.db (racine du projet)
- Connexion: api-golang/database/db.go
- Remarque: db.go gère la connexion uniquement (pas de CREATE TABLE)

## Table: users (Team 1 – Auth)
Source:
- Branche: origin/feature/auth
- Migration DB côté Node + SQL validé
- DB: SQLite

Champs:
- id (PK)
- username (unique, not null)
- email (unique, not null)
- password (not null)
- created_at (default current_timestamp)

Champs recherchables:
- username
- email

## Table: tasks (Team 2)
Source:
- Script SQL validé (Team 2)

Champs:
- id (PK)
- title (not null)
- description
- status (TODO / IN_PROGRESS / DONE)
- priority (LOW / MEDIUM / HIGH)
- due_date
- assigned_to (FK -> users.id)
- created_at (default current_timestamp)

Champs recherchables:
- title
- description

Relations:
- tasks.assigned_to → users.id

## Table: calendar (Team 7 – Events)
Source:
- Branche: origin/feature/calendar
- Fichier: api-golang/database/calendar.sql

Champs:
- id (PK)
- title (NOT NULL)
- description
- start_date (NOT NULL)
- end_date (NOT NULL)
- user_id
- created_at (default CURRENT_TIMESTAMP)

Champs recherchables:
- title
- description


## Table: chat_messages (Team 3 – Chat)
Source:
- Branche: origin/feature/team3-chat
- Fichier: api-node/database/migration_002_chat_messages.sql

Champs:
- id (PK)
- user_id (FK -> users.id)
- content (TEXT, NOT NULL)
- created_at (default CURRENT_TIMESTAMP)

Champs recherchables:
- content
