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
    EndDate     string `json:"end_date" binding:"required"`
    UserID      int    `json:"user_id" binding:"required"`
}


// GET /calendar
func GetCalendar(c *gin.Context) {
	rows, err := database.DB().Query(`
		SELECT id, title, description, start_date, end_date, user_id
		FROM calendar
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch calendar"})
		return
	}
	defer rows.Close()

	var items []CalendarItem

	for rows.Next() {
		var it CalendarItem
		if err := rows.Scan(&it.ID, &it.Title, &it.Description, &it.StartDate, &it.EndDate, &it.UserID); err != nil {
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
            "error": "invalid fields",
            "details": err.Error(),
        })
        return
    }

    // Validation simple supplémentaire
    if body.StartDate > body.EndDate {
        c.JSON(http.StatusBadRequest, gin.H{
            "error": "start_date must be before end_date",
        })
        return
    }

    res, err := database.DB().Exec(
        "INSERT INTO calendar (title, description, start_date, end_date, user_id) VALUES (?, ?, ?, ?, ?)",
        body.Title, body.Description, body.StartDate, body.EndDate, body.UserID,
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
		"SELECT id, title, description, start_date, end_date, user_id FROM calendar WHERE id = ?",
		id,
	).Scan(&item.ID, &item.Title, &item.Description, &item.StartDate, &item.EndDate, &item.UserID)

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
            "error": "invalid fields",
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

    _, err := database.DB().Exec(
        "UPDATE calendar SET title=?, description=?, start_date=?, end_date=?, user_id=? WHERE id=?",
        body.Title, body.Description, body.StartDate, body.EndDate, body.UserID, id,
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
