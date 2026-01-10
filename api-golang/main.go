package main

import (
	"log"

	"github.com/gin-gonic/gin"

	// T2aked mn had les imports 3la 7sab module name f go.mod
	"api-golang/database"
	"api-golang/poll"
)

func init() {
	// Initialisation SQLite
	if err := database.InitDB(); err != nil {
		log.Fatalf("Unable to open SQLite database (dev.db): %v", err)
	}
	log.Println("SQLite database ready (dev.db)")
}

func main() {

	r := gin.Default()

	// =========================
	// BASIC ENDPOINTS
	// =========================

	r.GET("/", func(c *gin.Context) {
		now := database.GetTime(c) // T2aked bli 3ndk had fonction f database pkg
		c.JSON(200, gin.H{
			"api": "golang",
			"now": now,
		})
	})

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, "pong wiwi")
	})

	// =========================
	// FEATURE 5 : POLL SYSTEM
	// =========================

	// 1. Dependency Injection
	// T2aked bli database.DB (Variable globale) kayna f dossier database
	repo := poll.NewRepository(database.DB)
	service := poll.NewService(repo)
	handler := poll.NewHandler(service)

	// 2. Routes
	api := r.Group("/api")
	{
		// GET All Polls (List)
		api.GET("/polls", handler.GetPolls) 
		
		// ✅ ZIDT HADI: GET Single Poll (Details + Options)
		// Daroriya bach l-user ychouf les options 9bel ma y-voti
		api.GET("/polls/:id", handler.GetPoll)

		// Create Poll
		api.POST("/polls", handler.CreatePoll)

		// Vote
		api.POST("/polls/:id/vote", handler.Vote)

		// Results & Close (Ba9in TODO f handler dyalk)
		api.GET("/polls/:id/results", handler.GetResults)
		api.PATCH("/polls/:id/close", handler.ClosePoll)
	}

	// =========================

	// Lancement du serveur
	log.Println("Server running on port 8080")
	r.Run(":8080")
}