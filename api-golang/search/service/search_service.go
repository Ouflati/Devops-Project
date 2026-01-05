package service

import (
	"errors"
	"strings"

	"api-golang/database"
	"api-golang/search/model"
)

type SearchService interface {
	Search(query string, types []string, limit int) (model.SearchResponse, error)
}

type searchService struct{}

func NewSearchService() SearchService {
	return &searchService{}
}

func (s *searchService) Search(query string, types []string, limit int) (model.SearchResponse, error) {
	q := strings.TrimSpace(query)
	if q == "" {
		return model.SearchResponse{}, errors.New("missing query parameter: q")
	}

	if limit <= 0 {
		limit = 20
	}
	if limit > 50 {
		limit = 50
	}

	results := []model.SearchResult{}

	// déterminer quels types chercher
	searchUsers := len(types) == 0 || contains(types, "users")
	searchTasks := len(types) == 0 || contains(types, "tasks")
	searchCalendar := len(types) == 0 || contains(types, "calendar")
	searchChat := len(types) == 0 || contains(types, "chat")

	db := database.GetDB()

	//  USERS
	if searchUsers {
		rows, err := db.Query(`
			SELECT id, username, email
			FROM users
			WHERE LOWER(username) LIKE '%' || LOWER(?) || '%'
			   OR LOWER(email) LIKE '%' || LOWER(?) || '%'
		`, q, q)
		if err == nil {
			defer rows.Close()
			for rows.Next() {
				var id int64
				var username, email string
				if err := rows.Scan(&id, &username, &email); err == nil {
					results = append(results, model.SearchResult{
						Type:    "users",
						ID:      id,
						Label:   username,
						Snippet: email,
					})
					if len(results) >= limit {
						return model.SearchResponse{Query: q, Results: results}, nil
					}
				}
			}
		}
	}

	//  TASKS
	if searchTasks {
		rows, err := db.Query(`
			SELECT id, title, description
			FROM tasks
			WHERE LOWER(title) LIKE '%' || LOWER(?) || '%'
			   OR LOWER(description) LIKE '%' || LOWER(?) || '%'
		`, q, q)
		if err == nil {
			defer rows.Close()
			for rows.Next() {
				var id int64
				var title, description string
				if err := rows.Scan(&id, &title, &description); err == nil {
					results = append(results, model.SearchResult{
						Type:    "tasks",
						ID:      id,
						Label:   title,
						Snippet: description,
					})
					if len(results) >= limit {
						return model.SearchResponse{Query: q, Results: results}, nil
					}
				}
			}
		}
	}

	//  CALENDAR
	if searchCalendar {
		rows, err := db.Query(`
			SELECT id, title, description
			FROM calendar
			WHERE LOWER(title) LIKE '%' || LOWER(?) || '%'
			   OR LOWER(description) LIKE '%' || LOWER(?) || '%'
		`, q, q)
		if err == nil {
			defer rows.Close()
			for rows.Next() {
				var id int64
				var title, description string
				if err := rows.Scan(&id, &title, &description); err == nil {
					results = append(results, model.SearchResult{
						Type:    "calendar",
						ID:      id,
						Label:   title,
						Snippet: description,
					})
					if len(results) >= limit {
						return model.SearchResponse{Query: q, Results: results}, nil
					}
				}
			}
		}
	}

	// CHAT MESSAGES
	if searchChat {
		rows, err := db.Query(`
			SELECT id, content
			FROM chat_messages
			WHERE LOWER(content) LIKE '%' || LOWER(?) || '%'
		`, q)
		if err == nil {
			defer rows.Close()
			for rows.Next() {
				var id int64
				var content string
				if err := rows.Scan(&id, &content); err == nil {
					results = append(results, model.SearchResult{
						Type:    "chat_messages",
						ID:      id,
						Label:   "Message",
						Snippet: content,
					})
					if len(results) >= limit {
						return model.SearchResponse{Query: q, Results: results}, nil
					}
				}
			}
		}
	}

	return model.SearchResponse{
		Query:   q,
		Results: results,
	}, nil
}

// utilitaire pour vérifier un type
func contains(list []string, value string) bool {
	for _, v := range list {
		if strings.EqualFold(strings.TrimSpace(v), value) {
			return true
		}
	}
	return false
}
