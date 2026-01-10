package poll

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{Service: service}
}

// 1. GetPolls: Khassha tjib data men DB
func (h *Handler) GetPolls(c *gin.Context) {
    // Appel l service (khass tkon sawbtiha f service.go)
	polls, err := h.Service.GetAllPolls() 
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Impossible de récupérer les polls"})
		return
	}
	c.JSON(http.StatusOK, polls)
}

// 2. GetPollById: Zid hadi, daroriya bach l-frontend y-afficher les options
func (h *Handler) GetPoll(c *gin.Context) {
    pollID, err := strconv.ParseInt(c.Param("id"), 10, 64)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ID invalide"})
        return
    }

    poll, err := h.Service.GetPoll(pollID) // Khass tkon f Service
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Poll introuvable"})
        return
    }

    c.JSON(http.StatusOK, poll)
}

func (h *Handler) CreatePoll(c *gin.Context) {
	var req CreatePollRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pollID, err := h.Service.CreatePoll(req, 1) // UserID mocké à 1
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"poll_id": pollID})
}

// 3. Vote: Hna fin kayn l-fix lmohim
func (h *Handler) Vote(c *gin.Context) {
    // Fix: Vérifier l'erreur de conversion
	pollID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "ID invalide"})
        return
    }

	var req VoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

    // ✅ ÉTAPE CRUCIALE : Jeb l-poll men DB bach t3rf Type o wash msdoud
    // Khassk tkon zti GetPoll f Service dyalk
    poll, err := h.Service.GetPoll(pollID)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Ce poll n'existe pas"})
        return
    }

    // Daba 3ad sift l-poll l-ha9i9i l Service
	err = h.Service.Vote(*poll, req, 1) // UserID mocké à 1
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}



	c.JSON(http.StatusOK, gin.H{"message": "Vote enregistré avec succès"})
}

	// Dans internal/poll/handler.go

func (h *Handler) GetResults(c *gin.Context) {
    // Placeholder: nraj3o dummy data db
    c.JSON(200, gin.H{"message": "Results function not implemented yet"})
}

func (h *Handler) ClosePoll(c *gin.Context) {
    // Placeholder
    c.JSON(200, gin.H{"message": "ClosePoll function not implemented yet"})
}