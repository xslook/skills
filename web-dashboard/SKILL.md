---
name: web-dashboard
description: >-
  Use when creating, updating, rewriting, improving, or optimizing an admin or dashboard web UI
  in shadcn/ui dashboard style for Go or Rust services — server-rendered templates (html/template, Askama),
  pure modern CSS design tokens (OKLCH), vanilla ES modules and Custom Elements, single-binary asset embedding,
  zero Node.js or JavaScript build pipeline at deployment.
argument-hint: "Operation: 'create', 'update', 'rewrite', 'improve', or 'optimize'"
---

# Web Dashboard Engineering Skill (shadcn Style)

This skill defines the engineering standards, architecture, design tokens, and modular components for building and maintaining production-grade admin dashboards in the **shadcn/ui `dashboard-01`** style for backend services written in **Go** and **Rust**.

Formal deployment requires **zero Node.js**, zero npm, and zero JavaScript build pipelines. All assets are compiled directly into the binary.

---

## 0. Non-Negotiable Golden Rules

1. **Zero Deployment Runtimes (No Node.js Required)**:
   - Dashboards must rely exclusively on modern native web standards: HTML5, pure CSS (`@layer`, OKLCH, container queries, `:has()`, `<dialog>`), vanilla ES modules, and Custom Elements.
   - Never introduce Node.js, Webpack, Vite, Tailwind CLI, React, or Vue into production deployment workflows.
2. **The Server Owns State & Routing**:
   - Initial page loads and core data must be server-rendered (Go's `html/template` or Rust's `Askama`) for instant first-contentful paint (FCP) and zero layout jump.
   - The browser URL is the source of truth for all filters, sorting, and pagination (`?q=...&status=paid&sort=date&page=2`).
3. **The Fragment Swap Protocol**:
   - High-speed interactivity without full-page reloads is achieved using `core/swap.js`: requests send `X-Fragment: <id>`, the server renders only that template partial, and the client swaps the element in place.
4. **OKLCH Design Tokens Only**:
   - Never hardcode raw hex (`#...`) or rgb/hsl colors in component stylesheets. Always use semantic CSS variables (`var(--primary)`, `var(--card)`, `var(--border)`).
   - *Note on `go-spec` coexistence*: `go-spec` uses legacy HSL tokens. This skill standardizes on modern shadcn OKLCH tokens (`oklch(L C H)`). When building or modifying web UIs, always adhere to this skill's OKLCH token system.
5. **Strict CSP & Zero Inline Handlers**:
   - Inline script execution without cryptographic nonces is strictly forbidden.
   - Never write inline event handlers (`onclick="..."`, `onsubmit="..."`). Use delegated `data-action="..."` attributes or Custom Elements.
   - Never assign untrusted strings directly to `innerHTML`. Use `textContent` or the validated template parser in `swap.js`.
6. **Lazy-Load Heavy Libraries**:
   - Vendored Chart.js is lazy-loaded by `<chart-card>` only on pages that contain analytical charts. Never include charting libraries in global headers.

---

## 1. Operation Router

