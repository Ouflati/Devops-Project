package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"api-golang/database"
	searchhttp "api-golang/search/http"
	searchservice "api-golang/search/service"
)

func init() {
	if err := database.InitDB(); err != nil {
		log.Fatalf("Unable to open SQLite database (dev.db): %v", err)
	}
	log.Println("SQLite database ready (dev.db)")
}

func main() {

	// 🔧 Gin router
	r := gin.Default()

	// ✅ CORS CONFIG (OBLIGATOIRE POUR REACT)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	// 🔍 Search service
	searchService := searchservice.NewSearchService()
	searchHandler := searchhttp.NewSearchHandler(searchService)

	// 🕒 Test route
	r.GET("/", func(c *gin.Context) {
		tm := database.GetTime(c)
		c.JSON(200, gin.H{
			"api": "golang",
			"now": tm,
		})
	})

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, "pong")
	})

	// 🔎 Global search route
	r.GET("/api/search", func(c *gin.Context) {
		searchHandler.HandleSearch(c.Writer, c.Request)
	})

	// 🚀 Run server
	r.Run(":8080")
}
