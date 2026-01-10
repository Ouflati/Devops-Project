package test

import (
	"database/sql"
	"testing"
	"api-golang/poll"
	_ "github.com/mattn/go-sqlite3"
)

func TestPollDatabaseIntegration(t *testing.T) {
	db, _ := sql.Open("sqlite3", ":memory:")
	defer db.Close()

	// Migration complète avec toutes les colonnes (ends_at, type, is_closed)
	db.Exec(`
		CREATE TABLE polls (
			id INTEGER PRIMARY KEY AUTOINCREMENT, 
			question TEXT NOT NULL,
			type TEXT NOT NULL,         
			created_by INTEGER NOT NULL, 
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			ends_at DATETIME,
			is_closed BOOLEAN DEFAULT 0
		);
		CREATE TABLE poll_options (id INTEGER PRIMARY KEY AUTOINCREMENT, poll_id INTEGER, option_text TEXT);
	`)

	repo := poll.NewRepository(db)
	service := poll.NewService(repo)

	t.Run("Succès de création complète en DB", func(t *testing.T) {
		req := poll.CreatePollRequest{
			Question: "L'intégration est-elle stable ?",
			Type:     "single",
			Options:  []string{"Oui", "Totalement"},
		}
		id, err := service.CreatePoll(req, 1)
		if err != nil {
			t.Errorf("ÉCHEC : Erreur lors de l'insertion : %v", err)
		}
		if id <= 0 {
			t.Error("ÉCHEC : L'ID retourné est invalide")
		}
	})
}