# Accessibility (a11y) & UX Ergonomics

This guide details accessibility standards, semantic landmarks, ARIA states, and UX conventions for dashboard interfaces.

---

## 1. Semantic HTML Landmarks

Dashboards must use standard HTML5 landmark elements so assistive technologies (screen readers, keyboard navigators) can navigate efficiently:

```html
<div class="sidebar-wrapper">
  <!-- Navigation Landmark -->
  <app-sidebar role="navigation" aria-label="Main Navigation">
    ...
  </app-sidebar>

  <div class="sidebar-inset">
    <!-- Banner Landmark -->
    <header class="site-header" role="banner">
      <nav class="breadcrumb" aria-label="Breadcrumb"> ... </nav>
      ...
    </header>

    <!-- Main Content Landmark -->
    <main class="site-main" id="main-content" role="main">
      ...
    </main>
  </div>
</div>
```

---

## 2. ARIA Contracts for Dynamic States

| Component / State | Attribute Contract | Purpose |
| :--- | :--- | :--- |
| **Active Nav Link** | `aria-current="page"` | Informs screen readers of the active page. |
| **Fragment Swapping** | `aria-busy="true"` (set by `swap.js`) | Signals that the region is temporarily fetching fresh data. |
| **Sortable Headers** | `aria-sort="ascending"` / `"descending"` | Communicates table column sort direction. |
| **Toast Notifications**| `<div aria-live="polite">` | Announces incoming notifications non-disruptively. |
| **Collapsible Sidebar**| `aria-expanded="true|false"` | Indicates whether the navigation drawer is expanded. |
| **Selection Checkbox** | `aria-label="Select row INV-001"` | Provides distinct context for table row selection checkboxes. |

---

## 3. Four Mandatory Component States

Every data-driven component (table, metric card, analytical chart) must provide explicit UI representations for all four states:

1. **Populated State**: Clean presentation of active data.
2. **Loading State**:
   - For initial loads: Use `.skeleton` pulsing blocks matching the target layout geometry.
   - For partial updates: The target element receives `aria-busy="true"` and an overlay spinner/dimming.
3. **Empty State**:
   - Render `.empty-state` with an explanatory icon, clear heading, concise description, and a primary CTA button (e.g., "Create First Record").
   - Never show an empty, blank table with missing rows without an explicit empty state.
4. **Error State**:
   - When API or template rendering fails, render an error card with a descriptive message and a retry button (`data-swap="target-id"`).

---

## 4. Reduced Motion & Sensory Ergonomics

In `base.css`:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
Chart animations and sidebar transitions automatically collapse to instantaneous changes when users specify motion sensitivity in their operating system.
