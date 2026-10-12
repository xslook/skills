// Command webapp is a single-binary web application skeleton: server-side
// rendered html/template pages and static assets embedded via //go:embed,
// stdlib cross-origin (CSRF) protection, nonce-based CSP, secure session
// cookies, and graceful shutdown.
//
// Expected embedded layout (relative to this file):
//
//	templates/layouts/*.html   base layout(s), e.g. {{define "base"}}
//	templates/partials/*.html  shared fragments (optional)
//	templates/pages/*.html     one file per page, each defining {{define "content"}}
//	static/...                 CSS, JS, images
//
// Requires Go 1.25+ (http.CrossOriginProtection).
package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"embed"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"io/fs"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"path"
	"strings"
	"sync"
	"syscall"
	"time"
)

// Embedding directories (not "dir/*") includes all nested files except those
// starting with "." or "_".
//
//go:embed templates static
var embeddedAssets embed.FS

const sessionCookie = "__Host-session" // __Host- prefix forces Secure, Path=/, and no Domain.

// ErrInvalidCredentials is returned when an email/password pair does not match.
var ErrInvalidCredentials = errors.New("invalid credentials")

// User is the authenticated principal attached to a request.
type User struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Role  string `json:"role"`
}

// PageData is the view model passed to every page template.
type PageData struct {
	Title        string
	Nonce        string // Per-request CSP nonce; required on every inline <script>.
	User         *User
	FlashMessage string
	Data         any
}

type ctxKey int

const (
	nonceKey ctxKey = iota
	userKey
)

// Server holds parsed templates and in-memory session state.
type Server struct {
	// pages maps a page name (file name without extension) to its own template
	// set. Each page MUST get a separate clone of the layout: parsing all pages
	// into one set makes every {{define "content"}} overwrite the previous one,
	// so every route would render the last-parsed page.
	pages map[string]*template.Template

	// sessions is a demo in-memory store (token -> *User).
	// TODO(owner): Replace with a persistent or signed session store for multi-instance deployments.
	sessions sync.Map
}

// NewServer parses the embedded templates into one template set per page.
func NewServer() (*Server, error) {
	pages, err := parsePages(embeddedAssets)
	if err != nil {
		return nil, err
	}
	return &Server{pages: pages}, nil
}

func parsePages(fsys fs.FS) (map[string]*template.Template, error) {
	funcs := template.FuncMap{
		"formatDate": func(t time.Time) string { return t.Format(time.DateTime) },
	}

	// Layouts and partials form the shared base. fs.Glob does not support "**",
	// so each directory level is listed explicitly.
	base := template.New("").Funcs(funcs)
	for _, pattern := range []string{"templates/layouts/*.html", "templates/partials/*.html"} {
		matches, err := fs.Glob(fsys, pattern)
		if err != nil {
			return nil, fmt.Errorf("glob %s: %w", pattern, err)
		}
		if len(matches) == 0 {
			continue // ParseFS errors on zero matches; partials are optional.
		}
		if _, err := base.ParseFS(fsys, matches...); err != nil {
			return nil, fmt.Errorf("parse %s: %w", pattern, err)
		}
	}

	pageFiles, err := fs.Glob(fsys, "templates/pages/*.html")
	if err != nil {
		return nil, fmt.Errorf("glob pages: %w", err)
	}

	pages := make(map[string]*template.Template, len(pageFiles))
	for _, file := range pageFiles {
		tmpl, err := base.Clone()
		if err != nil {
			return nil, fmt.Errorf("clone base for %s: %w", file, err)
		}
		if _, err := tmpl.ParseFS(fsys, file); err != nil {
			return nil, fmt.Errorf("parse page %s: %w", file, err)
		}
		pages[strings.TrimSuffix(path.Base(file), ".html")] = tmpl
	}
	return pages, nil
}

