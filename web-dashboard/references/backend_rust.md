# Backend Integration: Rust (Axum + Askama)

This guide details how to integrate the dashboard design system into Rust services using **Axum**, **Askama** (compile-time checked HTML templates), and **rust-embed** for single-binary delivery.

---

## 1. Cargo Dependencies

In your service's `Cargo.toml`:

```toml
[dependencies]
axum = { version = "0.8", features = ["macros"] }
tokio = { version = "1.40", features = ["full"] }
askama = { version = "0.16", features = ["with-axum"] }
askama_axum = "0.4"
rust-embed = { version = "8.5", features = ["mime-guess"] }
tower-http = { version = "0.6", features = ["fs", "trace"] }
cookie = "0.18"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

---

## 2. Compile-Time Checked Askama Templates

Askama parses and type-checks templates at compile time. Any syntax error, missing field, or invalid filter will fail `cargo build`.

### 2.1 Base Layout (`templates/layouts/base.html`)
```html
<!DOCTYPE html>
<html lang="en" class="{{ theme }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% block title %}Dashboard{% endblock %} - Cloud Service</title>
  <link rel="stylesheet" href="/static/css/app.css">
  <script type="module" src="/static/js/app.js"></script>
  {% block head %}{% endblock %}
</head>
<body>
  {% block content %}{% endblock %}
</body>
</html>
```

### 2.2 Full Page & Fragment Structs
Askama supports rendering a single block from a template via the `block = "..."` attribute:

```rust
use askama::Template;

// 1. Full Page Template (Renders complete HTML layout)
#[derive(Template)]
#[template(path = "pages/dashboard.html")]
pub struct DashboardPageTemplate<'a> {
    pub theme: &'a str,
    pub sidebar_state: &'a str,
    pub title: &'a str,
    pub kpi_revenue: &'a str,
    pub kpi_users: u32,
    pub invoices: Vec<InvoiceViewModel>,
}

// 2. Partial Fragment Template (Renders ONLY the table card on X-Fragment request)
#[derive(Template)]
#[template(path = "pages/dashboard.html", block = "invoices_table")]
pub struct InvoicesTableFragmentTemplate {
    pub invoices: Vec<InvoiceViewModel>,
}
```

---

## 3. Axum Handler with Fragment Swap Routing

```rust
use axum::{
    extract::Request,
    http::{header, HeaderMap, StatusCode},
    response::{Html, IntoResponse, Response},
    routing::get,
    Router,
};
use askama::Template;

pub async fn handle_dashboard(headers: HeaderMap, req: Request) -> Result<Response, StatusCode> {
    // 1. Inspect Cookies for Theme and Sidebar State
    let cookie_header = headers.get(header::COOKIE).and_then(|v| v.to_str().ok()).unwrap_or("");
    let is_dark = cookie_header.contains("theme=dark");
    let theme = if is_dark { "dark" } else { "light" };

    let is_collapsed = cookie_header.contains("sidebar_state=collapsed");
    let sidebar_state = if is_collapsed { "collapsed" } else { "expanded" };

    // Fetch view data
    let invoices = fetch_invoices().await;

    // 2. Check for X-Fragment Header
    if let Some(target) = headers.get("X-Fragment").and_then(|v| v.to_str().ok()) {
        if target == "invoices-table" {
            let fragment = InvoicesTableFragmentTemplate { invoices };
            let html = fragment.render().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
            return Ok((
                [(header::CONTENT_TYPE, "text/html; charset=utf-8"), (header::VARY, "X-Fragment")],
                html,
            ).into_response());
        }
    }

    // 3. Render Full Page
    let page = DashboardPageTemplate {
        theme,
        sidebar_state,
        title: "Overview",
        kpi_revenue: "$45,231.89",
        kpi_users: 2350,
        invoices,
    };

    let html = page.render().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok((
        [(header::CONTENT_TYPE, "text/html; charset=utf-8"), (header::VARY, "X-Fragment")],
        html,
    ).into_response())
}
```

---

## 4. Single-Binary Static Asset Embedding (`rust-embed`)

```rust
use rust_embed::RustEmbed;
use axum::{
    http::{header, StatusCode, Uri},
    response::{IntoResponse, Response},
};

#[derive(RustEmbed)]
#[folder = "web/static/"]
struct StaticAssets;

pub async fn static_handler(uri: Uri) -> Response {
    let path = uri.path().trim_start_matches("/static/");

    match StaticAssets::get(path) {
        Some(content) => {
            let mime = mime_guess::from_path(path).first_or_octet_stream();
            (
                [
                    (header::CONTENT_TYPE, mime.as_ref()),
                    (header::CACHE_CONTROL, "public, max-age=3600"),
                ],
                content.data,
            ).into_response()
        }
        None => StatusCode::NOT_FOUND.into_response(),
    }
}
```
