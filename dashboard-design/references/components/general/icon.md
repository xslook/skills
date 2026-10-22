# Icon

> Category: **General**  
> Identifier: `icon`  
> Definition: Semantic vector icon providing visual affordance and cognitive cues.

---

## 1. Overview & Intent

### When to Use
Use to reinforce button meaning, represent status, indicate directional cues, or reduce cognitive scanning time.

### When NOT to Use
Do not use purely decorative icons that provide no semantic value or confuse standard conventions. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Icon Structural Hierarchy:
├── Root: Inline SVG wrapper with currentColor fill and vertical baseline alignment.
├── Spin: Rotation animation modifier for async loading.
```

---

## 3. Variants & Types

- **Outlined**: Standard linear style
- **Filled**: High visual weight solid
- **TwoTone**: Primary + secondary fill

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
- **ARIA Role**: `role="img"` or `aria-hidden="true"`
- **Key Attributes**: `aria-label="Action description"`
- **Keyboard Navigation**: Decorative icons hidden; actionable icons support Tab and Enter.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
