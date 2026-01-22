// api-golang/database/db.go
// SQLite version for Step 1 & 2 – NO Docker, NO Postgres
package database

import (
	"database/sql"
	"os"
	"path/filepath"
	"runtime" // <--- AJOUTE CETTE LIGNE ICI
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3" // SQLite driver
)

var db *sql.DB

// InitDB initializes the shared SQLite database (dev.db in project root)
func InitDB() error {
    var dbPath string

    // 1. D'abord, on regarde si une variable d'environnement est définie (pour Docker)
    if envPath := os.Getenv("DB_PATH"); envPath != "" {
        dbPath = envPath
    } else {
        // 2. Sinon, on utilise la méthode locale (pour ton PC)
        _, currentFile, _, _ := runtime.Caller(0)
        rootDir := filepath.Dir(filepath.Dir(filepath.Dir(currentFile)))
        dbPath = filepath.Join(rootDir, "dev.db")
    }

    // Open (and create if not exists) the SQLite file
    var err error
    db, err = sql.Open("sqlite3", dbPath+"?cache=shared&mode=rwc&_fk=1")
    if err != nil {
        return err
    }

    return db.Ping()
}

// GetTime returns the current time from SQLite
// Same signature as the original Postgres version → zero code changes elsewhere
func GetTime(ctx *gin.Context) time.Time {
	var tm time.Time

	// SQLite: datetime('now') or CURRENT_TIMESTAMP both work
	err := db.QueryRow("SELECT datetime('now')").Scan(&tm)
	if err != nil {
		// In real apps you would return an error, but we keep original behavior
		// (crash loudly so students see something is wrong)
		os.Stderr.WriteString("SQLite query failed: " + err.Error() + "\n")
		os.Exit(1)
	}
	return tm
}