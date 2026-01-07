package database

import (
	"database/sql"
	"os"
	"path/filepath"
	"runtime"
	"sort"
	"strings"
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

// Migrate executes all SQL files in api-golang/migrations
func Migrate() error {
	_, currentFile, _, _ := runtime.Caller(0)
	rootDir := filepath.Dir(filepath.Dir(filepath.Dir(currentFile)))
	migrationsDir := filepath.Join(rootDir, "api-golang", "migrations")

	entries, err := os.ReadDir(migrationsDir)
	if err != nil {
		return err
	}

	// ✅ table pour ne pas rejouer les migrations à chaque démarrage
	if _, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			filename TEXT PRIMARY KEY,
			applied_at TEXT DEFAULT CURRENT_TIMESTAMP
		);
	`); err != nil {
		return err
	}

	applied := map[string]bool{}
	rows, err := db.Query(`SELECT filename FROM schema_migrations;`)
	if err != nil {
		return err
	}
	for rows.Next() {
		var fn string
		if err := rows.Scan(&fn); err != nil {
			rows.Close()
			return err
		}
		applied[fn] = true
	}
	rows.Close()

	var files []string
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		if strings.HasSuffix(entry.Name(), ".sql") {
			files = append(files, filepath.Join(migrationsDir, entry.Name()))
		}
	}

	// Ensure migrations run in order: 001_, 002_, etc.
	sort.Strings(files)

	for _, file := range files {
		filename := filepath.Base(file)
		if applied[filename] {
			continue
		}

		content, err := os.ReadFile(file)
		if err != nil {
			return err
		}

		tx, err := db.Begin()
		if err != nil {
			return err
		}

		// ✅ exécuter les statements un par un
		stmts := strings.Split(string(content), ";")
		for _, s := range stmts {
			stmt := strings.TrimSpace(s)
			if stmt == "" {
				continue
			}
			if _, err := tx.Exec(stmt); err != nil {
				// ✅ si colonne déjà ajoutée, on ignore
				if strings.Contains(err.Error(), "duplicate column name") {
					continue
				}
				tx.Rollback()
				return err
			}
		}

		// marquer la migration comme appliquée
		if _, err := tx.Exec(`INSERT OR IGNORE INTO schema_migrations(filename) VALUES (?);`, filename); err != nil {
			tx.Rollback()
			return err
		}

		if err := tx.Commit(); err != nil {
			return err
		}
	}

	return nil
}

func DB() *sql.DB {
	return db
}
