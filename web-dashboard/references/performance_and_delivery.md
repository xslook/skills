# Performance & Delivery Specification

This guide defines performance budgets, asset delivery techniques, and optimization strategies for native server-rendered dashboards.

---

## 1. Performance Budgets

| Asset Category | Target Budget (Uncompressed) | Gzipped / Compressed |
| :--- | :--- | :--- |
| **All Design System CSS** | ≤ 50 KB | ~8–12 KB |
| **All Core & Component JS** | ≤ 30 KB | ~5–8 KB |
| **Lucide Icon Sprite (SVG)** | ≤ 20 KB | ~4–6 KB |
| **Chart.js (Lazy-loaded)** | ~200 KB (Loaded only on chart views)| ~65 KB |
| **First Contentful Paint (FCP)**| < 300 ms on broadband | < 300 ms |

---

## 2. Preventing Cumulative Layout Shift (CLS)

Layout shifts degrade user experience during page loading. Follow these strict rules:

1. **Fixed Chart Canvas Heights**:
   - The `.chart-canvas-container` must define an explicit height in CSS (`height: 280px; max-height: 340px`).
   - Never allow the canvas container to collapse to `0px` before Chart.js finishes initializing.
2. **Icon & Avatar Sizing**:
   - All SVG icons have explicit dimensions (`width: 1rem; height: 1rem;` or `class="icon"`).
   - Avatars specify strict dimensions (`width: 2rem; height: 2rem; flex-shrink: 0`).
3. **Server-Side Cookie Theming**:
   - Render the `class="dark"` attribute directly on the `<html>` element from the Go/Rust server based on the `theme` cookie.
   - This eliminates the layout and paint repaint flash that occurs when waiting for client JavaScript execution.

---

## 3. Server Compression & Caching Headers

Both Go and Rust HTTP servers should configure caching and compression:

### 3.1 Caching Policy
- **Embedded Static Assets (`/static/*`)**:
  - `Cache-Control: public, max-age=3600` (1 hour) or long-lived immutable caching if content hashing is applied.
  - Automatically calculate and return an `ETag` (using the embedded file's sha256 hash) to allow fast `304 Not Modified` responses.
- **Dynamic HTML Pages & Fragments**:
  - `Cache-Control: no-cache, private`
  - `Vary: X-Fragment, Cookie`

### 3.2 Gzip / Brotli Middleware
Enable transparent response compression for static assets and HTML responses:
- In Go: `github.com/NYTimes/gziphandler` or standard reverse proxy (Nginx / Cloudflare / Caddy).
- In Rust: `tower_http::compression::CompressionLayer`.
