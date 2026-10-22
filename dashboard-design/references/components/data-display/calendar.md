# Calendar

> Category: **Data-display**  
> Identifier: `calendar`  
> Definition: Full-screen or card calendar displaying date-driven data.

---

## 1. Overview & Intent

### When to Use
Use for scheduling dashboards, appointment managers, or holiday overviews.

### When NOT to Use
Do not use inside compact forms for single date entry; use DatePicker instead. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Calendar Structural Hierarchy:
├── Root: Calendar table container.
├── Header: Month/year switcher and mode buttons.
├── DateCell: Day cell container for custom event items.
```

---

## 3. Variants & Types

- **Full-screen mode**: Rich event slots
- **Card mode**: Compact sidebar widget

---

## 4. Sizes & Spatial Metrics

| Density / Section | Padding / Metric | Radius / Border | Notes |
| :--- | :--- | :--- | :--- |
| **Compact Card** | `12px 16px` | `--radius-lg` (`12px`), `1px solid var(--border)` | High-density operational widgets |
| **Default Card (`.card`)** | Header `24px 24px 16px`, Content `16px 24px`, Footer `16px 24px 24px` | `--radius-lg` (`12px`), `1px solid var(--border)` | Standard dashboard container |
| **KPI Card (`.stat-card`)** | `20px 24px` (`1.25rem 1.5rem`), `14px` internal gap | `--radius-lg` (`12px`), `--shadow-xs` | 4-column metric grid item |

---

## 5. Interaction & State Contract

- **Static Container**: Rests on `--surface-1` (`#ffffff` light / `#121215` dark) with `1px solid var(--border)` and `--shadow-xs`.
- **Interactive / Hoverable Card**: Transitions shadow from `--shadow-xs` to `--shadow-sm` on `:hover` (`--duration-fast`).
- **Collapsible / Tabbed**: Smoothly toggles body visibility and updates `aria-expanded` on header triggers.

---

## 6. Design Tokens Specification

| CSS Custom Property | Light / Dark Value | Semantic Role |
| :--- | :--- | :--- |
| `--surface-1` / `--card` | `#ffffff` (`#121215` dark) | Primary container surface |
| `--border` / `--border-secondary` | `#e4e4e7` / `#f4f4f5` (`#27272a` / `#18181b` dark) | Outer frame and internal footer/section split |
| `--text-0` / `--text-1` | `#09090b` / `#71717a` | Card title (`--font-size-xl`) and description (`--font-size-sm`) |
| `--radius-lg` / `--shadow-xs` | `12px` / Level-1 shadow | Container corner radius and baseline elevation |

---

## 7. Do's, Don'ts & Accessibility

### Rules & Pitfalls
- ✅ **Do**: In dark mode, rely on `--surface-1` (`#121215`) + `1px solid var(--border)` (`#27272a`) over `--surface-0` (`#09090b`) canvas to define card boundaries.
- ✅ **Do**: Keep card header actions limited to 1–2 compact controls (`.btn-sm` or `.toggle-group`).
- ❌ **Don't**: Nest cards more than 2 levels deep; use subtle dividers (`.separator`) or background fills (`--surface-2`) inside a card instead.

### Accessibility (WCAG 2.1)
- **ARIA Role**: `role="grid"`
- **Key Attributes**: `aria-label="Full calendar"`
- **Keyboard Navigation**: Arrow keys navigate grid days; Enter selects.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
