// api-golang/database/db.go
// SQLite version for Step 1 & 2 – NO Docker, NO Postgres
package database

import (
	"database/sql"
	"os"
	"path/filepath"
	"runtime"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

// InitDB initializes the shared SQLite database (dev.db in project root)
func InitDB() error {
	// Calculate path: go up two levels from this file → project root
	_, currentFile, _, _ := runtime.Caller(0)
	rootDir := filepath.Dir(filepath.Dir(filepath.Dir(currentFile)))
	dbPath := filepath.Join(rootDir, "dev.db")

	// Open (and create if not exists) the SQLite file
	var err error
	db, err = sql.Open("sqlite3", dbPath+"?cache=shared&mode=rwc&_fk=1")
	if err != nil {
		return err
	}

	// Test the connection
	return db.Ping()
}

// GetTime returns the current time from SQLite
// Same signature as the original Postgres version → zero code changes elsewhere
func GetTime(ctx *gin.Context) string {
	var tm string

	err := db.QueryRow("SELECT datetime('now')").Scan(&tm)
	if err != nil {
		os.Stderr.WriteString("SQLite query failed: " + err.Error() + "\n")
		os.Exit(1)
	}
	return tm
}

// GetDB exposes the shared SQLite DB instance
func GetDB() *sql.DB {
	return db
}
