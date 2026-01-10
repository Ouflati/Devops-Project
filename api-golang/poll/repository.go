package poll

import (
	"database/sql"
)

type Repository struct {
	DB *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{DB: db}
}

// --- ECRITURE (Create & Update) ---

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
    // Correction: 'text' minuscule, machi 'Text'
	_, err := r.DB.Exec(
		`INSERT INTO poll_options (poll_id, option_text) 
		VALUES (?, ?)`,
		pollID, text, 
	)
	return err
}

func (r *Repository) HasUserVoted(pollID, userID int64) (bool, error) {
    // Correction: Table smitha 'votes' (selon ton SQL)
	row := r.DB.QueryRow(
		`SELECT COUNT(*) FROM votes
		WHERE poll_id=? AND user_id=?`,
		pollID, userID,
	)
	var count int
	err := row.Scan(&count)
	return count > 0, err
}

func (r *Repository) Vote(pollID, optionID, userID int64) error {
    // Correction: Simplification pour matcher ton SQL 'votes'.
    // Pas besoin de transaction complexe si on a une seule table 'votes'.
	_, err := r.DB.Exec(
		`INSERT INTO votes (poll_id, option_id, user_id) VALUES (?, ?, ?)`,
		pollID, optionID, userID,
	)
	return err
}

// --- LECTURE (Get - Darori bach Service ykhdm) ---

// GetPoll: Kayjib les infos dyal poll wa7d
func (r *Repository) GetPoll(id int64) (*Poll, error) {
	row := r.DB.QueryRow(`
		SELECT id, question, type, created_by, created_at, ends_at, is_closed 
		FROM polls WHERE id = ?`, id)

	var p Poll
	err := row.Scan(&p.ID, &p.Question, &p.Type, &p.CreatedBy, &p.CreatedAt, &p.EndsAt, &p.IsClosed)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

// GetPollOptions: Kayjib les options dyal poll
func (r *Repository) GetPollOptions(pollID int64) ([]Option, error) {
	rows, err := r.DB.Query(`SELECT id, poll_id, option_text FROM poll_options WHERE poll_id = ?`, pollID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var options []Option
	for rows.Next() {
		var o Option
        // Correction: Mapping option_text -> o.Text
		if err := rows.Scan(&o.ID, &o.PollID, &o.Text); err != nil {
			return nil, err
		}
		options = append(options, o)
	}
	return options, nil
}

// GetAllPolls: Kayjib la liste kamla
func (r *Repository) GetAllPolls() ([]Poll, error) {
    // On prend les polls les plus récents en premier
	rows, err := r.DB.Query(`SELECT id, question, type, created_by, created_at, is_closed FROM polls ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var polls []Poll
	for rows.Next() {
		var p Poll
		// Note: On ne scanne pas EndsAt ici pour simplifier la liste, mais tu peux l'ajouter
		if err := rows.Scan(&p.ID, &p.Question, &p.Type, &p.CreatedBy, &p.CreatedAt, &p.IsClosed); err != nil {
			return nil, err
		}
		polls = append(polls, p)
	}
	return polls, nil
}