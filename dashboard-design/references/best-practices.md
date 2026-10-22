# Enterprise Dashboard Design Best Practices

Engineering and design guidelines for building robust, scalable dashboards, admin consoles, and data-dense applications.

---

## 1. The Component Customization Ladder

When customizing components, follow this 5-level hierarchy from lightest to heaviest:

```text
Level 1: Semantic HTML Attributes   (required, disabled, autofocus, aria-*)
   ▼
Level 2: Design Token Overrides     (--primary, --radius, --surface-*, --control-height)
   ▼
Level 3: Component Variant Classes   (.btn-outline, .btn-sm, .table-sm)
   ▼
Level 4: Slot Composition           (Header, Content, Footer, Prefix, Suffix)
   ▼
Level 5: Component Wrapper          (Isolated encapsulated widget / Custom Element)
```

### Guidance
- **Prefer Level 1 & 2**: Most branding and density adjustments should occur strictly by updating CSS custom properties on `:root` or container scopes.
- **Avoid Heavy Overrides**: Never inject arbitrary `!important` declarations or override core display/positioning properties without understanding the layout context.
- **Isolate Complex Behaviors**: When a component combines stateful logic (e.g., debounced search + select dropdown + keyboard navigation), wrap it in an isolated custom element or component module.

---

## 2. Theme Customization & Surface Elevation Inversion

### The Contrast Inversion Principle
- **Light Mode Elevation**: Surfaces remain white (`#FFFFFF`), with spatial elevation expressed through **ambient and key drop shadows** (`--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`).
- **Dark Mode Elevation**: Drop shadows are nearly invisible against dark canvas surfaces. Therefore, elevation is expressed through **progressively lighter surface values** (`--surface-0` through `--surface-4`):

```text
Light Mode:
[Canvas --surface-0: #FFFFFF] ──(--shadow-xs)──> [Card --surface-1: #FFFFFF] ──(--shadow-lg)──> [Dialog --surface-4: #FFFFFF]

Dark Mode:
[Canvas --surface-0: #09090B] ──(Lighter Tone)─> [Card --surface-1: #121215] ──(Lighter Tone)─> [Dialog --surface-4: #2A2A30]
```

### Contrast Ratio Guardrails (WCAG 2.1)
- **Normal Text (< 18px)**: Minimum **4.5:1** contrast against surface background.
- **Large Text (≥ 18px bold or ≥ 24px regular)**: Minimum **3.0:1** contrast.
- **UI Components & Active Borders**: Minimum **3.0:1** against adjacent surfaces.
- **Disabled Elements**: Exempt from WCAG contrast minimums, but should maintain at least **1.5:1** to remain recognizable as disabled controls.

---

## 3. Density Modes for Enterprise Contexts

Dashboards serve different operator profiles. Use the 3 standard density tiers (synchronized with [`visual-hierarchy.md`](./layout/visual-hierarchy.md)):

| Density Mode | Control Height | Table Row Height | Container Padding | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **Compact** | `32px` (`24px` micro) | `36px` | `12px` / `16px` | Financial trading desks, NOC monitoring, DevOps log consoles |
| **Default** | `36px` | `48px` | `16px` / `24px` | Standard SaaS admin, CRM/ERP, inventory & analytics dashboards |
| **Loose** | `40px` | `56px` | `24px` / `32px` | Executive summaries, onboarding wizards, tablet touch targets |

### Switching Density via CSS Custom Properties
```css
/* Apply compact density to a specific dashboard panel or data grid */
.dashboard-density-compact {
  --control-height: var(--control-height-sm); /* 32px */
  --font-size-sm: 13px;
  --table-row-height: 36px;
  --card-padding: 12px 16px;
}

/* Apply loose density for touch-friendly or executive views */
.dashboard-density-loose {
  --control-height: var(--control-height-lg); /* 40px */
  --table-row-height: 56px;
  --card-padding: 24px 32px;
}
```

---

## 4. Accessibility & Focus Trap Management

### Modal & Drawer Rules
1. **Focus Trap**: When a modal or drawer opens, keyboard focus must be trapped within its DOM sub-tree. Pressing `Tab` on the last interactive element must cycle back to the first.
2. **Escape Key Dismissal**: Pressing `Escape` must close the topmost active dialog, drawer, or popover.
3. **Restoring Focus**: Upon closure, focus must immediately return to the trigger element that opened the overlay.
4. **Body Scroll Lock**: Prevent the background document from scrolling while a blocking overlay is open (`overflow: hidden` on `<body>`).

### Form Field Validation
- Link error messages to their corresponding input via `aria-describedby="[error-id]"`.
- Set `aria-invalid="true"` when validation fails.
- Never rely solely on color to indicate errors; combine border tint (`--destructive`) with an error icon and actionable recovery text.

---

## 5. Performance Guardrails for Data-Dense Views

1. **DOM Node Budget**: Keep total rendered DOM nodes below **1,500** per page view to prevent scroll jitter and layout thrashing.
2. **Table & List Virtualization**: For tables or lists exceeding **100 rows** without pagination, use virtualized viewport rendering ([`Listy`](./components/data-display/listy.md)) to render only visible rows plus a small overscan buffer.
3. **Filter Debouncing**: Debounce text search and filter inputs by **250ms** before firing network queries or expensive client-side filtering.
4. **Tabular Figures**: Always apply `font-variant-numeric: tabular-nums` to numbers, currencies, percentages, and timestamps in data tables and KPI cards to prevent horizontal layout shift during live updates.
