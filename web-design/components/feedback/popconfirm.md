# Popconfirm

> Category: **Feedback**  
> Identifier: `popconfirm`  
> Definition: Lightweight in-place confirmation card attached directly to the trigger button.

---

## 1. Overview & Intent

### Core Purpose
Lightweight in-place confirmation card attached directly to the trigger button.

### When to Use
Use for row deletions or destructive item actions to avoid interrupting context with a heavy modal.

### When NOT to Use
Do not use when deleting high-risk core resources (use Modal with typed name validation). Consult the [Component Decision Tree](../../references/component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Popconfirm Structural Hierarchy:
├── Root: Trigger element wrapper.
├── Card: Small floating popover card.
├── Message: Title row with warning icon.
├── Buttons: OK and Cancel buttons.
```

### Semantic Parts
- **Root**: Trigger element wrapper.
- **Card**: Small floating popover card.
- **Message**: Title row with warning icon.
- **Buttons**: OK and Cancel buttons.

---

## 3. Variants & Types

- **Standard arrow popover**: Standard arrow popover
- **Customized OK / Cancel button text and color**: Customized OK / Cancel button text and color

---

## 4. Sizes & Spatial Metrics

Adheres to the 4px/8px modular scale across 3 standard control tiers:

| Size Tier | Height | Font Size / Line Height | Horizontal Padding | Target Application |
| :--- | :--- | :--- | :--- | :--- |
| **Small (sm)** | `24px` | `12px / 20px` | `8px` | High-density tables, compact toolbars |
| **Middle (md / default)** | `32px` | `14px / 22px` | `12px` | **Default standard**: Common forms, dialog buttons |
| **Large (lg)** | `40px` | `16px / 24px` | `16px` | Login inputs, hero search bars, featured calls to action |

---

## 5. Interaction States Contract

All interactive variants adhere to the 8 universal states:

1. **Normal**: Resting state with standard border (`colorBorder`), neutral text (`colorText`), and white container surface (`colorBgContainer`).
2. **Hover**: Cursor changes to `pointer`; border/background lightens one step to `colorPrimaryHover`.
3. **Active / Pressed**: Darkened one step to `colorPrimaryActive`; subtle physical compression or wave ripple feedback.
4. **Focus**: 2px/3px focus outline ring (`controlOutline`) in semi-transparent primary color. Never remove without replacement.
5. **Selected / Checked**: Background or text switches to `colorPrimary` with checkmark or slider indicator.
6. **Disabled**: Background switches to `colorBgContainerDisabled`, text opacity reduces to 25% (`colorTextDisabled`), cursor `not-allowed`, all click events blocked.
7. **Loading**: In-flight async state; dimensions preserved; embedded spinner active; duplicate clicks blocked.
8. **Error / Warning**: Border switches to `colorError` (`#ff4d4f`) or `colorWarning` (`#faad14`); focus ring matches border tint.

---

## 6. Layout, Alignment & Grouping

- **Spacing**: Maintain `8px` (compact) or `12px` (standard) gap between sibling elements horizontally; `16px` vertically.
- **Alignment**: Vertically center icons with text line-height baselines.
- **Responsive Stacking**: On viewports `< 576px` (xs), stack horizontal groups to `100%` full-width vertical arrangements.

---

## 7. Design Tokens Specification

| Token Name | Default Value / Mapping | Semantic Role |
| :--- | :--- | :--- |
| `colorPrimary` | `#1677ff` | Active state and primary interactive accent |
| `colorBgContainer` | `#ffffff` | Component container surface |
| `colorBorder` | `#d9d9d9` | Component boundary border |
| `borderRadius` | `6px` | Outer border radius |
| `controlHeight` | `32px` | Base interactive height tier |

---

## 8. Do's, Don'ts & Accessibility

### Rules & Pitfalls
- ✅ **Do**: Keep action labels short, imperative, and verb-first.
- ❌ **Don't**: Place multiple high-contrast primary actions in the same view.
- ✅ **Do**: Maintain loading indicators during asynchronous network requests.
- ❌ **Don't**: Remove visible focus indicators (`outline: none`) without custom focus ring replacements.

### Accessibility (WCAG 2.1)
- **ARIA Role**: `role="alertdialog"`
- **Key Attributes**: `aria-haspopup="dialog"`, `aria-modal="true"`
- **Keyboard Navigation**: Focus moves to OK button on open; Escape cancels.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