| Operation | Purpose | Reference Guide & Checklist |
| :--- | :--- | :--- |
| **`create`** | Scaffold a new dashboard from scratch for a Go or Rust service | [SOP: Create](./references/workflows.md#1-sop-create-new-dashboard-from-scratch) |
| **`update`** | Add a new page, table, metric card, modal, or form to an existing dashboard | [SOP: Update](./references/workflows.md#2-sop-update-adding-new-features-or-components) |
| **`rewrite`** | Migrate a heavy SPA (React, Vue, Tailwind) to native server-rendered templates | [SOP: Rewrite](./references/workflows.md#3-sop-rewrite-migrating-from-reactvuetailwind-to-native-web) |
| **`improve`** | Elevate UX, accessibility (a11y), dark-mode FOUC, or missing loading/empty states | [SOP: Improve](./references/workflows.md#4-sop-improve-ux--visual-polish-audit) |
| **`optimize`** | Optimize bundle size, lazy-load charts, prevent layout shifts (CLS), and add ETags | [SOP: Optimize](./references/workflows.md#5-sop-optimize-performance--delivery-tuning) |

---

## 2. Standard Web Layer Architecture

```text
my-service/
├── internal/web/ (or web/ in Rust)
│   ├── assets.go (or src/web/assets.rs)    # Embedded FS (//go:embed or rust-embed)
│   ├── templates/                         # Server templates
│   │   ├── layouts/base.html              # Shell skeleton (Header, Sidebar, Inset, Dark Mode)
│   │   ├── partials/                      # Reusable components (section_cards, data_table)
│   │   └── pages/                         # Business pages (dashboard.html, users.html)
│   └── static/                            # Pure static assets
│       ├── css/
│       │   ├── app.css                    # Cascade layer manifest (@layer)
│       │   ├── tokens.css                 # OKLCH tokens (light & dark mode)
│       │   ├── base.css                   # Global reset, typography, focus rings
│       │   ├── layout.css                 # Shell layout & container queries
│       │   ├── utilities.css              # Lightweight helper classes
│       │   └── components/                # Modular component CSS files
│       ├── js/
│       │   ├── app.js                     # ES module entry point
│       │   ├── core/                      # actions.js, api.js, swap.js, theme.js, toast.js
│       │   └── components/                # app-sidebar.js, data-table.js, chart-card.js
│       ├── icons/sprite.svg               # Lucide SVG icon sprite
│       └── vendor/chart.umd.min.js        # Vendored Chart.js
```

---

## 3. Core Component Catalog & Contracts

| Component | HTML Tag / Class Contract | Interactive Behavior | Reference |
| :--- | :--- | :--- | :--- |
| **App Sidebar** | `<app-sidebar class="app-sidebar">` | Desktop icon rail collapse, mobile off-canvas drawer, `⌘+B` toggle | [layout_shell.md](./references/layout_shell.md) |
| **Section KPI Cards**| `<div class="card card-metric">` | Metric value, trend delta, container query column wrap | [components.md](./references/components.md#3-card--section-kpi-metric-card) |
| **Interactive Chart**| `<chart-card class="chart-card">` | Lazy Chart.js loading, OKLCH to Canvas RGB resolution, timeframe toggle | [charts.md](./references/charts.md) |
| **Data Table** | `<data-table class="card">` | Server sorting/filtering via `swap.js`, row selection, bulk action bar | [data_tables.md](./references/data_tables.md) |
| **Modal Dialog** | `<dialog id="..." class="dialog">` | Native `<dialog>` modal, backdrop blur, `data-action="open-dialog"` | [components.md](./references/components.md#5-native-modal-dialog-dialog) |
| **Side Sheet** | `<dialog id="..." class="sheet" data-side="right">` | Side slide-over drawer for details, inspector, or notifications | [components.md](./references/components.md#6-side-sheet--drawer-dialog-classsheet) |
| **Toast Alerts** | `Toast.success(...)` / `Toast.error(...)` | Queue-based alert notifications via safe `textContent` | [interactivity.md](./references/interactivity.md#4-toast-notifications-api) |

---

## 4. Deep-Dive References

- [Architecture & Fragment Protocol](./references/architecture.md)
- [Design Tokens & OKLCH Theming](./references/design_tokens_and_theming.md)
- [Application Shell & Layout](./references/layout_shell.md)
- [Component Catalog & Contracts](./references/components.md)
- [Data Tables & Grid Standards](./references/data_tables.md)
- [Charts & Canvas Visualizations](./references/charts.md)
- [Client Interactivity & Scripting](./references/interactivity.md)
- [Go Backend Integration (html/template)](./references/backend_go.md)
- [Rust Backend Integration (Axum + Askama)](./references/backend_rust.md)
- [Accessibility (a11y) & UX Ergonomics](./references/accessibility_and_ux.md)
- [Performance & Delivery Budgets](./references/performance_and_delivery.md)
- [Standard Operating Procedures (Workflows)](./references/workflows.md)

---

## 5. Templates & Tooling Index

- **CSS & JS Asset Kit**: `templates/static/`
- **Reference Markup**:
  - `templates/markup/dashboard.html` (Full `dashboard-01` reference page)
  - `templates/markup/components.html` (Component gallery for visual QA)
- **Automation Scripts**:
  - `scripts/vendor_chartjs.sh` (Downloads and verifies SHA-256 checksum of Chart.js)
  - `scripts/audit.sh` (POSIX validator checking zero inline handlers, zero Node dependencies, and token compliance)

---

## 6. Pre-Delivery Quality Checklist

Before completing any dashboard development task, run this verification checklist:

- [ ] **Zero Node.js Artifacts**: No `package.json`, `node_modules`, or build steps present in deployment paths.
- [ ] **Strict CSP Compliance**: Zero inline event handlers (`onclick=`, etc.); zero un-nonced inline scripts.
- [ ] **Token Discipline**: All colors, radii, and surfaces use `var(--*)` tokens; no hardcoded `#hex` or `rgb()` in component CSS.
- [ ] **Dark Mode Parity**: Initial paint sets `class="dark"` server-side from `theme` cookie with zero visual flash.
- [ ] **Data Table Ergonomics**: Sorting and pagination preserve query parameters via `swap.js`; bulk selection bar operates cleanly.
- [ ] **Chart Lazy Loading**: Chart.js is only loaded on pages featuring `<chart-card>`.
- [ ] **Audit Script Passes**: `./scripts/audit.sh <target_folder>` exits with code `0`.
