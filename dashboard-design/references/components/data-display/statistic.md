# Statistic

> Category: **Data-display**  
> Identifier: `statistic`  
> Definition: Prominent numeric metric display with prefixes, suffixes, and trends.

---

## 1. Overview & Intent

### When to Use
Use in top-level dashboard overview cards for core KPIs (revenue, active users, growth rate).

### When NOT to Use
Do not use inside regular paragraphs or standard table cells. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Statistic Structural Hierarchy:
├── Root: Metric container.
├── Title: Small top caption.
├── Content: Large bold number with prefix and suffix slots.
```

---

## 3. Variants & Types

- **Standard KPI**
- **Countdown timer**
- **With trend arrow**: Up green, down red

---

## 4. Sizes & Spatial Metrics

| Component / Element | Dimensions / Typography | Padding / Radius | Target Context |
| :--- | :--- | :--- | :--- |
| **Badge / Pill (`.badge`)** | `font-size: 12px` (`--font-size-xs`), `font-weight: 600` | `2px 10px` (`0.125rem 0.625rem`), `--radius-full` | Status pills, category markers, trend deltas |
| **Tag Chip** | Height `22px`–`24px` (`--control-height-xs`), `12px` font | `0 8px`, `--radius-sm` (`4px`) | Filter chips, closable resource tags |
| **Statistic Value (`.stat-card-title`)** | `font-size: 24px`–`36px`, `font-weight: 700`, `tabular-nums` | `line-height: 1.15` | KPI metric counters and trend summaries |

---

## 5. Interaction & State Contract

- **Static Display**: Non-interactive by default; uses high-contrast semantic fills (`--primary`, `--secondary`, `--success`, `--destructive`) or `1px solid var(--border)` outline.
- **Interactive / Closable / Checkable**: When checkable or closable, supports `:hover` opacity/fill transitions and `:focus-visible` (`2px solid var(--ring)`).

---

## 6. Design Tokens Specification

| CSS Custom Property | Light / Dark Value | Semantic Role |
| :--- | :--- | :--- |
| `--primary` / `--secondary` | `#18181b` / `#f4f4f5` | Default and secondary badge fills |
| `--success` / `--warning` / `--destructive` | `#16a34a` / `#f59e0b` / `#ef4444` | Semantic status indicator colors |
| `--text-0` / `--muted-foreground` | `#09090b` / `#71717a` | Primary metric digits and secondary labels |
| `--radius-full` / `--radius-sm` | `9999px` / `4px` | Capsule badge radius and rectangular tag radius |

---

## 7. Do's, Don'ts & Accessibility

### Rules & Pitfalls
- ✅ **Do**: Pair status badge colors with a leading status glyph (`●`, `▲`, `▼`) or clear text label for color-blind accessibility.
- ✅ **Do**: Apply `font-variant-numeric: tabular-nums` to all numeric badges, counters, and KPI statistics.
- ❌ **Don't**: Overuse bright solid red/green badges on every column of a table; use subtle outline or dot badges for high-frequency rows.

### Accessibility (WCAG 2.1)
- **ARIA Role**: `role="status"`
- **Key Attributes**: `aria-live="polite"`
- **Keyboard Navigation**: Dynamic counter updates announced to screen readers.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
