package server

import (
	"log/slog"
	"net/http"
)

type Service struct {
	logger *slog.Logger
	repo   Repository
}

func NewService(repo Repository) *Service {
	return &Service{
		repo: repo,
	}
}

func (s *Service) CreateMQTTClient(w http.ResponseWriter, r *http.Request) {
}

func (s *Service) ListMQTTClients(w http.ResponseWriter, r *http.Request) {
	_, err := w.Write([]byte("ListMQTTClients"))
	if err != nil {
		s.logger.Error("ListMQTTClients", "error", err)
	}
}
