package routes

import (
	"database/sql"
	"net/http"

	"api-golang/database"
	"github.com/gin-gonic/gin"
)

type CalendarItem struct {
	ID          int    `json:"id"`
	Title       string `json:"title" binding:"required,min=3"`
	Description string `json:"description"`
	StartDate   string `json:"start_date" binding:"required"`
	StartTime   string `json:"start_time"` // added
	EndDate     string `json:"end_date" binding:"required"`
	EndTime     string `json:"end_time"` // added
	UserID      int    `json:"user_id" binding:"required"`
}

// GET /calendar
// Option: GET /calendar?month=YYYY-MM  (ex: 2026-01)
func GetCalendar(c *gin.Context) {
	month := c.Query("month") // ex: "2026-01"

	var (
		rows *sql.Rows
		err  error
	)

	if month != "" {
		rows, err = database.DB().Query(`
            SELECT id, title, description, start_date, start_time, end_date, end_time, user_id
            FROM calendar
            WHERE start_date LIKE ?
            ORDER BY start_date ASC, start_time ASC
        `, month+"%")
	} else {
		rows, err = database.DB().Query(`
            SELECT id, title, description, start_date, start_time, end_date, end_time, user_id
            FROM calendar
            ORDER BY start_date ASC, start_time ASC
        `)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch calendar"})
		return
	}
	defer rows.Close()

	var items []CalendarItem

	for rows.Next() {
		var it CalendarItem
		if err := rows.Scan(&it.ID, &it.Title, &it.Description, &it.StartDate, &it.StartTime, &it.EndDate, &it.EndTime, &it.UserID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read calendar entry"})
			return
		}
		items = append(items, it)
	}

	c.JSON(http.StatusOK, items)
}

// POST /calendar
func CreateCalendar(c *gin.Context) {
	var body CalendarItem

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "invalid fields",
			"details": err.Error(),
		})
		return
	}

	// Validation simple supplémentaire (date)
	if body.StartDate > body.EndDate {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "start_date must be before end_date",
		})
		return
	}

	// Validation heure 
	if body.StartDate == body.EndDate && body.StartTime != "" && body.EndTime != "" && body.StartTime > body.EndTime {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "start_time must be before end_time",
		})
		return
	}

	res, err := database.DB().Exec(
		"INSERT INTO calendar (title, description, start_date, start_time, end_date, end_time, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
		body.Title, body.Description, body.StartDate, body.StartTime, body.EndDate, body.EndTime, body.UserID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, _ := res.LastInsertId()
	body.ID = int(id)

	c.JSON(http.StatusCreated, body)
}

// GET /calendar/:id
func GetCalendarByID(c *gin.Context) {
	id := c.Param("id")

	var item CalendarItem

	err := database.DB().QueryRow(
		"SELECT id, title, description, start_date, start_time, end_date, end_time, user_id FROM calendar WHERE id = ?",
		id,
	).Scan(&item.ID, &item.Title, &item.Description, &item.StartDate, &item.StartTime, &item.EndDate, &item.EndTime, &item.UserID)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "calendar item not found"})
		return
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch calendar item"})
		return
	}

	c.JSON(http.StatusOK, item)
}

// PUT /calendar/:id
func UpdateCalendar(c *gin.Context) {
	id := c.Param("id")

	var body CalendarItem
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "invalid fields",
			"details": err.Error(),
		})
		return
	}

	if body.StartDate > body.EndDate {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "start_date must be before end_date",
		})
		return
	}

	// Validation heure 
	if body.StartDate == body.EndDate && body.StartTime != "" && body.EndTime != "" && body.StartTime > body.EndTime {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "start_time must be before end_time",
		})
		return
	}

	_, err := database.DB().Exec(
		"UPDATE calendar SET title=?, description=?, start_date=?, start_time=?, end_date=?, end_time=?, user_id=? WHERE id=?",
		body.Title, body.Description, body.StartDate, body.StartTime, body.EndDate, body.EndTime, body.UserID, id,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "updated"})
}

// DELETE /calendar/:id
func DeleteCalendar(c *gin.Context) {
	id := c.Param("id")

	_, err := database.DB().Exec("DELETE FROM calendar WHERE id = ?", id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete calendar item"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}
