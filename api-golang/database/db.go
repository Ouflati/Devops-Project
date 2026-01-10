package database

import (
	"database/sql"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3" // SQLite driver
)

// DB est accessible globalement
var DB *sql.DB

func InitDB() error {
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./dev.db"
	}

	var err error
	// Options: cache=shared, mode=rwc, _fk=1 (active foreign keys)
	DB, err = sql.Open("sqlite3", dbPath+"?cache=shared&mode=rwc&_fk=1")
	if err != nil {
		return err
	}

	// Schéma aligné EXACTEMENT sur repository.go
	schema := `
	CREATE TABLE IF NOT EXISTS polls (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		question TEXT NOT NULL,
		type TEXT CHECK(type IN ('single', 'multiple')) NOT NULL,
		created_by INTEGER NOT NULL,
		is_closed BOOLEAN DEFAULT 0,
		ends_at DATETIME,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS poll_options (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		poll_id INTEGER NOT NULL,
		option_text TEXT NOT NULL,  -- ✅ Correction: "option_text" machi "text"
		FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
	);

	-- ✅ Correction: Table "votes" simple bach tmchi m3a Repository
	CREATE TABLE IF NOT EXISTS votes (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		poll_id INTEGER NOT NULL,
		option_id INTEGER NOT NULL,
		user_id INTEGER NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		UNIQUE (poll_id, user_id, option_id),
		FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
		FOREIGN KEY (option_id) REFERENCES poll_options(id) ON DELETE CASCADE
	);`

	_, err = DB.Exec(schema)
	if err != nil {
		return err
	}

	return DB.Ping()
}

func GetTime(ctx *gin.Context) string {
	var now string
	row := DB.QueryRow("SELECT datetime('now', 'localtime')")
	err := row.Scan(&now)
	if err != nil {
		os.Stderr.WriteString("SQLite query failed: " + err.Error() + "\n")
		return "Error fetching time"
	}
	return now
}