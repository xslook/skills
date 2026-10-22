# Notification

> Category: **Feedback**  
> Identifier: `notification`  
> Definition: Corner notification card with title, description, and action links.

---

## 1. Overview & Intent

### When to Use
Use for asynchronous system broadcasts, background job completion notices, or multi-line alerts.

### When NOT to Use
Do not use for immediate inline feedback on simple user actions; use Message instead. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Notification Structural Hierarchy:
├── Root: Fixed corner stack container.
├── Card: Elevated notification card.
├── Icon: Status icon.
├── Title: Headline.
├── Desc: Multiline text.
├── CloseBtn: Dismiss icon.
```

---

## 3. Variants & Types

- **TopRight**: Default
- **TopLeft / BottomRight / BottomLeft**
- **Status types**: Success, Info, Warning, Error

---

## 4. Sizes & Spatial Metrics

| Component Variant | Dimensions / Padding | Placement | Auto-Dismiss |
| :--- | :--- | :--- | :--- |
| **In-Page Alert (`.alert`)** | `width: 100%`, `padding: 16px` (`1rem`), `gap: 12px` | Inline within page or form container | Persistent until resolved or closed |
| **Toast Message** | `max-width: 420px`, `padding: 10px 16px` | Top-center viewport (`24px` offset) | `3s` (`5s` for warnings; manual for errors) |
| **Corner Notification** | `width: 380px`, `padding: 16px` | Top-right or Bottom-right (`24px` offset) | `4.5s` (pauses timer on pointer `:hover`) |

---

## 5. Interaction & State Contract

- **Semantic Status Binding**: Binds icon, border, and background to `--info-*`, `--success-*`, `--warning-*`, or `--destructive`.
- **Live Announcement**: Polite updates use `role="status"` (`aria-live="polite"`); critical errors use `role="alert"` (`aria-live="assertive"`).

---

## 6. Design Tokens Specification

| CSS Custom Property | Light / Dark Value | Semantic Role |
| :--- | :--- | :--- |
| `--info` / `--info-bg` / `--info-border` | `#2563eb` / `#eff6ff` / `#bfdbfe` | Informational notice styling |
| `--success` / `--success-bg` / `--success-border` | `#16a34a` / `#f0fdf4` / `#bbf7d0` | Positive completion notice styling |
| `--warning` / `--warning-bg` / `--warning-border` | `#f59e0b` / `#fffbeb` / `#fde68a` | Caution notice styling |
| `--destructive` | `#ef4444` (`#7f1d1d` dark) | Error and critical failure notice styling |
| `--radius-md` / `--shadow-md` | `8px` / Level-2 shadow | Container radius and floating toast elevation |

---

## 7. Do's, Don'ts & Accessibility

### Rules & Pitfalls
- ✅ **Do**: Combine status color tokens with an explicit icon and actionable recovery copy (never rely on color alone).
- ✅ **Do**: Pause auto-dismiss timers whenever the user hovers or focuses inside a floating toast/notification.
- ❌ **Don't**: Auto-dismiss critical error notifications before the user can read or copy the error details.

### Accessibility (WCAG 2.1)
- **ARIA Role**: `role="alert"`
- **Key Attributes**: `aria-live="polite"`
- **Keyboard Navigation**: Announced by screen reader; Close button accepts Tab and Enter.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
