package database

import (
	"database/sql"
	"os"
	"path/filepath"
	"runtime"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

// InitDB initializes the shared SQLite database
func InitDB() error {
	// go up to project root
	_, currentFile, _, _ := runtime.Caller(0)
	rootDir := filepath.Dir(filepath.Dir(filepath.Dir(currentFile)))
	dbPath := filepath.Join(rootDir, "dev.db")

	var err error
	db, err = sql.Open("sqlite3", dbPath+"?cache=shared&mode=rwc&_fk=1")
	if err != nil {
		return err
	}

	// test connection
	if err := db.Ping(); err != nil {
		return err
	}

	// run migrations
	return Migrate()
}

func GetTime(ctx *gin.Context) time.Time {
	var s string

	err := db.QueryRow("SELECT datetime('now')").Scan(&s)
	if err != nil {
		os.Stderr.WriteString("SQLite query failed: " + err.Error() + "\n")
		os.Exit(1)
	}

	t, _ := time.Parse("2006-01-02 15:04:05", s)
	return t
}

func Migrate() error {
	query := `
CREATE TABLE IF NOT EXISTS calendar (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	description TEXT,
	start_date TEXT NOT NULL,
	end_date TEXT NOT NULL,
	user_id INTEGER,
	created_at TEXT DEFAULT CURRENT_TIMESTAMP
);`

	_, err := db.Exec(query)
	return err
}

func DB() *sql.DB {
	return db
}
