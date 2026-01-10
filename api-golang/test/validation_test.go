package test

import (
	"database/sql"
	"testing"
	"api-golang/poll"
	_ "github.com/mattn/go-sqlite3"
)

func TestPollValidationRules(t *testing.T) {
	// Setup une DB en mémoire pour éviter le "nil pointer dereference"
	db, _ := sql.Open("sqlite3", ":memory:")
	repo := poll.NewRepository(db)
	service := poll.NewService(repo)

	t.Run("Erreur si moins de 2 options", func(t *testing.T) {
		req := poll.CreatePollRequest{
			Question: "Test ?",
			Options:  []string{"Option 1"},
		}
		_, err := service.CreatePoll(req, 1)
		if err == nil {
			t.Error("ÉCHEC : Le backend aurait dû refuser 1 seule option")
		}
	})

	t.Run("Erreur si plus de 10 options", func(t *testing.T) {
		req := poll.CreatePollRequest{
			Question: "Trop d'options ?",
			Options:  []string{"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"},
		}
		_, err := service.CreatePoll(req, 1)
		if err == nil {
			t.Error("ÉCHEC : Le backend aurait dû refuser plus de 10 options")
		}
	})

	t.Run("Erreur si question vide", func(t *testing.T) {
		req := poll.CreatePollRequest{
			Question: "",
			Options:  []string{"Oui", "Non"},
		}
		_, err := service.CreatePoll(req, 1)
		if err == nil {
			t.Error("ÉCHEC : Le backend aurait dû refuser une question vide")
		}
	})
}