// Routes builds the HTTP handler with the full middleware chain.
func (s *Server) Routes() (http.Handler, error) {
	mux := http.NewServeMux()

	staticFS, err := fs.Sub(embeddedAssets, "static")
	if err != nil {
		return nil, fmt.Errorf("sub static fs: %w", err)
	}
	// Long-lived caching is only safe with content-hashed or versioned asset URLs;
	// otherwise lower max-age so clients pick up new CSS/JS after a deploy.
	static := http.StripPrefix("/static/", http.FileServerFS(staticFS))
	mux.Handle("GET /static/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "public, max-age=3600")
		static.ServeHTTP(w, r)
	}))

	mux.HandleFunc("GET /healthz/live", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// Pages (SSR). "GET /{$}" matches only "/", not every unmatched path.
	mux.HandleFunc("GET /{$}", s.handleHome)
	mux.HandleFunc("GET /login", s.handleLoginPage)
	mux.HandleFunc("POST /login", s.handleLoginSubmit)
	mux.HandleFunc("POST /logout", s.handleLogout)

	// JSON API.
	mux.Handle("GET /api/v1/users", s.requireUser(http.HandlerFunc(s.handleAPIListUsers)))

	// CrossOriginProtection rejects cross-origin state-changing requests using
	// Sec-Fetch-Site / Origin headers; no CSRF tokens or cookies are needed.
	csrf := http.NewCrossOriginProtection()

	// Order (outermost first): security headers -> CSRF -> session -> router.
	return securityHeaders(csrf.Handler(s.loadSession(mux))), nil
}

// --- Handlers ---

func (s *Server) handleHome(w http.ResponseWriter, r *http.Request) {
	s.render(w, r, http.StatusOK, "home", PageData{
		Title: "Home",
		Data:  map[string]string{"Welcome": "Welcome to the single-binary Go web application!"},
	})
}

func (s *Server) handleLoginPage(w http.ResponseWriter, r *http.Request) {
	data := PageData{Title: "Login"}
	if r.URL.Query().Get("error") == "invalid_credentials" {
		data.FlashMessage = "Invalid email or password."
	}
	s.render(w, r, http.StatusOK, "login", data)
}

func (s *Server) handleLoginSubmit(w http.ResponseWriter, r *http.Request) {
	user, err := authenticate(r.Context(), r.FormValue("email"), r.FormValue("password"))
	if err != nil {
		if !errors.Is(err, ErrInvalidCredentials) {
			slog.ErrorContext(r.Context(), "authenticate user", slog.Any("error", err))
		}
		http.Redirect(w, r, "/login?error=invalid_credentials", http.StatusSeeOther)
		return
	}

	// Always issue a fresh token on login to prevent session fixation.
	token := rand.Text()
	s.sessions.Store(token, user)
	http.SetCookie(w, &http.Cookie{
		Name:     sessionCookie,
		Value:    token,
		Path:     "/",
		MaxAge:   int((7 * 24 * time.Hour).Seconds()),
		HttpOnly: true,
		Secure:   true, // Browsers accept Secure cookies on http://localhost, so no dev toggle is needed.
		SameSite: http.SameSiteLaxMode,
	})
	http.Redirect(w, r, "/", http.StatusSeeOther)
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	if c, err := r.Cookie(sessionCookie); err == nil {
		s.sessions.Delete(c.Value)
	}
	http.SetCookie(w, &http.Cookie{
		Name:     sessionCookie,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})
	http.Redirect(w, r, "/login", http.StatusSeeOther)
}

func (s *Server) handleAPIListUsers(w http.ResponseWriter, r *http.Request) {
	users := []User{
		{ID: "usr-01", Email: "alice@example.com", Role: "admin"},
		{ID: "usr-02", Email: "bob@example.com", Role: "member"},
	}
	writeJSON(w, r, http.StatusOK, users)
}

// authenticate verifies credentials.
// TODO(owner): Look up the user and compare with bcrypt.CompareHashAndPassword.
func authenticate(_ context.Context, _, _ string) (*User, error) {
	return nil, ErrInvalidCredentials
}

// --- Rendering helpers ---

