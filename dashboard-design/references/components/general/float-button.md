# FloatButton

> Category: **General**  
> Identifier: `float-button`  
> Definition: Floating action button pinned to the screen for global or page-level shortcuts.

---

## 1. Overview & Intent

### When to Use
Use for quick persistent shortcuts across tall pages (e.g., Back-to-Top, Customer Support, Quick Create).

### When NOT to Use
Do not place in views where it obscures critical table cells or footer action bars. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
FloatButton Structural Hierarchy:
├── Root: Fixed-position circular container with elevated shadow.
├── Icon: Action icon.
├── Badge: Numeric counter badge attached to button.
├── Menu: Expandable sub-button popover list.
```

---

## 3. Variants & Types

- **Default**: Circular floating icon
- **Primary**: Solid brand fill
- **Group**: Expandable floating menu
- **BackTop**: Scrolls to top on click

---

## 4. Sizes & Spatial Metrics

| Tier | CSS Token / Class | Height | Font Size | Horizontal Padding | Target Context |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Extra-Small (xs)** | `--control-height-xs` | `24px` | `12px` | `8px` (`0.5rem`) | Inline table cell action chips |
| **Small (sm)** | `.btn-sm` (`--control-height-sm`) | `32px` | `12px` | `12px` (`0.75rem`) | Compact toolbars, filter bars, card header actions |
| **Default (md)** | `.btn` (`--control-height`) | `36px` | `14px` | `16px` (`1rem`) | Standard form actions, dialog footer buttons |
| **Large (lg)** | `.btn-lg` (`--control-height-lg`) | `40px` | `16px` | `24px` (`1.5rem`) | Login screens, primary hero CTAs, touch targets |

---

## 5. Interaction & State Contract

Follows the universal 8-state interaction contract in [Components Overview](../overview.md#2-universal-interaction-states-contract):
- **Hover / Active**: `.btn-primary` transitions from `--primary` to `--primary-hover` and `--primary-active`; `.btn-outline` and `.btn-ghost` apply `--accent` background.
- **Focus**: Displays `outline: 2px solid var(--ring); outline-offset: 2px` on `:focus-visible`.
- **Loading / Disabled**: Sets `aria-busy="true"` or `disabled`, locks pointer events, and preserves button width to prevent layout shift.

---

## 6. Design Tokens Specification

| CSS Custom Property | Light / Dark Value | Semantic Role |
| :--- | :--- | :--- |
| `--primary` / `--primary-foreground` | `#18181b` (`#fafafa` dark) | Solid primary button fill and label |
| `--primary-hover` / `--primary-active` | `#27272a` / `#09090b` | Primary hover and pressed states |
| `--secondary` / `--secondary-foreground` | `#f4f4f5` (`#27272a` dark) | Secondary button fill and label |
| `--destructive` / `--destructive-foreground` | `#ef4444` (`#7f1d1d` dark) | Destructive button fill and label |
| `--border` / `--accent` | `#e4e4e7` / `#f4f4f5` | Outline border and ghost/outline hover fill |
| `--control-height` / `--radius` | `36px` / `6px` | Default button height and corner radius |

---

## 7. Do's, Don'ts & Accessibility

### Rules & Pitfalls
- ✅ **Do**: Limit solid `.btn-primary` buttons to **at most one** per operational view, toolbar, or modal footer.
- ✅ **Do**: Keep button labels concise (1–3 words), imperative, and verb-first (e.g., `Create Cluster`, `Export CSV`).
- ❌ **Don't**: Trigger irreversible destructive actions immediately on click without a `Popconfirm` or `Modal` confirmation.
- ❌ **Don't**: Icon-only buttons (`.btn-icon`) without an explicit `aria-label` and `Tooltip`.

### Accessibility (WCAG 2.1)
- **ARIA Role**: `role="button"`
- **Key Attributes**: `aria-label="Back to top"` or action name
- **Keyboard Navigation**: Tab to focus, Enter or Space to activate.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
