# Popconfirm

> Category: **Feedback**  
> Identifier: `popconfirm`  
> Definition: Lightweight in-place confirmation card attached directly to the trigger button.

---

## 1. Overview & Intent

### When to Use
Use for row deletions or destructive item actions to avoid interrupting context with a heavy modal.

### When NOT to Use
Do not use when deleting high-risk core resources (use Modal with typed name validation). Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Popconfirm Structural Hierarchy:
├── Root: Trigger element wrapper.
├── Card: Small floating popover card.
├── Message: Title row with warning icon.
├── Buttons: OK and Cancel buttons.
```

---

## 3. Variants & Types

- **Standard arrow popover**
- **Customized OK / Cancel button text and color**

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
- **ARIA Role**: `role="alertdialog"`
- **Key Attributes**: `aria-haspopup="dialog"`, `aria-modal="true"`
- **Keyboard Navigation**: Focus moves to OK button on open; Escape cancels.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
