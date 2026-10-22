# Radio

> Category: **Data-entry**  
> Identifier: `radio`  
> Definition: Single-select control among mutually exclusive choices.

---

## 1. Overview & Intent

### When to Use
Use when choosing 1 item from 2 to 6 visible options that need immediate comparison.

### When NOT to Use
Do not use when options exceed 7 items; use Select instead. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Radio Structural Hierarchy:
├── Root: Label wrapper.
├── Input: Native radio button.
├── Inner: Styled circle with animated center dot.
├── Text: Option label.
```

---

## 3. Variants & Types

- **Radio button**: Circular dot
- **Radio.Group**: Button-tab style
- **Solid fill vs. Outlined button**

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
- **ARIA Role**: `role="radio"`
- **Key Attributes**: Group `role="radiogroup"`, Item `aria-checked="true|false"`
- **Keyboard Navigation**: Tab focuses into radio group; Arrow keys navigate and immediately activate radio item.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
