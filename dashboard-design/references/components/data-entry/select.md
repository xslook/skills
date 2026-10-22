# Select

> Category: **Data-entry**  
> Identifier: `select`  
> Definition: Dropdown selector for picking from predefined options.

---

## 1. Overview & Intent

### When to Use
Use when options exceed 6 items, or when search filtering is required.

### When NOT to Use
Do not use when options have deep tree hierarchies; use TreeSelect or Cascader instead. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Select Structural Hierarchy:
├── Root: Control box with selection value.
├── Clear: Reset icon.
├── Arrow: Dropdown indicator chevron.
├── Popup: Floating list overlay with virtualized scrolling.
```

---

## 3. Variants & Types

- **Single select**
- **Multiple select**: With tag badges
- **Tags mode**: Allows creating new tags
- **Searchable**

---

## 4. Sizes & Spatial Metrics

| Element | Metric / Token | Value | Notes |
| :--- | :--- | :--- | :--- |
| **Trigger Height** | `--control-height-sm` / `--control-height` / `--control-height-lg` | `32px` / `36px` / `40px` | Matches adjacent `.input` and `.btn` controls |
| **Popup Surface** | `--surface-3` + `--shadow-md` | `min-width: trigger width` | `4px` vertical offset from trigger; `--radius-md` (`8px`) |
| **Option Row Height** | Compact / Default | `28px` / `32px` | `6px 8px` inner padding; `--radius-sm` (`4px`) hover highlight |
| **Popup Max Height** | Scrollable viewport | `256px`–`320px` | `overflow-y: auto` with keyboard scroll-into-view |

---

## 5. Interaction & State Contract

Follows [Components Overview](../overview.md#2-universal-interaction-states-contract):
- **Closed / Open**: Trigger sets `aria-expanded="true|false"`; popup enters in `150ms` (`--duration-fast`, `--ease-out`).
- **Option Hover / Keyboard Active**: Highlights option row with `--accent` (`--surface-2`).
- **Selected Option**: Displays checkmark indicator and `font-weight: 500` (`aria-selected="true"`).

---

## 6. Design Tokens Specification

| CSS Custom Property | Light / Dark Value | Semantic Role |
| :--- | :--- | :--- |
| `--surface-3` / `--popover` | `#ffffff` (`#242429` dark) | Floating dropdown / picker panel surface |
| `--border` | `#e4e4e7` (`#27272a` dark) | Trigger and floating panel border |
| `--accent` / `--surface-2` | `#f4f4f5` (`#1c1c20` dark) | Hovered or keyboard-highlighted option background |
| `--shadow-md` | Layered Level-2 shadow | Floating panel elevation |
| `--radius-md` / `--radius-sm` | `8px` / `4px` | Outer panel radius and inner option item radius |

---

## 7. Do's, Don'ts & Accessibility

### Rules & Pitfalls
- ✅ **Do**: Portal or position floating panels outside `overflow: hidden` parent cards so dropdowns are never clipped.
- ✅ **Do**: Enable type-ahead search filtering whenever option lists exceed 7 items.
- ❌ **Don't**: Use dropdowns for fewer than 4 mutually exclusive options when space permits inline `Radio` or `Segmented` controls.
- ❌ **Don't**: Close multi-select popups after every single item click; keep the menu open until the user clicks outside or presses `Escape`.

### Accessibility (WCAG 2.1)
- **ARIA Role**: `role="combobox"`
- **Key Attributes**: `aria-expanded="true|false"`, `aria-controls="list_id"`
- **Keyboard Navigation**: Tab focuses; Enter or Down arrow opens list; Arrow keys traverse; Enter selects; Escape closes.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
