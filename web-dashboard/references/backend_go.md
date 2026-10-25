# Backend Integration: Go (Golang)

This guide details how to integrate the dashboard design system into Go services using standard library packages (`net/http`, `html/template`, `embed`), zero Node.js runtimes, and single-binary deployment.

---

## 1. Single Binary Asset Embedding (`//go:embed`)

All HTML templates, CSS files, JavaScript modules, SVG icons, and vendored libraries are compiled directly into the Go executable:

```go
package web

import (
	"embed"
	"fmt"
	"html/template"
	"io/fs"
	"net/http"
	"path"
	"strings"
	"time"
)

//go:embed templates static
var embeddedAssets embed.FS

type AssetManager struct {
	isDev bool
	pages map[string]*template.Template
}

func NewAssetManager(isDev bool) (*AssetManager, error) {
	m := &AssetManager{isDev: isDev}
	if !isDev {
		pages, err := m.compilePages(embeddedAssets)
		if err != nil {
			return nil, err
		}
		m.pages = pages
	}
	return m, nil
}
```

---

## 2. Page Template Isolation (Cloning Pattern)

Go's `html/template` package does not isolate `{{ define "content" }}` blocks if all pages are parsed into a single template instance. To prevent collisions:
1. Parse `templates/layouts/*.html` and `templates/partials/*.html` into a shared `base` template.
2. For each file in `templates/pages/*.html`, call `base.Clone()` and parse only that page.

```go
func (m *AssetManager) compilePages(fsys fs.FS) (map[string]*template.Template, error) {
	funcs := template.FuncMap{
		"formatDate": func(t time.Time) string { return t.Format("Jan 02, 2006") },
		"formatCurrency": func(cents int64) string {
			return fmt.Sprintf("$%.2f", float64(cents)/100.0)
		},
		"deltaClass": func(positive bool) string {
			if positive { return "positive" }
			return "negative"
		},
	}

	base := template.New("").Funcs(funcs)
	for _, pattern := range []string{"templates/layouts/*.html", "templates/partials/*.html"} {
		matches, err := fs.Glob(fsys, pattern)
		if err != nil {
			return nil, fmt.Errorf("glob %s: %w", pattern, err)
		}
		if len(matches) > 0 {
			if _, err := base.ParseFS(fsys, matches...); err != nil {
				return nil, fmt.Errorf("parse %s: %w", pattern, err)
			}
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
			return nil, fmt.Errorf("clone base: %w", err)
		}
		if _, err := tmpl.ParseFS(fsys, file); err != nil {
			return nil, fmt.Errorf("parse page %s: %w", file, err)
		}
		name := strings.TrimSuffix(path.Base(file), ".html")
		pages[name] = tmpl
	}
	return pages, nil
}
```

---

## 3. Implementing the HTML Fragment Protocol

Handlers check for the `X-Fragment` header sent by `swap.js`:

```go
type PageData struct {
	Title        string
	Nonce        string
	Theme        string // "dark" or "light" (read from cookie)
	SidebarState string // "expanded" or "collapsed" (read from cookie)
	User         any
	Data         any
}

func (s *Server) Render(w http.ResponseWriter, r *http.Request, status int, pageName string, data PageData) {
	tmpl, ok := s.pages[pageName]
	if !ok {
		http.Error(w, "Page not found", http.StatusInternalServerError)
		return
	}

	// 1. Inspect theme and sidebar cookies to ensure zero layout jump
	if c, err := r.Cookie("theme"); err == nil && c.Value == "dark" {
		data.Theme = "dark"
	}
	if c, err := r.Cookie("sidebar_state"); err == nil {
		data.SidebarState = c.Value
	} else {
		data.SidebarState = "expanded"
	}

	// 2. Check for fragment swap request
	fragmentTarget := r.Header.Get("X-Fragment")
	w.Header().Set("Vary", "X-Fragment")
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(status)

	if fragmentTarget != "" {
		// Render only the requested partial/block fragment
		if err := tmpl.ExecuteTemplate(w, fragmentTarget, data); err != nil {
			http.Error(w, "Fragment render error", http.StatusInternalServerError)
		}
		return
	}

	// Render the full page wrapped in the base layout
	if err := tmpl.ExecuteTemplate(w, "base", data); err != nil {
		http.Error(w, "Template render error", http.StatusInternalServerError)
	}
}
```

---

## 4. Serving Static Assets with ETags & Cache Control

```go
func (m *AssetManager) GetStaticFS() (http.Handler, error) {
	if m.isDev {
		// Hot-reload directly from disk during development
		return http.StripPrefix("/static/", http.FileServer(http.Dir("internal/web/static"))), nil
	}

	sub, err := fs.Sub(embeddedAssets, "static")
	if err != nil {
		return nil, fmt.Errorf("sub static fs: %w", err)
	}

	fileServer := http.FileServerFS(sub)
	return http.StripPrefix("/static/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Cache static assets for 1 hour; clients revalidate via ETags
		w.Header().Set("Cache-Control", "public, max-age=3600")
		fileServer.ServeHTTP(w, r)
	})), nil
}
```
