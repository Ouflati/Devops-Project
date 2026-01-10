package test

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"api-golang/poll"
	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

func TestCreatePollAPI(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()

	db, _ := sql.Open("sqlite3", ":memory:")
	defer db.Close()
	db.Exec(`CREATE TABLE polls (id INTEGER PRIMARY KEY, question TEXT, type TEXT, created_by INTEGER, ends_at DATETIME, is_closed BOOLEAN);`)
	db.Exec(`CREATE TABLE poll_options (id INTEGER PRIMARY KEY, poll_id INTEGER, option_text TEXT);`)
	
	repo := poll.NewRepository(db)
	service := poll.NewService(repo)
	handler := poll.NewHandler(service)
	router.POST("/v1/polls", handler.CreatePoll)

	t.Run("Erreur 400 si JSON invalide", func(t *testing.T) {
		badJson := []byte(`{"question": "Oups"`) // JSON mal formé
		req, _ := http.NewRequest("POST", "/v1/polls", bytes.NewBuffer(badJson))
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code == http.StatusCreated {
			t.Error("ÉCHEC : L'API aurait dû renvoyer une erreur pour un JSON invalide")
		}
	})

	t.Run("Succès 201 avec données valides", func(t *testing.T) {
		body := poll.CreatePollRequest{
			Question: "Tout est OK ?",
			Type:     "single",
			Options:  []string{"Oui", "Non"},
		}
		jsonBody, _ := json.Marshal(body)
		req, _ := http.NewRequest("POST", "/v1/polls", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		if w.Code != http.StatusCreated && w.Code != http.StatusOK {
			t.Errorf("ÉCHEC : L'API a répondu %d au lieu de 201", w.Code)
		}
	})
}