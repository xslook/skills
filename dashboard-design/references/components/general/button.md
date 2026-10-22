# Button

> Category: **General**  
> Identifier: `button`  
> Definition: Triggers an immediate operation upon click.

---

## 1. Overview & Intent

### When to Use
Use to initiate an action, confirm choices, navigate to links, or submit forms. Contains 5 variants: Primary (single key action), Default (standard actions), Dashed (add/insert action), Text (low priority inline actions), Link (navigation).

### When NOT to Use
Avoid using multiple primary buttons in a single operational area. Use Default or Text buttons for secondary actions. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Button Structural Hierarchy:
├── Root: Button container element controlling border, background, radius, padding, and transition.
├── Content: Text label wrapper managing whitespace, alignment, and typography.
├── Icon: Prefix or suffix icon slot.
```

---

## 3. Variants & Types

- **Primary**: Solid brand fill
- **Default**: Outlined border
- **Dashed**: Dashed border for additions
- **Text**: Borderless hoverable
- **Link**: Inline hyperlink style
- **Danger**: Destructive warning
- **Ghost**: Transparent for dark/complex backgrounds
- **Loading**: Spinning async state

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
- **Key Attributes**: `aria-disabled="true"`, `aria-busy="true"` (during loading)
- **Keyboard Navigation**: Tab to focus, Space or Enter to activate.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
