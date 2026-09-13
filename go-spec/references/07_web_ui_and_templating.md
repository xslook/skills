# 07. Web UI, Templates & Security Specification

This specification guides LLMs in developing full-stack web pages, dashboards, and admin panels within Go applications. **Core Tenet: Prioritize modern native Web standards (Vanilla JS/CSS/HTML5), Go templates (SSR) with progressive API enhancement, alignment with shadcn minimal aesthetics, single-binary distribution via `//go:embed` with zero external dependencies, and defense-in-depth web security.**

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
	"html/template"
	"io/fs"
	"net/http"
	"os"
)

//go:embed templates/* static/*
var embeddedFS embed.FS

type AssetManager struct {
	isDev bool
}

func NewAssetManager(isDev bool) *AssetManager {
	return &AssetManager{isDev: isDev}
}

// GetStaticFS retrieves the static asset file system (supports local hot-reload in dev and embedded FS in production)
func (m *AssetManager) GetStaticFS() http.FileSystem {
	if m.isDev {
		// Dev mode: Read directly from local disk so CSS/JS changes don't require recompilation
		return http.Dir("internal/web/static")
	}
	// Production mode: Serve from embedded virtual filesystem
	sub, _ := fs.Sub(embeddedFS, "static")
	return http.FS(sub)
}

// ParseTemplates compiles and loads HTML templates
func (m *AssetManager) ParseTemplates(funcMap template.FuncMap) (*template.Template, error) {
	tmpl := template.New("").Funcs(funcMap)

	if m.isDev {
		return tmpl.ParseGlob("internal/web/templates/**/*.html")
	}
	return tmpl.ParseFS(embeddedFS, "templates/**/*.html", "templates/*.html")
}
```

---

## 3. shadcn/ui Native Modern CSS Specification

Align with shadcn visual styling using pure native modern CSS features (CSS Custom Properties, `:has()`, `backdrop-filter`, `accent-color`) without needing Tailwind CLI:

### 3.1 Core Design Variables (`shadcn_tokens.css`)
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}
```

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

### 5.1 Unified Fetch Client Wrapper (Automatic CSRF & Error Handling)
```javascript
// static/js/app.js
class APIClient {
    static getCSRFToken() {
        return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
    }

    static async request(url, options = {}) {
        const defaultHeaders = {
            'Content-Type': 'application/json',
            'X-CSRF-Token': this.getCSRFToken(),
        };

        const response = await fetch(url, {
            ...options,
            headers: { ...defaultHeaders, ...options.headers },
        });

        if (response.status === 401) {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
            return;
        }

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }
        return data;
    }

    static get(url) { return this.request(url, { method: 'GET' }); }
    static post(url, body) { return this.request(url, { method: 'POST', body: JSON.stringify(body) }); }
    static delete(url) { return this.request(url, { method: 'DELETE' }); }
}
```

### 5.2 Native `<dialog>` Modal Interaction
```html
<button class="btn btn-primary" onclick="document.getElementById('user-dialog').showModal()">
    Create User
</button>

<dialog id="user-dialog" class="dialog">
    <div class="dialog-content card">
        <div class="card-header">
            <h3 class="card-title">Create New User</h3>
        </div>
        <form id="create-user-form" onsubmit="handleCreateUser(event)">
            <div class="card-content space-y-4">
                <div>
                    <label class="label">Email</label>
                    <input type="email" name="email" required class="input" />
                </div>
            </div>
            <div class="card-footer flex justify-end gap-2">
                <button type="button" class="btn btn-outline" onclick="this.closest('dialog').close()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </form>
    </div>
</dialog>

<script>
async function handleCreateUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
        await APIClient.post('/api/v1/users', payload);
        Toast.success('User created successfully');
        document.getElementById('user-dialog').close();
        window.location.reload();
    } catch (err) {
        Toast.error(err.message);
    }
}
</script>
```

---

## 6. Authentication, Sessions & Security Controls

### 6.1 Secure Session Cookies
- **HttpOnly**: Must be set (`HttpOnly = true`) to prevent session theft via XSS.
- **Secure**: Must be enabled in production (`Secure = true`) to enforce HTTPS-only transmission.
- **SameSite**: Set to `SameSite = http.SameSiteLaxMode` (balancing CSRF protection with legitimate cross-site navigation).

```go
func SetAuthCookie(w http.ResponseWriter, sessionToken string, isProd bool, maxAge int) {
	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		Path:     "/",
		MaxAge:   maxAge,
		HttpOnly: true,
		Secure:   isProd,
		SameSite: http.SameSiteLaxMode,
	})
}
```

### 6.2 CSRF Token Verification Middleware (Double Submit Cookie)
All state-modifying requests (`POST`, `PUT`, `PATCH`, `DELETE`) must be inspected by CSRF middleware:

```go
func CSRFMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Read-only methods pass through
		if r.Method == http.MethodGet || r.Method == http.MethodHead || r.Method == http.MethodOptions {
			next.ServeHTTP(w, r)
			return
		}

		cookieToken, err := r.Cookie("csrf_token")
		if err != nil || cookieToken.Value == "" {
			http.Error(w, `{"error":"missing csrf cookie"}`, http.StatusForbidden)
			return
		}

		// Extract token from header or form parameter
		headerToken := r.Header.Get("X-CSRF-Token")
		if headerToken == "" {
			headerToken = r.FormValue("csrf_token")
		}

		// Constant-time comparison to prevent timing attacks
		if subtle.ConstantTimeCompare([]byte(cookieToken.Value), []byte(headerToken)) != 1 {
			http.Error(w, `{"error":"invalid csrf token"}`, http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}
```

### 6.3 Password Hashing & RBAC Middleware
```go
// 1. Secure password hashing with bcrypt
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPassword(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// 2. Role-based authorization middleware
func RequireRoles(roles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			user, ok := r.Context().Value("user").(*User)
			if !ok || user == nil {
				http.Redirect(w, r, "/login", http.StatusSeeOther)
				return
			}

			hasPermission := false
			for _, role := range roles {
				if user.Role == role {
					hasPermission = true
					break
				}
			}

			if !hasPermission {
				http.Error(w, "Forbidden: Insufficient Permissions", http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
```

### 6.4 Security Headers Middleware
```go
func SecurityHeadersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		w.Header().Set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;")
		next.ServeHTTP(w, r)
	})
}
```