// render executes the page into a buffer first so a template error never
// leaves a half-written page with a 200 status on the wire.
func (s *Server) render(w http.ResponseWriter, r *http.Request, status int, page string, data PageData) {
	tmpl, ok := s.pages[page]
	if !ok {
		slog.ErrorContext(r.Context(), "unknown page template", slog.String("page", page))
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	data.Nonce = nonceFrom(r.Context())
	data.User = userFrom(r.Context())

	var buf bytes.Buffer
	if err := tmpl.ExecuteTemplate(&buf, "base", data); err != nil {
		slog.ErrorContext(r.Context(), "render template", slog.String("page", page), slog.Any("error", err))
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(status)
	if _, err := buf.WriteTo(w); err != nil {
		// Client went away mid-response; nothing left to send.
		slog.DebugContext(r.Context(), "write response", slog.Any("error", err))
	}
}

func writeJSON(w http.ResponseWriter, r *http.Request, status int, v any) {
	body, err := json.Marshal(v)
	if err != nil {
		slog.ErrorContext(r.Context(), "encode json response", slog.Any("error", err))
		http.Error(w, `{"message":"internal error"}`, http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if _, err := w.Write(body); err != nil {
		slog.DebugContext(r.Context(), "write response", slog.Any("error", err))
	}
}

// --- Middleware ---

// securityHeaders sets hardening headers and a per-request CSP nonce. Inline
// scripts run only if they carry nonce="{{ .Nonce }}"; inline event handlers
// (onclick=...) are blocked by design, so use addEventListener instead.
func securityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nonce := rand.Text()
		h := w.Header()
		h.Set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'nonce-"+nonce+"'; "+
			"style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'")
		h.Set("X-Content-Type-Options", "nosniff")
		h.Set("Referrer-Policy", "strict-origin-when-cross-origin")
		// Add Strict-Transport-Security once the app is served exclusively over HTTPS.
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), nonceKey, nonce)))
	})
}

// loadSession attaches the logged-in user (if any) to the request context.
func (s *Server) loadSession(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if c, err := r.Cookie(sessionCookie); err == nil {
			if v, ok := s.sessions.Load(c.Value); ok {
				if u, ok := v.(*User); ok {
					r = r.WithContext(context.WithValue(r.Context(), userKey, u))
				}
			}
		}
		next.ServeHTTP(w, r)
	})
}

// requireUser rejects unauthenticated API requests with 401.
func (s *Server) requireUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if userFrom(r.Context()) == nil {
			writeJSON(w, r, http.StatusUnauthorized, map[string]string{"message": "authentication required"})
			return
		}
		next.ServeHTTP(w, r)
	})
}

func nonceFrom(ctx context.Context) string {
	n, _ := ctx.Value(nonceKey).(string)
	return n
}

func userFrom(ctx context.Context) *User {
	u, _ := ctx.Value(userKey).(*User)
	return u
}

// --- Entrypoint & graceful shutdown ---

func main() {
	slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))
	if err := run(); err != nil {
		slog.Error("server exited with error", slog.Any("error", err))
		os.Exit(1)
	}
}

// run owns the full lifecycle so deferred cleanup always executes; main is the
// only place that calls os.Exit.
func run() error {
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	server, err := NewServer()
	if err != nil {
		return fmt.Errorf("create server: %w", err)
	}
	handler, err := server.Routes()
	if err != nil {
		return fmt.Errorf("build routes: %w", err)
	}

	httpServer := &http.Server{
		Addr:              ":8080",
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	errCh := make(chan error, 1) // Buffered so the goroutine never blocks if run already returned.
	go func() {
		slog.InfoContext(ctx, "web server listening", slog.String("addr", httpServer.Addr))
		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
		close(errCh)
	}()

	select {
	case err := <-errCh:
		return fmt.Errorf("listen and serve: %w", err)
	case <-ctx.Done():
	}

	slog.InfoContext(ctx, "shutting down web server")
	shutdownCtx, cancel := context.WithTimeout(context.WithoutCancel(ctx), 10*time.Second)
	defer cancel()
	if err := httpServer.Shutdown(shutdownCtx); err != nil {
		return fmt.Errorf("graceful shutdown: %w", err)
	}
	slog.InfoContext(ctx, "web server exited cleanly")
	return nil
}
