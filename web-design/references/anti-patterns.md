# Design Anti-Patterns & Common Pitfalls

High-frequency design mistakes and how to avoid them.

---

## 1. Visual & Styling Anti-Patterns

### ❌ Anti-Pattern 1: Multiple Primary Buttons in One View
- **Violation**: Placing two or more solid blue primary buttons in the same modal footer or toolbar.
- **Rule**: Single primary action rule. Only one primary button per view. Secondary actions must use default outline, dashed, or text variants.

### ❌ Anti-Pattern 2: Removing Focus Rings (`outline: none`)
- **Violation**: Global CSS `*:focus { outline: none; }` without replacement.
- **Rule**: Accessibility failure. Always provide a visible 2px/3px focus outline (`controlOutline`).

### ❌ Anti-Pattern 3: Arbitrary Odd Pixel Values
- **Violation**: Hardcoding `font-size: 13px`, `padding: 7px`, or `margin: 11px`.
- **Rule**: Adhere to the 8px/4px spatial grid and standard type scale (12, 14, 16, 20, 24, 30, 38px).

---

## 2. Layout Anti-Patterns

### ❌ Anti-Pattern 4: Unconstrained Full-Width Forms
- **Violation**: Stretching single-column forms across 1920px displays.
- **Rule**: Enforce `max-width: 600px` for single-column forms or split into card-based multi-column sections.

### ❌ Anti-Pattern 5: Unpaginated Large Data Tables
- **Violation**: Rendering thousands of table rows in a single DOM without pagination or virtualization.
- **Rule**: Use pagination (10/20/50 rows per page) or use virtualized rendering (`Listy`) for large sets.

---

## 3. Interaction Anti-Patterns

### ❌ Anti-Pattern 6: Modal Dialog Stacking
- **Violation**: Opening a modal on top of an existing modal dialog.
- **Rule**: Never exceed one modal level. Use slide-over Drawers or inline Popconfirms for sub-actions.

### ❌ Anti-Pattern 7: Premature Input Validation
- **Violation**: Showing error messages on the first typed keystroke.
- **Rule**: Trigger format validation on blur (`onBlur`). Only re-validate on change (`onChange`) after an error has already been displayed.

### ❌ Anti-Pattern 8: Unconfirmed Destructive Actions
- **Violation**: Executing record deletions immediately on click without confirmation.
- **Rule**: Attach a Popconfirm for inline deletions. Require typing the resource name in a modal for irreversible system deletions.
