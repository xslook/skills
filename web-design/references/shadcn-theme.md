# shadcn/ui Theme Integration Guide

Step-by-step instructions for implementing the shadcn/ui-styled theme using standard HTML5, CSS, and JavaScript without external framework dependencies.

---

## 1. Quick Integration Steps

### Step 1: Link Token Stylesheet
Add `theme/shadcn/theme.css` to define all `:root` CSS custom properties, light mode, and dark mode variants:

```html
<link rel="stylesheet" href="./theme/shadcn/theme.css">
```

### Step 2: Link Component Stylesheet
Add `theme/shadcn/components.css` to apply standardized typography, buttons, inputs, cards, dialogs, alerts, and table styles:

```html
<link rel="stylesheet" href="./theme/shadcn/components.css">
```

### Step 3: Initialize Theme Controller
Include `theme/shadcn/theme.js` to manage dark mode switching, OS preference synchronization, and runtime token overrides:

```html
<script src="./theme/shadcn/theme.js"></script>
<script>
  ThemeManager.initTheme({ defaultTheme: 'auto', syncWithSystem: true });
</script>
```

---

## 2. Token Alignment Reference

| Semantic Role | Light Value | Dark Value | CSS Custom Property | Usage Example |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `#FFFFFF` | `#09090B` | `--background` | `background-color: var(--background);` |
| **Foreground Text** | `#09090B` | `#FAFAFA` | `--foreground` | `color: var(--foreground);` |
| **Card Surface** | `#FFFFFF` | `#09090B` | `--card` | `background-color: var(--card);` |
| **Primary Action** | `#18181B` | `#FAFAFA` | `--primary` | `background-color: var(--primary);` |
| **Primary Foreground**| `#FAFAFA` | `#18181B` | `--primary-foreground` | `color: var(--primary-foreground);` |
| **Secondary Fill** | `#F4F4F5` | `#27272A` | `--secondary` | `background-color: var(--secondary);` |
| **Muted Text** | `#71717A` | `#A1A1AA` | `--muted-foreground` | `color: var(--muted-foreground);` |
| **Destructive / Error**| `#EF4444` | `#7F1D1D` | `--destructive` | `color: var(--destructive);` |
| **Success** | `#16A34A` | `#15803D` | `--success` | `border-color: var(--success);` |
| **Warning** | `#F59E0B` | `#B45309` | `--warning` | `background-color: var(--warning-bg);` |
| **Border** | `#E4E4E7` | `#27272A` | `--border` | `border: 1px solid var(--border);` |
| **Sidebar Surface** | `#FAFAFA` | `#121215` | `--sidebar` | `background-color: var(--sidebar);` |
| **Sidebar Text** | `#18181B` | `#FAFAFA` | `--sidebar-foreground`| `color: var(--sidebar-foreground);` |
| **Sidebar Accent** | `#F4F4F5` | `#27272A` | `--sidebar-accent` | `background-color: var(--sidebar-accent);` |
| **Sidebar Border** | `#E4E4E7` | `#27272A` | `--sidebar-border` | `border-color: var(--sidebar-border);` |
| **Chart Series 1** | `#E76E50` | `#2662D9` | `--chart-1` | `stroke: var(--chart-1);` |
| **Chart Series 2** | `#2A9D90` | `#E23670` | `--chart-2` | `stroke: var(--chart-2);` |
| **Chart Series 3** | `#274754` | `#E88C30` | `--chart-3` | `stroke: var(--chart-3);` |
| **Base Radius** | `6px` | `6px` | `--radius` | `border-radius: var(--radius);` |
| **Large Radius** | `12px` | `12px` | `--radius-lg` | `border-radius: var(--radius-lg);` |
| **Control Height** | `36px` | `36px` | `--control-height` | `height: var(--control-height);` |
| **Small Height** | `32px` | `32px` | `--control-height-sm` | `height: var(--control-height-sm);` |
| **Large Height** | `40px` | `40px` | `--control-height-lg` | `height: var(--control-height-lg);` |
| **Surface Shadow** | Layered | Diffuse | `--shadow-sm` | `box-shadow: var(--shadow-sm);` |

---

## 3. Interaction State Handling in Native CSS

Rely on standard CSS pseudo-classes without JavaScript state overhead:

```css
/* Focus Ring */
.interactive-element:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* Disabled State */
.interactive-element:disabled,
.interactive-element[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.5;
}
```

---

## 4. Modern Dashboard Layout Architecture

Standard layout architecture for enterprise workspace dashboards:

1. **Inset Canvas Structure**:
   - `.sidebar-wrapper`: Full viewport height flex container (`min-height: 100vh; background: var(--sidebar);`).
   - `.sidebar`: Collapsible left navigation rail (`--sidebar-width: 260px; --sidebar-width-icon: 48px;`) supporting icon-only collapsed mode and mobile drawer overlay.
   - `.sidebar-inset`: Floating, rounded canvas container (`margin: 0.5rem; border-radius: var(--radius-lg); border: 1px solid var(--sidebar-border); background: var(--background);`).
2. **Sticky Header Bar**:
   - Height: `var(--header-height)` (52px).
   - Contains sidebar collapse toggle trigger, vertical separator, page title, quick search input with `⌘K` badge, and theme mode toggle.
3. **Metric Cards Grid**:
   - 4-column responsive grid (`grid-template-columns: repeat(4, 1fr)`).
   - Each card displays small category label, large bold tabular-num metric, top-right trend pill badge (`+12.5%`), and bottom trend context.
4. **Time-Range Filtered Chart Card**:
   - Segmented toggle group (`.toggle-group`) for timeframe selection ("Last 3 months", "Last 30 days", "Last 7 days").
   - Responsive SVG line & area visualization utilizing `--chart-1` and `--chart-2`.
5. **Data Table Card**:
   - Header tab strip (`.tabs-list`) for views ("Outline", "Past Performance", "Personnel").
   - Filter toolbar with task search and action triggers.
   - Status indicators (`.badge-success`, `.badge-secondary`), inline editable numbers, assignee information, and pagination summary.

