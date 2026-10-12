# Web UI, Templates & Security Specification

---

## 1. Core Architecture Principles

```mermaid
graph LR
    subgraph Browser ["Modern Browser (Vanilla Web)"]
        HTML[Go SSR Template + HTML5]
        CSS[shadcn CSS Tokens & Variables]
        JS[Modern Vanilla JS fetch/DOM]
    end

    subgraph GoBinary ["Single Go Binary (//go:embed)"]
        FS[embed.FS: templates/ & static/]
        Router[net/http / chi / Gin Router]
        Auth[Auth & CSRF Middleware]
        API[RESTful JSON Handlers]
        Renderer[html/template Engine]
    end

    HTML -.->|1. Initial Page Load (SSR)| Renderer
    JS -.->|2. Async Data & Actions (Fetch)| API
    Router --> Auth --> Renderer & API
    FS --> Renderer
    FS --> Router
```

1. **Zero External Build Toolchain (No Node.js Required)**:
   - Prioritize native modern CSS and Vanilla JS, avoiding heavy Node.js / Webpack / Vite build pipelines.
2. **SSR + API Progressive Enhancement (Hybrid Rendering)**:
   - **Initial Page Load & Core Data**: Server-side rendered by Go's `html/template` for instant first-contentful paint and SEO friendliness.
   - **Interactivity & Complex Workflows**: Native modern JavaScript (`fetch()`, `async/await`, `CustomEvent`) asynchronously calls backend RESTful JSON APIs for targeted DOM updates.
3. **Single Binary Distribution (`//go:embed`)**:
   - All static assets (CSS, JS, images, SVGs, fonts) and HTML templates must be compiled directly into the Go binary via `//go:embed`, requiring zero auxiliary asset folders during deployment.
4. **Security by Default**:
   - Built-in tamper-proof encrypted session cookies, CSRF token validation, security headers (CSP, X-Frame-Options, etc.), `bcrypt` password hashing, and role-based access control (RBAC).

---

## 2. Single Binary Asset Embedding (`//go:embed`)

### 2.1 Directory Structure & Organization
Organize templates and static assets under `web/` or `internal/web/`:

```text
my-service/
├── internal/
│   └── web/
│       ├── assets.go          # embed.FS definition & asset loading helpers
│       ├── templates/         # HTML templates
│       │   ├── layouts/
│       │   │   └── base.html  # Base layout skeleton (Header/Nav/Footer/Dark Mode)
│       │   ├── partials/      # Reusable partials (Card, Table, Pagination)
│       │   └── pages/         # Business pages (login.html, dashboard.html)
│       └── static/            # Static assets
│           ├── css/
│           │   └── shadcn.css # Pure modern CSS design system
│           ├── js/
│           │   └── app.js     # Vanilla JS helpers (Toast, Dialog, Fetch Wrapper)
│           └── img/
│               └── logo.svg
```

### 2.2 Standard `assets.go` Implementation
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

// GetStaticFS retrieves the static asset file system (hot-reload from disk in dev, embedded FS in prod)
func (m *AssetManager) GetStaticFS() (http.Handler, error) {
	if m.isDev {
		return http.StripPrefix("/static/", http.FileServer(http.Dir("internal/web/static"))), nil
	}
	sub, err := fs.Sub(embeddedAssets, "static")
	if err != nil {
		return nil, fmt.Errorf("sub static fs: %w", err)
	}
	return http.StripPrefix("/static/", http.FileServerFS(sub)), nil
}

