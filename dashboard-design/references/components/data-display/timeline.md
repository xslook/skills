# Timeline

> Category: **Data-display**  
> Identifier: `timeline`  
> Definition: Chronological event sequence display.

---

## 1. Overview & Intent

### When to Use
Use for audit trails, logistics tracking, release histories, and operational logs.

### When NOT to Use
Do not use for future step-by-step wizards; use Steps instead. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Timeline Structural Hierarchy:
├── Root: Timeline list container.
├── Item: Event row.
├── Line: Vertical connecting track.
├── Dot: Node circle or icon.
├── Content: Event text and timestamp.
```

---

## 3. Variants & Types

- **Standard left-aligned**
- **Alternate sides**
- **Custom node icons**: Colors, spinners

---

## 4. Sizes & Spatial Metrics

| Density Mode | Header Height | Body Row Height | Cell Padding (Y × X) | Target Context |
| :--- | :--- | :--- | :--- | :--- |
| **Compact (`.table-sm`)** | `36px` (`2.25rem`) | `36px` | `8px × 12px` | High-density NOC, trading, and log consoles |
| **Default (`.table`)** | `44px` (`2.75rem`) | `48px` | `12px × 16px` | Standard SaaS admin and resource tables |
| **Loose** | `48px` (`3.0rem`) | `56px` | `16px × 20px` | Executive summaries and touch-heavy lists |

---

## 5. Interaction & State Contract

- **Row Hover**: Transitions row background to `--muted` (`--surface-2`) over `150ms`.
- **Row Selected**: Applies subtle tinted background (`--surface-2`) and sets `aria-selected="true"`.
- **Loading / Empty**: Renders inline `Skeleton` rows during fetch and a centered `Empty` state when 0 records match filters.

---

## 6. Design Tokens Specification

| CSS Custom Property | Light / Dark Value | Semantic Role |
| :--- | :--- | :--- |
| `--surface-1` / `--card` | `#ffffff` (`#121215` dark) | Table body surface |
| `--surface-2` / `--muted` | `#f4f4f5` (`#1c1c20` dark) | Sticky header fill and row hover highlight |
| `--border` | `#e4e4e7` (`#27272a` dark) | Outer container border and row hairline dividers |
| `--muted-foreground` / `--text-1` | `#71717a` (`#a1a1aa` dark) | Column header text (`font-weight: 500`) |
| `--radius-md` | `8px` | `.table-container` outer border radius |

---

## 7. Do's, Don'ts & Accessibility

### Rules & Pitfalls
- ✅ **Do**: Wrap tables in `.table-container` (`overflow-x: auto`) and right-align all numeric/currency columns with `font-variant-numeric: tabular-nums`.
- ✅ **Do**: Render missing cell values as a muted en-dash (`—`) using `--text-2`—never `null`, `undefined`, or `NaN`.
- ❌ **Don't**: Render more than 100 unpaginated rows in the DOM without viewport virtualization (`Listy`).

### Accessibility (WCAG 2.1)
- **ARIA Role**: `role="list"`
- **Key Attributes**: `aria-label="Timeline log"`
- **Keyboard Navigation**: Sequential items read in natural order.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
