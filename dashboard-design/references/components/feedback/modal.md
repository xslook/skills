# Modal

> Category: **Feedback**  
> Identifier: `modal`  
> Definition: Centered dialog overlay requiring user attention or confirmation.

---

## 1. Overview & Intent

### When to Use
Use for critical blocking tasks, irreversible confirmations, or self-contained forms.

### When NOT to Use
Do not open a modal from inside another modal. Do not use for simple row deletions; use Popconfirm. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Modal Structural Hierarchy:
├── Mask: Fullscreen dark backdrop (`rgba(0,0,0,0.45)`).
├── Wrap: Centered flex positioning container.
├── Content: Elevated white dialog box.
├── Header: Title.
├── Body: Content slot.
├── Footer: Cancel and Confirm action buttons.
```

---

## 3. Variants & Types

- **Standard form modal**: 520px
- **Confirmation dialog**: Modal.confirm
- **Custom full-screen modal**

---

## 4. Sizes & Spatial Metrics

| Tier / Variant | Width / Dimension | Padding | Target Context |
| :--- | :--- | :--- | :--- |
| **Compact / Confirm (`sm`)** | `max-width: 400px` (`25rem`) | `20px` (`1.25rem`) | Destructive confirmations, simple prompts |
| **Standard Dialog (`md`)** | `max-width: 512px` (`32rem`) | `24px` (`1.5rem`) | Standard entity creation/edit forms (`.dialog-content`) |
| **Wide / Detail Drawer (`lg`)** | `440px`–`640px` (Drawer) / `720px` (Modal) | `24px` (`1.5rem`) | Multi-column forms, record inspection, audit logs |

---

## 5. Interaction & State Contract

- **Open Entry**: Backdrop (`.dialog-overlay`) fades in (`rgba(0,0,0,0.8)` + `backdrop-filter: blur(4px)`); panel scales/slides in over `200ms` (`--duration-normal`, `--ease-out`).
- **Focus Trap**: Locks `<body>` scroll, moves initial focus inside the container, and traps `Tab` / `Shift+Tab` traversal.
- **Dismissal**: Closes on `Escape` key or backdrop click (unless destructive/dirty form) and restores focus to the trigger element.

---

## 6. Design Tokens Specification

| CSS Custom Property | Light / Dark Value | Semantic Role |
| :--- | :--- | :--- |
| `--surface-4` / `--background` | `#ffffff` (`#2a2a30` dark) | Highest-elevation overlay dialog/drawer surface |
| `--border` | `#e4e4e7` (`#27272a` dark) | Dialog perimeter and drawer edge border |
| `--shadow-lg` / `--shadow-xl` | Level-3 layered shadow | Modal and slide-over drawer elevation |
| `--radius-lg` | `12px` (`0px` on docked drawer edge) | Dialog corner radius |

---

## 7. Do's, Don'ts & Accessibility

### Rules & Pitfalls
- ✅ **Do**: Place the primary confirmation button on the bottom-right of `.dialog-footer` paired with an outline `Cancel` button.
- ✅ **Do**: Use a slide-over `Drawer` instead of a `Modal` when the operator needs to reference underlying table/page context.
- ❌ **Don't**: Stack a modal on top of another modal (Modal-on-Modal anti-pattern).

### Accessibility (WCAG 2.1)
- **ARIA Role**: `role="dialog"`
- **Key Attributes**: `aria-modal="true"`, `aria-labelledby="modal_title_id"`
- **Keyboard Navigation**: Focus moves to first interactive item; focus trapped inside; Escape dismisses.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