// compilePages builds an isolated template set for each page by cloning the layout base.
// Never parse multiple pages into one template set, or {{define "content"}} will collide.
func (m *AssetManager) compilePages(fsys fs.FS) (map[string]*template.Template, error) {
	funcs := template.FuncMap{
		"formatDate": func(t time.Time) string { return t.Format(time.DateTime) },
	}

	base := template.New("").Funcs(funcs)
	for _, pattern := range []string{"templates/layouts/*.html", "templates/partials/*.html"} {
		matches, err := fs.Glob(fsys, pattern)
		if err != nil {
			return nil, fmt.Errorf("glob %s: %w", pattern, err)
		}
		if len(matches) == 0 {
			continue
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
```

---

## 3. shadcn/ui Native Modern CSS Specification

Align with shadcn visual styling using pure native modern CSS features (CSS Custom Properties, `:has()`, `backdrop-filter`, `accent-color`) without needing Tailwind CLI:

### 3.1 Core Design Variables
See [shadcn_tokens.css](../templates/web/shadcn_tokens.css) for the complete HSL color token definitions (light mode `:root` and `.dark` overrides).

### 3.2 Common shadcn-Style Class Naming
- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`, `.btn-destructive`, `.btn-sm`, `.btn-lg`
- **Cards**: `.card`, `.card-header`, `.card-title`, `.card-description`, `.card-content`, `.card-footer`
- **Forms**: `.input`, `.label`, `.select`, `.textarea`, `.checkbox`, `.switch`
- **Feedback & Badges**: `.badge`, `.badge-secondary`, `.badge-destructive`, `.toast`, `.alert`
- **Native Modal**: Built on HTML5 `<dialog class="dialog">`, opened with `dialog.showModal()` and closed with `dialog.close()`.

---

## 4. Go Template (`html/template`) Best Practices

### 4.1 Template Inheritance
```html
<!-- layouts/base.html -->
{{ define "base" }}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ .CSRFToken }}">
    <title>{{ block "title" . }}Dashboard{{ end }} - Go Service</title>
    <link rel="stylesheet" href="/static/css/shadcn.css">
    {{ block "head" . }}{{ end }}
</head>
<body class="bg-background text-foreground antialiased min-h-screen flex flex-col">
    {{ template "navbar" . }}

    <main class="flex-1 container mx-auto px-4 py-6">
        {{ block "content" . }}{{ end }}
    </main>

    {{ template "footer" . }}
    <script src="/static/js/app.js"></script>
    {{ block "scripts" . }}{{ end }}
</body>
</html>
{{ end }}
```

### 4.2 Custom `FuncMap` Helper Functions
```go
var TemplateFuncs = template.FuncMap{
	// Format timestamp
	"formatDate": func(t time.Time) string {
		return t.Format("2006-01-02 15:04:05")
	},
	// Safe serialization to JSON for HTML attributes or scripts
	"toJSON": func(v any) template.JS {
		b, _ := json.Marshal(v)
		return template.JS(b)
	},
	// Role check
	"hasRole": func(userRole, targetRole string) bool {
		return userRole == targetRole || userRole == "admin"
	},
	// Key-value dictionary constructor
	"dict": func(values ...any) (map[string]any, error) {
		if len(values)%2 != 0 {
			return nil, errors.New("invalid dict call")
		}
		dict := make(map[string]any, len(values)/2)
		for i := 0; i < len(values); i += 2 {
			key, ok := values[i].(string)
			if !ok {
				return nil, errors.New("dict keys must be strings")
			}
			dict[key] = values[i+1]
		}
		return dict, nil
	},
}
```

---

## 5. Modern Vanilla JavaScript Conventions

### 5.1 Unified Fetch Client Wrapper
See the `API` class in [base_layout.html](../templates/web/base_layout.html) for the canonical implementation — automatically sends `credentials: 'same-origin'`, handles 401 redirect, 204 No Content, and extracts structured JSON error messages.

### 5.2 Native `<dialog>` Modal Interaction
Use native HTML5 `<dialog>` paired with `data-action` attributes to comply with strict CSP policies (no inline `onclick=...`):

```html
<!-- Trigger button -->
<button type="button" class="btn btn-primary" data-action="open-dialog" data-target="user-dialog">
    Create User
</button>

<!-- Modal Dialog -->
<dialog id="user-dialog" class="dialog">
    <div class="dialog-content card">
        <div class="card-header">
            <h3 class="card-title">Create New User</h3>
        </div>
        <form id="create-user-form">
            <div class="card-content space-y-4">
                <div>
                    <label class="label">Email</label>
                    <input type="email" name="email" required class="input" />
                </div>
            </div>
            <div class="card-footer flex justify-end gap-2">
                <button type="button" class="btn btn-outline" data-action="close-dialog">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
</dialog>

<script nonce="{{ .Nonce }}">
document.getElementById('create-user-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
        await API.post('/api/v1/users', payload);
        Toast.success('User created successfully');
        document.getElementById('user-dialog').close();
        window.location.reload();
    } catch (err) {
        Toast.error(err.message);
    }
});
</script>
```

---

## 6. Authentication, Sessions & Security Controls

### 6.1 Secure Session Cookies (`__Host-` Prefix)
In modern web applications, use the `__Host-` cookie prefix. It forces the browser to require `Secure: true`, `Path: "/"`, and reject `Domain` attributes (preventing sibling subdomain cookie poisoning):

```go
const SessionCookieName = "__Host-session"

func SetAuthCookie(w http.ResponseWriter, sessionToken string, maxAge int) {
	http.SetCookie(w, &http.Cookie{
		Name:     SessionCookieName,
		Value:    sessionToken,
		Path:     "/",
		MaxAge:   maxAge,
		HttpOnly: true,
		Secure:   true, // Browsers allow Secure cookies on localhost
		SameSite: http.SameSiteLaxMode,
	})
}
```

### 6.2 CSRF Protection: Modern Stdlib vs Legacy Tokens
1. **Modern Standard (Go 1.25+)**: Use **`http.CrossOriginProtection`**. It validates the browser's untamperable `Sec-Fetch-Site` and `Origin` headers on state-changing requests (`POST`, `PUT`, `DELETE`). It requires **zero CSRF tokens**, zero forms boilerplate, and zero token cookies:
   ```go
   csrf := http.NewCrossOriginProtection()
   handler := csrf.Handler(mux)
   ```
2. **Legacy / Cross-Subdomain Fallback**: If targeting older Go runtimes or legacy clients that do not send fetch metadata headers, use HMAC-signed double-submit cookies or state-bound server tokens.

### 6.3 Password Hashing & RBAC Middleware
```go
// 1. Secure password hashing with bcrypt
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPassword(password, hash string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}

// 2. Role-based authorization middleware
type ctxKey int

const userKey ctxKey = iota

func UserFromContext(ctx context.Context) *User {
	u, _ := ctx.Value(userKey).(*User)
	return u
}

func RequireRoles(roles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user := UserFromContext(r.Context())
			if user == nil {
				http.Redirect(w, r, "/login", http.StatusSeeOther)
				return
			}

			for _, role := range roles {
				if user.Role == role {
					next.ServeHTTP(w, r)
					return
				}
			}

			http.Error(w, "Forbidden: Insufficient Permissions", http.StatusForbidden)
		})
	}
}
```

### 6.4 Security Headers & CSP Nonce Middleware
Set hardening headers and generate a cryptographically random nonce per request. Inline scripts must declare `nonce="{{ .Nonce }}"`:

```go
func SecurityHeadersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		nonce := rand.Text() // crypto/rand, Go 1.24+

		h := w.Header()
		h.Set("Content-Security-Policy",
			"default-src 'self'; script-src 'self' 'nonce-"+nonce+"'; "+
				"style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'")
		h.Set("X-Content-Type-Options", "nosniff")
		h.Set("Referrer-Policy", "strict-origin-when-cross-origin")
		// Note: X-XSS-Protection is omitted per modern OWASP guidelines as it is deprecated and can introduce vulnerabilities.

		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), nonceKey, nonce)))
	})
}
```
