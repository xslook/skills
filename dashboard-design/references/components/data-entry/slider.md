# Slider

> Category: **Data-entry**  
> Identifier: `slider`  
> Definition: Draggable slider track for selecting numerical values or ranges.

---

## 1. Overview & Intent

### When to Use
Use when the input value is continuous, approximate, and best visualized along a scale (e.g., volume, price range).

### When NOT to Use
Do not use when high numerical precision is required without an accompanying InputNumber. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Slider Structural Hierarchy:
├── Root: Track container.
├── Rail: Inactive background track.
├── Track: Active colored bar.
├── Handle: Draggable circular knob with tooltip.
```

---

## 3. Variants & Types

- **Single Handle**
- **Range Slider**: Dual handles for min/max
- **Step Marks**: Discrete ticks

---

## 4. Sizes & Spatial Metrics

| Element | Metric / Token | Value | Notes |
| :--- | :--- | :--- | :--- |
| **Checkbox / Radio Box** | Control indicator | `16px × 16px` | `4px` radius (`--radius-sm`) for Checkbox; `9999px` for Radio |
| **Switch Track** | Default / Small | `36px × 20px` / `28px × 16px` | `2px` inner thumb inset; `9999px` pill radius |
| **Label Gap & Hit Area** | `--spacing-2` | `8px` gap, `min-height: 32px` | Include label text inside `<label>` click target |

---

## 5. Interaction & State Contract

Follows [Components Overview](../overview.md#2-universal-interaction-states-contract):
- **Unchecked**: `--surface-1` background with `1px solid var(--input)` border (or `--secondary` track for Switch).
- **Checked / Indeterminate**: Solid `--primary` fill with `--primary-foreground` indicator (`aria-checked="true|mixed"`).
- **Focus**: `2px solid var(--ring)` with `2px` offset on `:focus-visible`.

---

## 6. Design Tokens Specification

| CSS Custom Property | Light / Dark Value | Semantic Role |
| :--- | :--- | :--- |
| `--primary` / `--primary-foreground` | `#18181b` (`#fafafa` dark) | Checked fill and checkmark/thumb contrast |
| `--input` / `--secondary` | `#e4e4e7` / `#f4f4f5` | Unchecked border and inactive switch track |
| `--ring` | `#18181b` (`#fafafa` dark) | Keyboard `:focus-visible` ring |
| `--text-3` | `#d4d4d8` (`#52525b` dark) | Disabled state indicator |

---

## 7. Do's, Don'ts & Accessibility

### Rules & Pitfalls
- ✅ **Do**: Bind the `<label>` element directly to the control so clicking the text label toggles the state.
- ✅ **Do**: Use `Switch` for immediate live state changes (e.g., enabling a webhook) and `Checkbox` when changes require a form `Submit` button.
- ❌ **Don't**: Stack more than 5 inline horizontal checkboxes/radios on a single row; switch to a vertical list (`8px` gap) for scanability.

### Accessibility (WCAG 2.1)
- **ARIA Role**: `role="slider"`
- **Key Attributes**: `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-orientation`
- **Keyboard Navigation**: Tab focuses handle; Left/Down decreases, Right/Up increases; Home/End jumps to bounds.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
