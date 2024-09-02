package server

import (
	"context"
	"net/http"
	"time"

	"core/internal/config"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Server struct {
	config config.Config

	server *http.Server
}

func New(c config.Config, service *Service) *Server {
	r := chi.NewRouter()

	r.Use(middleware.Recoverer)

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hi"))
	})

	r.Route("/api", func(r chi.Router) {
		r.Route("/v1", func(r chi.Router) {
			r.Post("/ListMQTTClients", service.ListMQTTClients)
		})
	})

	return &Server{
		config: c,
		server: &http.Server{
			Addr:    c.Server.Addr,
			Handler: r,
		},
	}
}

func (s *Server) Start(ctx context.Context) error {
	listenErr := make(chan error)

	go func() {
		if err := s.server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			listenErr <- err
		}
	}()

	select {
	case <-ctx.Done():
		return s.shutdown()
	case err := <-listenErr:
		return err
	}
}

func (s *Server) shutdown() error {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := s.server.Shutdown(ctx); err != nil {
		return err
	}

	return ctx.Err()
}
