package main

import (
	"context"
	"crypto/rand"
	"crypto/subtle"
	"embed"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"io/fs"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// 1. Single-Binary Static Asset & Template Embedding
//
//go:embed templates/* static/*
var embeddedAssets embed.FS

// 2. Data Models
type User struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

type PageData struct {
	Title        string
	CSRFToken    string
	User         *User
	FlashMessage string
	Data         any
}

// 3. Web Server Definition
type Server struct {
	tmpl *template.Template
}

func NewServer() (*Server, error) {
	// Load and compile embedded HTML templates
	tmpl, err := template.ParseFS(embeddedAssets, "templates/**/*.html", "templates/*.html")
	if err != nil {
		return nil, fmt.Errorf("parse embedded templates: %w", err)
	}

	return &Server{
		tmpl: tmpl,
	}, nil
}

func (s *Server) Routes() http.Handler {
	mux := http.NewServeMux()

	// Static asset file server (1-year immutable caching)
	staticSubFS, _ := fs.Sub(embeddedAssets, "static")
	staticFileServer := http.FileServer(http.FS(staticSubFS))
	mux.Handle("GET /static/", http.StripPrefix("/static/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		staticFileServer.ServeHTTP(w, r)
	})))

	// Web Page Routes (SSR)
	mux.HandleFunc("GET /", s.handleHome)
	mux.HandleFunc("GET /login", s.handleLoginPage)
	mux.HandleFunc("POST /login", s.handleLoginSubmit)
	mux.HandleFunc("POST /logout", s.handleLogout)

	// API Routes (RESTful JSON)
	mux.HandleFunc("GET /api/v1/users", s.handleAPIListUsers)

	// Compose middleware pipeline: SecurityHeaders -> CSRF -> Router
	return s.securityHeaders(s.csrfProtection(mux))
}

// 4. Route Handlers
func (s *Server) handleHome(w http.ResponseWriter, r *http.Request) {
	csrfToken := s.getOrCreateCSRFToken(w, r)
	data := PageData{
		Title:     "Home",
		CSRFToken: csrfToken,
		Data: map[string]string{
			"Welcome": "Welcome to the modern single-binary Go Web application!",
		},
	}

	if err := s.tmpl.ExecuteTemplate(w, "base", data); err != nil {
		slog.ErrorContext(r.Context(), "render template error", "err", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

func (s *Server) handleLoginPage(w http.ResponseWriter, r *http.Request) {
	csrfToken := s.getOrCreateCSRFToken(w, r)
	_ = s.tmpl.ExecuteTemplate(w, "base", PageData{
		Title:     "Login",
		CSRFToken: csrfToken,
	})
}

func (s *Server) handleLoginSubmit(w http.ResponseWriter, r *http.Request) {
	email := r.FormValue("email")
	password := r.FormValue("password")

	// Example: Basic credential check (in production, compare bcrypt hash against DB)
	if email == "admin@example.com" && password == "admin123" {
		http.SetCookie(w, &http.Cookie{
			Name:     "session_token",
			Value:    "mock-valid-token",
			Path:     "/",
			HttpOnly: true,
			Secure:   false, // Set to true in production HTTPS
			SameSite: http.SameSiteLaxMode,
			MaxAge:   86400 * 7,
		})
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	http.Redirect(w, r, "/login?error=invalid_credentials", http.StatusSeeOther)
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
	})
	http.Redirect(w, r, "/login", http.StatusSeeOther)
}

func (s *Server) handleAPIListUsers(w http.ResponseWriter, r *http.Request) {
	users := []User{
		{ID: "usr-01", Email: "alice@example.com", Role: "admin"},
		{ID: "usr-02", Email: "bob@example.com", Role: "member"},
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(users)
}

// 5. Security & CSRF Middleware
func (s *Server) securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';")
		next.ServeHTTP(w, r)
	})
}

func (s *Server) csrfProtection(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet || r.Method == http.MethodHead || r.Method == http.MethodOptions {
			next.ServeHTTP(w, r)
			return
		}

		cookie, err := r.Cookie("csrf_token")
		if err != nil || cookie.Value == "" {
			http.Error(w, "CSRF cookie missing", http.StatusForbidden)
			return
		}

		sentToken := r.Header.Get("X-CSRF-Token")
		if sentToken == "" {
			sentToken = r.FormValue("csrf_token")
		}

		if subtle.ConstantTimeCompare([]byte(cookie.Value), []byte(sentToken)) != 1 {
			http.Error(w, "CSRF token mismatch", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (s *Server) getOrCreateCSRFToken(w http.ResponseWriter, r *http.Request) string {
	cookie, err := r.Cookie("csrf_token")
	if err == nil && cookie.Value != "" {
		return cookie.Value
	}

	bytes := make([]byte, 16)
	_, _ = rand.Read(bytes)
	token := hex.EncodeToString(bytes)

	http.SetCookie(w, &http.Cookie{
		Name:     "csrf_token",
		Value:    token,
		Path:     "/",
		SameSite: http.SameSiteLaxMode,
		HttpOnly: false, // Accessible by JavaScript for AJAX headers
	})
	return token
}

// 6. Application Entrypoint & Graceful Shutdown
func main() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))

	server, err := NewServer()
	if err != nil {
		slog.Error("failed to create server", "err", err)
		os.Exit(1)
	}

	httpServer := &http.Server{
		Addr:         ":8080",
		Handler:      server.Routes(),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		slog.Info("Web server is running at http://localhost:8080")
		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			slog.Error("server fatal", "err", err)
		}
	}()

	<-ctx.Done()
	slog.Info("shutting down web server...")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = httpServer.Shutdown(shutdownCtx)
	slog.Info("web server exited cleanly")
}
