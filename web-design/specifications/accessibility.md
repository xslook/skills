# Accessibility Specification (WCAG 2.1)

Guidelines for contrast ratios, keyboard navigation, and ARIA landmarks to ensure full accessibility compliance.

---

## 1. Contrast Ratios

- **Normal Text (14px / 16px Regular)**: Maintain at least **4.5:1** contrast ratio against backgrounds (recommended: **7:1** for AAA rating).
- **Large Text (≥ 18px Bold or ≥ 24px Regular)**: Maintain at least **3:1** contrast ratio.
- **UI Components & Borders**: Active input borders, toggle switches, and icons must meet at least **3:1** against adjacent surfaces.
- **Color Independence Rule**: Never rely solely on color to communicate state. Combine color with icons and descriptive text (e.g., error state: red border + exclamation icon + error text below).

---

## 2. Keyboard Navigation & Focus Management

- **Visible Focus Indicator**: Interactive elements must render a visible focus ring on keyboard navigation (2px/3px outline with subtle glow: `box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2)`). Never apply `outline: none` without a custom replacement.
- **Logical Tab Order**: Tab traversal must match the visual reading order (top-to-bottom, left-to-right).
- **Focus Trap**: Modals and slide-over drawers must trap focus inside the container while open. Pressing `Escape` must dismiss the overlay and return focus to the trigger element.

### Standard Keybindings

| Key | Action |
| :--- | :--- |
| `Tab` / `Shift + Tab` | Move focus forward / backward between interactive controls |
| `Enter` | Activate buttons, trigger links, confirm forms |
| `Space` | Toggle Checkbox, toggle Switch, activate Button |
| `Arrow Keys` | Navigate within lists, select menus, radio groups, tabs, and tree nodes |
| `Escape` | Dismiss active dropdown, tooltip, modal, popover, or drawer |

---

## 3. Semantic ARIA Matrix

| Component | ARIA Role & Essential Attributes |
| :--- | :--- |
| **Button** | `role="button"`, `aria-disabled="true|false"`, `aria-busy="true"` (during loading) |
| **Select / Combobox** | `role="combobox"`, `aria-expanded="true|false"`, `aria-haspopup="listbox"`, `aria-controls="list_id"` |
| **Option List** | Container: `role="listbox"`, Items: `role="option"`, `aria-selected="true|false"` |
| **Modal Dialog** | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="title_id"`, `aria-describedby="desc_id"` |
| **Tabs** | List: `role="tablist"`, Tab: `role="tab"`, Panel: `role="tabpanel"`, `aria-selected="true|false"` |
| **Form Error** | `aria-invalid="true"`, `aria-describedby="error_message_id"` |
| **Live Message** | `role="alert"`, `aria-live="polite|assertive"` |
