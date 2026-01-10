package poll

import "time"

type Poll struct {
	ID        int64      `json:"id"`
	Question  string     `json:"question"`
	Type      string     `json:"type"`
	CreatedBy int64      `json:"created_by"`
	CreatedAt time.Time  `json:"created_at"`
	EndsAt    *time.Time `json:"ends_at"`
	IsClosed  bool       `json:"is_closed"`
	Options   []Option   `json:"options"`
}

type Option struct {
	ID     int64  `json:"id"`
	PollID int64  `json:"poll_id"`
	Text   string `json:"option_text"`
}

type CreatePollRequest struct {
	Question string   `json:"question"`
	Type     string   `json:"type"`
	Options  []string `json:"options"`
	EndsAt   *time.Time `json:"ends_at"`
}

type VoteRequest struct {
	OptionIDs []int64 `json:"option_ids"`
}
