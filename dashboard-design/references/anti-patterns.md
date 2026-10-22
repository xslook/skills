# Design Anti-Patterns & Common Pitfalls

High-frequency design mistakes in enterprise dashboards and how to avoid them.

---

## 1. Visual & Styling Anti-Patterns

### ❌ Anti-Pattern 1: Multiple Primary Buttons in One View
- **Violation**: Placing two or more solid primary buttons (`.btn-primary`) in the same modal footer, card header, or action toolbar.
- **Rule**: Single primary action rule. Only one `.btn-primary` button per operational area. Secondary actions must use `.btn-outline`, `.btn-secondary`, or `.btn-ghost`.

### ❌ Anti-Pattern 2: Removing Focus Rings (`outline: none`)
- **Violation**: Global CSS `*:focus { outline: none; }` without a `:focus-visible` replacement.
- **Rule**: Accessibility failure. Always provide a visible 2px focus outline (`outline: 2px solid var(--ring); outline-offset: 2px;`).

### ❌ Anti-Pattern 3: Arbitrary Off-Grid Pixel Values
- **Violation**: Hardcoding `padding: 7px`, `margin: 11px`, or `height: 35px`.
- **Rule**: Adhere to the `4px`/`8px` spatial grid (`--spacing-1` to `--spacing-12`), standard control heights (`24px`, `32px`, `36px`, `40px`), and the mathematical type scale (`12px`, `14px`, `16px`, `18px`, `20px`, `24px`, `30px`, `36px`).

### ❌ Anti-Pattern 4: Relying Only on Drop Shadows in Dark Mode
- **Violation**: Rendering dark cards (`#09090b`) on a dark canvas (`#09090b`) with only `box-shadow` to separate them.
- **Rule**: Drop shadows vanish against dark backgrounds. Differentiate elevation in dark mode using progressive surface lightening (`--surface-0: #09090b` canvas → `--surface-1: #121215` card → `--surface-2: #1c1c20` header/hover → `--surface-3: #242429` popover → `--surface-4: #2a2a30` modal) plus `1px solid var(--border)`.

---

## 2. Layout Anti-Patterns

### ❌ Anti-Pattern 5: Unconstrained Full-Width Forms
- **Violation**: Stretching single-column input forms across `1440px` or `1920px` monitors.
- **Rule**: Enforce `max-width: 600px` to `640px` for single-column forms, or organize large forms into multi-column card sections on the 24-column grid.

### ❌ Anti-Pattern 6: Unpaginated Large Data Tables
- **Violation**: Rendering thousands of table rows directly into the DOM without pagination or virtualization.
- **Rule**: Keep DOM node count below `1,500`. Use pagination (`10` / `20` / `50` rows per page) or virtualized viewport rendering ([`Listy`](./components/data-display/listy.md)) for datasets exceeding `100` rows.

### ❌ Anti-Pattern 7: Proportional Numerals in Data Columns
- **Violation**: Rendering currency, latency metrics, or counters in standard proportional glyphs where `1` is narrower than `8`.
- **Rule**: Always apply `font-variant-numeric: tabular-nums` and `text-align: right` to numeric columns and live KPI metrics.

---

## 3. Interaction Anti-Patterns

### ❌ Anti-Pattern 8: Modal Dialog Stacking
- **Violation**: Opening a second modal dialog on top of an already open modal dialog.
- **Rule**: Never exceed one modal layer. Use a slide-over [`Drawer`](./components/feedback/drawer.md) for parent context or an inline [`Popconfirm`](./components/feedback/popconfirm.md) for lightweight confirmations.

### ❌ Anti-Pattern 9: Premature Input Validation
- **Violation**: Flashing red error borders and messages on the very first keystroke while the user is still typing.
- **Rule**: Trigger format validation on `blur` (`change`). Only re-validate on every `input` keystroke *after* an error has already been displayed for that field so the error clears immediately once fixed.

### ❌ Anti-Pattern 10: Unconfirmed Destructive Actions
- **Violation**: Executing record deletions or cluster resets immediately upon a single click.
- **Rule**: Attach an inline [`Popconfirm`](./components/feedback/popconfirm.md) for single-row deletions, and require a blocking [`Modal`](./components/feedback/modal.md) (with resource-name typing confirmation for high-blast-radius actions) for bulk or irreversible deletions.
