# Application Layout Shell (Dashboard-01 Specification)

This specification defines the structural layout of the dashboard shell modeled directly after shadcn's official `dashboard-01` block.

---

## 1. Shell Anatomy & Structure

The dashboard layout consists of two main siblings inside `.sidebar-wrapper`:
1. `<app-sidebar>`: The persistent or collapsible navigation sidebar.
2. `.sidebar-inset`: The main working canvas containing `.site-header` and `.site-main`.

```text
.sidebar-wrapper [data-variant="inset"]
├── <app-sidebar> [data-state="expanded|collapsed"]
│   ├── .sidebar-header     (Team switcher / Organization brand)
│   ├── .sidebar-content    (Navigation groups & links)
│   │   ├── .sidebar-group  ("Platform")
│   │   └── .sidebar-group  ("Projects")
│   └── .sidebar-footer     (User account / logout trigger)
├── .sidebar-backdrop       (Mobile overlay only)
└── .sidebar-inset
    ├── .site-header        (Sticky header: trigger, breadcrumb, search, theme, actions)
    └── .site-main          (@container main: section-cards, chart, data-table)
```

---

## 2. Desktop Collapsible Icon Rail Behavior

On desktop screens (`> 768px`):
- **Expanded State** (`data-state="expanded"`):
  - Sidebar width is set to `var(--sidebar-width)` (default: `16rem` / `256px`).
  - Full labels, group headings, and account descriptions are visible.
- **Collapsed State** (`data-state="collapsed"`):
  - Sidebar width animates smoothly to `var(--sidebar-width-icon)` (default: `3.25rem` / `52px`).
  - `.sidebar-label`, `.sidebar-group-label`, and user metadata are hidden with `display: none !important;`.
  - Icon buttons are centered.
  - Hovering on an icon button displays a native CSS tooltip using `data-tooltip="..."` and `data-tooltip-side="right"`.

### 2.1 Preserving State Across Page Reloads
The `<app-sidebar>` Custom Element stores the current collapse state in the `sidebar_state` cookie (`expanded` or `collapsed`). The server template checks this cookie on incoming requests:
```html
<app-sidebar class="app-sidebar" data-state="{{ if eq .SidebarState "collapsed" }}collapsed{{ else }}expanded{{ end }}">
```
This guarantees that when navigating between pages, the sidebar remains in the user's chosen state without client-side jumping.

---

## 3. Mobile Off-Canvas Drawer Behavior

On mobile viewports (`<= 768px`):
- The `<app-sidebar>` changes to `position: fixed` with `transform: translateX(-100%)`.
- When the user taps the trigger button (`[data-action="toggle-sidebar"]`):
  - `<app-sidebar>` transitions to `transform: translateX(0)`.
  - `.sidebar-backdrop` displays with `background-color: oklch(0 0 0 / 0.5)` and `backdrop-filter: blur(4px)`.
- Tapping the backdrop or pressing the `Escape` key immediately closes the drawer and restores body scrolling.

---

## 4. Inset Variant (`data-variant="inset"`)

The official shadcn `dashboard-01` design uses the modern "inset" layout style:
- The sidebar sits against the window edge.
- The `.sidebar-inset` content wrapper has a subtle margin (`0.5rem`), rounded borders (`border-radius: var(--radius-xl)`), a subtle border (`1px solid var(--border)`), and a light elevation drop shadow.
- On mobile devices, these margins and borders automatically reset to zero for maximum usable screen area.

---

## 5. Sticky Site Header & Breadcrumb Bar

The `.site-header` sits pinned at the top of the viewport:
- `position: sticky; top: 0; z-index: 20;`
- Semi-transparent backdrop blur:
  ```css
  background-color: color-mix(in oklch, var(--background) 85%, transparent);
  backdrop-filter: blur(8px);
  ```
- Height is fixed to `var(--header-height)` (default: `3.5rem`).
- Left cluster: Sidebar toggle button, vertical separator, hierarchical breadcrumbs (`nav.breadcrumb`).
- Right cluster: Global quick search input, theme toggle button, notification trigger, primary action CTA.

---

## 6. Container Queries on `.site-main`

Instead of relying solely on window breakpoints (`@media`), the dashboard main container defines an inline container:

```css
.site-main {
  container-type: inline-size;
  container-name: main;
}
```

Components adapt based on the actual width available to the content canvas (which changes when the sidebar expands or collapses):
- Summary KPI Cards:
  - Default: 1 column (`.grid-cols-1`)
  - `@container main (min-width: 640px)`: 2 columns (`.cq-grid-cols-2`)
  - `@container main (min-width: 1024px)`: 4 columns (`.cq-grid-cols-4`)
