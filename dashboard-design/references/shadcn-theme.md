# shadcn/ui Theme Integration Guide

Step-by-step instructions for implementing the shadcn/ui-styled reference theme using standard HTML5, CSS, and JavaScript with zero external build or framework dependencies.

---

## 1. Quick Integration Steps

### Step 1: Link Token Stylesheet
Add [`templates/shadcn/theme.css`](../templates/shadcn/theme.css) to define all `:root` CSS custom properties, light mode defaults, and dark mode variants:

```html
<link rel="stylesheet" href="./templates/shadcn/theme.css">
```

### Step 2: Link Component Stylesheet
Add [`templates/shadcn/components.css`](../templates/shadcn/components.css) to apply standardized typography, buttons, inputs, cards, dialogs, alerts, badges, sidebar, and data table primitives:

```html
<link rel="stylesheet" href="./templates/shadcn/components.css">
```

### Step 3: Initialize Theme Controller
Include [`templates/shadcn/theme.js`](../templates/shadcn/theme.js) to manage light/dark/system mode switching, `localStorage` persistence, collapsible sidebar state, and runtime token overrides:

```html
<script src="./templates/shadcn/theme.js"></script>
<script>
  ThemeManager.initTheme({ defaultTheme: 'auto', syncWithSystem: true });
  ThemeManager.initSidebar();
</script>
```

---

## 2. Token Alignment Reference

| Semantic Role | Light Value | Dark Value | CSS Custom Property | Usage Example |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `#FFFFFF` | `#09090B` | `--background` / `--surface-0` | `background-color: var(--background);` |
| **Foreground Text** | `#09090B` | `#FAFAFA` | `--foreground` / `--text-0` | `color: var(--foreground);` |
| **Card Surface** | `#FFFFFF` | `#121215` | `--card` / `--surface-1` | `background-color: var(--surface-1);` |
| **Hover / Header Surface** | `#F4F4F5` | `#1C1C20` | `--surface-2` | `background-color: var(--surface-2);` |
| **Floating Popover Surface** | `#FFFFFF` | `#242429` | `--surface-3` | `background-color: var(--surface-3);` |
| **Modal / Dialog Surface** | `#FFFFFF` | `#2A2A30` | `--surface-4` | `background-color: var(--surface-4);` |
| **Primary Action** | `#18181B` | `#FAFAFA` | `--primary` | `background-color: var(--primary);` |
| **Primary Foreground** | `#FAFAFA` | `#18181B` | `--primary-foreground` | `color: var(--primary-foreground);` |
| **Secondary Fill** | `#F4F4F5` | `#27272A` | `--secondary` | `background-color: var(--secondary);` |
| **Muted Text** | `#71717A` | `#A1A1AA` | `--muted-foreground` / `--text-1` | `color: var(--muted-foreground);` |
| **Caption / Placeholder** | `#A1A1AA` | `#71717A` | `--text-2` | `color: var(--text-2);` |
| **Disabled Text** | `#D4D4D8` | `#52525B` | `--text-3` | `color: var(--text-3);` |
| **Destructive / Error** | `#EF4444` | `#7F1D1D` | `--destructive` | `color: var(--destructive);` |
| **Success** | `#16A34A` | `#15803D` | `--success` | `border-color: var(--success);` |
| **Warning** | `#F59E0B` | `#B45309` | `--warning` | `background-color: var(--warning-bg);` |
| **Info** | `#2563EB` | `#1D4ED8` | `--info` | `background-color: var(--info-bg);` |
| **Border** | `#E4E4E7` | `#27272A` | `--border` | `border: 1px solid var(--border);` |
| **Sidebar Surface** | `#FAFAFA` | `#121215` | `--sidebar` | `background-color: var(--sidebar);` |
| **Sidebar Text** | `#18181B` | `#FAFAFA` | `--sidebar-foreground` | `color: var(--sidebar-foreground);` |
| **Sidebar Accent** | `#F4F4F5` | `#27272A` | `--sidebar-accent` | `background-color: var(--sidebar-accent);` |
| **Sidebar Border** | `#E4E4E7` | `#27272A` | `--sidebar-border` | `border-color: var(--sidebar-border);` |
| **Chart Series 1–3** | `#E76E50`, `#2A9D90`, `#274754` | `#2662D9`, `#E23670`, `#E88C30` | `--chart-1` .. `--chart-3` | `stroke: var(--chart-1);` |
| **Base Radius** | `6px` | `6px` | `--radius` | `border-radius: var(--radius);` |
| **Large Radius** | `12px` | `12px` | `--radius-lg` | `border-radius: var(--radius-lg);` |
| **Micro Height (xs)** | `24px` | `24px` | `--control-height-xs` | `height: var(--control-height-xs);` |
| **Small Height (sm)** | `32px` | `32px` | `--control-height-sm` | `height: var(--control-height-sm);` |
| **Default Height (md)** | `36px` | `36px` | `--control-height` | `height: var(--control-height);` |
| **Large Height (lg)** | `40px` | `40px` | `--control-height-lg` | `height: var(--control-height-lg);` |
| **Surface Shadow** | Layered | Diffuse | `--shadow-sm` | `box-shadow: var(--shadow-sm);` |

---

## 3. Switching to the Enterprise Blue Brand Preset

To switch from the default monochrome Zinc/Obsidian primary palette to Enterprise Daybreak Blue (`#1677FF`), override `--primary` and `--ring` via CSS or `ThemeManager`:

```javascript
// Runtime brand override
ThemeManager.setToken('primary', '#1677ff');
ThemeManager.setToken('primary-hover', '#4096ff');
ThemeManager.setToken('primary-active', '#0958d9');
ThemeManager.setToken('primary-foreground', '#ffffff');
ThemeManager.setToken('ring', '#1677ff');
```

---

## 4. Modern Dashboard Layout Architecture

Standard layout architecture for enterprise workspace dashboards (see full HTML boilerplate in [`templates/shadcn/style-guide.md`](../templates/shadcn/style-guide.md#4-complete-dashboard-layout-boilerplate)):

1. **Inset Canvas Structure**:
   - `.sidebar-wrapper`: Full viewport height flex container (`min-height: 100vh; background: var(--sidebar);`).
   - `.sidebar`: Collapsible left navigation rail (`--sidebar-width: 260px; --sidebar-width-icon: 48px;`) supporting icon-only collapsed mode and mobile drawer overlay.
   - `.sidebar-inset`: Floating, rounded canvas container (`margin: 0.5rem; border-radius: var(--radius-lg); border: 1px solid var(--sidebar-border); background: var(--background);`).
2. **Sticky Header Bar**:
   - Height: `var(--header-height)` (`52px`).
   - Contains sidebar collapse toggle trigger, vertical separator, page title, quick search input with `⌘K` shortcut badge, and theme mode switcher.
3. **Metric Cards Grid**:
   - 4-column responsive grid (`.dashboard-grid`).
   - Each `.stat-card` displays a category label, bold `tabular-nums` metric value, top-right trend pill badge (`+12.5%`), and bottom trend context.
4. **Time-Range Filtered Chart Card**:
   - Segmented toggle group (`.toggle-group`) for timeframe selection ("Last 3 months", "Last 30 days", "Last 7 days").
   - Responsive SVG line & area visualization utilizing `--chart-1` and `--chart-2`.
5. **Data Table Card**:
   - Header tab strip (`.tabs-list`) for switching views ("Outline", "Past Performance", "Personnel").
   - Filter toolbar with task search and export action triggers.
   - Status indicators (`.badge-success`, `.badge-secondary`), `tabular-nums` right-aligned numeric columns, and pagination summary.
