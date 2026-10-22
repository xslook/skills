# Accessibility Specification (WCAG 2.1)

Guidelines for contrast ratios, keyboard navigation, focus management, and ARIA landmarks across all dashboard views.

---

## 1. Contrast Ratios

- **Normal Text (`14px` / `16px` Regular)**: Maintain at least **4.5:1** contrast ratio against surface backgrounds (recommended: **7:1** for primary metrics).
- **Large Text (`≥ 18px` Bold or `≥ 24px` Regular)**: Maintain at least **3.0:1** contrast ratio.
- **UI Components & Active Borders**: Input borders (`--input`), focus rings (`--ring`), toggle switches, and functional icons must meet at least **3.0:1** against adjacent surfaces (or pair with a high-contrast label/hover state).
- **Color Independence Rule**: Never rely solely on color to communicate status. Always combine color tokens with semantic icons (`●`, `▲`, `▼`, `✕`, `!`) and descriptive text labels.

---

## 2. Keyboard Navigation & Focus Management

- **Visible Focus Indicator**: Every interactive element must display an unmistakable focus ring on `:focus-visible`:
  ```css
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  ```
  Never apply `outline: none` without providing a high-contrast `:focus-visible` ring.
- **Logical Tab Order**: DOM order and `Tab` traversal must match the visual reading order (top-to-bottom, left-to-right). Avoid positive `tabindex` values (`tabindex="1"`).
- **Focus Trap & Restoration**: Modals (`role="dialog"`) and slide-over Drawers must trap `Tab` / `Shift+Tab` inside the active container while open. Pressing `Escape` must dismiss the topmost overlay and return focus to the trigger button.

### Standard Keybindings

| Key | Action |
| :--- | :--- |
| `Tab` / `Shift + Tab` | Move focus forward / backward between interactive controls |
| `Enter` | Activate buttons, follow links, submit forms, trigger column sort |
| `Space` | Toggle Checkbox, toggle Switch, activate focused Button |
| `Arrow Keys` | Navigate within Select menus, Radio groups, Tabs, Segmented controls, Calendar grids, and Tree nodes |
| `Home` / `End` | Jump to first / last option in a list, menu, tab strip, or slider |
| `Escape` | Dismiss active Dropdown, Tooltip, Popover, Popconfirm, Modal, or Drawer |

---

## 3. Semantic ARIA Matrix

| Component | ARIA Role & Essential Attributes |
| :--- | :--- |
| **Button** | `<button>` or `role="button"`, `aria-disabled="true"`, `aria-busy="true"` (during async loading) |
| **Select / Combobox** | `role="combobox"`, `aria-expanded="true|false"`, `aria-haspopup="listbox"`, `aria-controls="list_id"` |
| **Option List** | Container: `role="listbox"`, Items: `role="option"`, `aria-selected="true|false"` |
| **Modal / Drawer** | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="title_id"`, `aria-describedby="desc_id"` |
| **Tabs** | List: `role="tablist"`, Tab: `role="tab"`, Panel: `role="tabpanel"`, `aria-selected="true|false"` |
| **Data Table** | `<table>`, sortable `<th aria-sort="ascending|descending|none">`, row checkboxes with `aria-label` |
| **Form Error** | `aria-invalid="true"` on input, `aria-describedby="error_message_id"` linking to error element |
| **Live Feedback** | `role="status"` (`aria-live="polite"`) for toasts/metrics; `role="alert"` (`aria-live="assertive"`) for critical errors |
