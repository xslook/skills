# Enterprise Web Design Best Practices

Engineering and design guidelines for building robust, scalable dashboards and administrative applications.

---

## 1. The Component Customization Ladder

When customizing components, follow this 5-level hierarchy from lightest to heaviest:

```text
Level 1: Semantic HTML Attributes   (required, disabled, autofocus, aria-*)
   ▼
Level 2: Design Token Overrides     (--primary, --radius, --surface-*)
   ▼
Level 3: Component Variant Classes   (.btn-outline, .btn-sm, .card-hoverable)
   ▼
Level 4: Slot Composition          (Header, Content, Footer, Prefix, Suffix)
   ▼
Level 5: Component Wrapper          (Isolated encapsulated widget)
```

### Guidance
- **Prefer Level 1 & 2**: Most branding adjustments should occur strictly by updating CSS custom properties on `:root` or container scopes.
- **Avoid Heavy Overrides**: Never inject arbitrary `!important` declarations or override core display/positioning properties without understanding the layout context.
- **Isolate Complex Behaviors**: When a component combines stateful logic (e.g., debounced search + select dropdown + keyboard navigation), wrap it in an isolated custom element or component module.

---

## 2. Theme Customization & Surface Elevation Inversion

### The Contrast Inversion Principle
- **Light Mode Elevation**: Surfaces remain near-white (`#FFFFFF`), with spatial elevation expressed through **ambient and key drop shadows** (`--shadow-sm`, `--shadow-md`, `--shadow-lg`).
- **Dark Mode Elevation**: Drop shadows are invisible against dark canvas surfaces. Therefore, elevation is expressed through **lightening surface values**:

```text
Light Mode:
[Canvas: #FFFFFF] ──(Shadow Level 1)──> [Card: #FFFFFF] ──(Shadow Level 3)──> [Dialog: #FFFFFF]

Dark Mode:
[Canvas: #09090B] ──(Lighter Tone)───> [Card: #121215] ──(Lighter Tone)───> [Dialog: #27272A]
```

### Contrast Ratio Guardrails (WCAG 2.1)
- **Normal Text (< 18px)**: Minimum **4.5:1** contrast against surface background.
- **Large Text (≥ 18px / 14px bold)**: Minimum **3.0:1** contrast.
- **UI Components & Active Borders**: Minimum **3.0:1** against adjacent surfaces.
- **Disabled Elements**: Exempt, but should maintain at least 1.5:1 to remain legible.

---

## 3. Density Modes for Enterprise Contexts

Dashboards serve different operator profiles. Use standard density tokens:

| Density Mode | Control Height | Table Row Height | Content Padding | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **Compact** | `32px` | `36px` | `8px` / `12px` | Financial trading, NOC monitoring, database management |
| **Default** | `36px` | `48px` | `16px` / `24px` | Standard SaaS admin, CRM, inventory dashboards |
| **Loose** | `40px` | `56px` | `24px` / `32px` | Executive summaries, onboarding flows, tablet touch targets |

### Switching Density via CSS
```css
/* Apply compact density to specific table or dashboard panel */
.dashboard-density-compact {
  --control-height: 32px;
  --font-size-sm: 13px;
  --table-padding-y: 0.5rem;
}
```

---

## 4. Accessibility & Focus Trap Management

### Modal & Dialog Rules
1. **Focus Trap**: When a modal or drawer opens, focus must be trapped within its DOM sub-tree. Tabbing from the last interactive element must loop to the first.
2. **Escape Key Dismissal**: Pressing the `Escape` key must close the topmost active dialog or drawer.
3. **Restoring Focus**: Upon modal closure, focus must return to the trigger element that opened it.
4. **Body Scroll Lock**: Prevent the background window from scrolling when an overlay is open (`overflow: hidden` on `<body>`).

### Form Field Validation
- Always link error messages to their input via `aria-describedby="[error-id]"`.
- Set `aria-invalid="true"` when validation fails.
- Never rely solely on color to indicate errors; always include explanatory text or an error icon.

---

## 5. Performance Guardrails for Data-Dense Views

1. **DOM Node Budget**: Keep total rendered DOM nodes below **1,500** per page view to prevent scroll jitter and high memory usage.
2. **Table Virtualization**: For tables exceeding **100 rows**, implement virtualized windowing (rendering only visible viewport rows plus an overscan buffer).
3. **Filter Debouncing**: Debounce text filter inputs by **250ms** before triggering server queries or complex array filtering.
4. **Tabular Figures**: Always apply `font-variant-numeric: tabular-nums` to numbers, currencies, and timestamps in data tables to prevent layout shift during live data updates.
