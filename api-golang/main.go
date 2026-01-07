package main

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"api-golang/routes"

	"api-golang/database"
	"github.com/gin-contrib/cors"

)

func init() {
	// NEW: No arguments, no DATABASE_URL, no file reading
	if err := database.InitDB(); err != nil {
		log.Fatalf("Unable to open SQLite database (dev.db): %v", err)
	}
	log.Println("SQLite database ready (dev.db)")

}

func main() {

	r := gin.Default()
	r.SetTrustedProxies(nil)
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type"},
	}))
	var tm time.Time

	r.GET("/", func(c *gin.Context) {
		tm = database.GetTime(c)
		c.JSON(200, gin.H{
			"api": "golang",
			"now": tm,
		})
	})

	r.GET("/ping", func(c *gin.Context) {
		tm = database.GetTime(c)
		c.JSON(200, "pong")
	})
	r.GET("/calendar", routes.GetCalendar)
	r.POST("/calendar", routes.CreateCalendar)
	r.GET("/calendar/:id", routes.GetCalendarByID)
	r.PUT("/calendar/:id", routes.UpdateCalendar)
	r.DELETE("/calendar/:id", routes.DeleteCalendar)


	r.Run() // listen and serve on 0.0.0.0:8080 (or "PORT" env var)

}

