package database

import (
	"database/sql"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3" // SQLite driver
)

// DB est en MAJUSCULE pour être exporté et utilisé par tes futurs handlers
var DB *sql.DB

func InitDB() error {
	// Utilise DB_PATH défini dans le docker-compose (/database/dev.db)
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "./dev.db"
	}

	var err error
	// Mode rwc : permet de CRÉER le fichier dev.db s'il n'existe pas dans le volume
	DB, err = sql.Open("sqlite3", dbPath+"?cache=shared&mode=rwc&_fk=1")
	if err != nil {
		return err
	}

	// --- ÉTAPE 3 : CRÉATION AUTOMATIQUE DES TABLES ---
	// Ce code s'exécute à chaque démarrage du container Go
	schema := `
	CREATE TABLE IF NOT EXISTS polls (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		question TEXT NOT NULL,
		type TEXT CHECK(type IN ('single', 'multiple')) NOT NULL,
		created_by INTEGER NOT NULL,
		is_closed INTEGER DEFAULT 0,
		close_at DATETIME,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS poll_options (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		poll_id INTEGER NOT NULL,
		label TEXT NOT NULL,
		FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS poll_votes (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		poll_id INTEGER NOT NULL,
		user_id INTEGER NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,
		UNIQUE(poll_id, user_id)
	);

	CREATE TABLE IF NOT EXISTS poll_vote_options (
		vote_id INTEGER NOT NULL,
		option_id INTEGER NOT NULL,
		PRIMARY KEY (vote_id, option_id),
		FOREIGN KEY (vote_id) REFERENCES poll_votes(id) ON DELETE CASCADE,
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
