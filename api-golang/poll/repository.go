package poll

import "database/sql"

type Repository struct {
	DB *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{DB: db}
}

func (r *Repository) CreatePoll(p Poll) (int64, error) {
	res, err := r.DB.Exec(
		`INSERT INTO polls (question, type, created_by, ends_at)
		 VALUES (?, ?, ?, ?)`,
		p.Question, p.Type, p.CreatedBy, p.EndsAt,
	)
	if err != nil {
		return 0, err
	}
	return res.LastInsertId()
}

func (r *Repository) AddOption(pollID int64, text string) error {
	_, err := r.DB.Exec(
		`INSERT INTO poll_options (poll_id, text) 
		 VALUES (?, ?)`,
		pollID, text,
	)
	return err
}

func (r *Repository) HasUserVoted(pollID, userID int64) (bool, error) {
	// CORRECTION : Utilisation de poll_votes
	row := r.DB.QueryRow(
		`SELECT COUNT(*) FROM poll_votes
		 WHERE poll_id=? AND user_id=?`,
		pollID, userID,
	)
	var count int
	err := row.Scan(&count)
	return count > 0, err
}

func (r *Repository) Vote(pollID, optionID, userID int64) error {
	// On commence une transaction car on doit insérer dans DEUX tables
	tx, err := r.DB.Begin()
	if err != nil {
		return err
	}

	// 1. Insérer le vote principal
	res, err := tx.Exec(
		`INSERT INTO poll_votes (poll_id, user_id) VALUES (?, ?)`,
		pollID, userID,
	)
	if err != nil {
		tx.Rollback()
		return err
	}

	voteID, _ := res.LastInsertId()

	// 2. Insérer le choix de l'option
	_, err = tx.Exec(
		`INSERT INTO poll_vote_options (vote_id, option_id) VALUES (?, ?)`,
		voteID, optionID,
	)
	if err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit()
}