# Upload

> Category: **Data-entry**  
> Identifier: `upload`  
> Definition: File selection, drag-and-drop, and upload management component.

---

## 1. Overview & Intent

### When to Use
Use for uploading documents, images, avatar photos, or importing bulk datasets.

### When NOT to Use
Do not use for pasting simple text strings; use TextArea instead. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Upload Structural Hierarchy:
├── Root: Upload trigger or drop target.
├── FileList: Collection of uploaded items.
├── Item: Individual file card with name, progress bar, preview icon, and delete button.
```

---

## 3. Variants & Types

- **Button trigger**
- **Drag and Drop zone**: Dragger
- **Picture card list**: Image preview thumbnails

---

## 4. Sizes & Spatial Metrics

| Tier | CSS Token / Class | Height | Font Size | Horizontal Padding | Target Context |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Small (sm)** | `.input-sm` (`--control-height-sm`) | `32px` | `12px` | `8px` (`0.5rem`) | Compact table filter bars, dense toolbars |
| **Default (md)** | `.input` (`--control-height`) | `36px` | `14px` | `12px` (`0.75rem`) | Standard forms, modal/drawer fields |
| **Large (lg)** | `.input-lg` (`--control-height-lg`) | `40px` | `16px` | `16px` (`1rem`) | Command palettes, login forms, loose density mode |

---

## 5. Interaction & State Contract

Follows the universal 8-state interaction contract in [Components Overview](../overview.md#2-universal-interaction-states-contract):
- **Normal / Hover**: `1px solid var(--input)` border; transitions to `--muted-foreground` on `:hover`.
- **Focus**: Applies `border-color: var(--foreground)` and `box-shadow: 0 0 0 1px var(--foreground)` (or `2px solid var(--ring)`).
- **Error (`aria-invalid="true"`)**: Switches border and focus ring to `--destructive` (`#ef4444`) and links to error text via `aria-describedby`.
- **Disabled / Read-only**: Reduces opacity to `0.5`, sets `cursor: not-allowed`, and blocks input mutations.

---

## 6. Design Tokens Specification

| CSS Custom Property | Light / Dark Value | Semantic Role |
| :--- | :--- | :--- |
| `--input` | `#e4e4e7` (`#27272a` dark) | Default resting control border |
| `--foreground` / `--text-0` | `#09090b` (`#fafafa` dark) | Input value text and active focus border |
| `--muted-foreground` / `--text-2` | `#71717a` / `#a1a1aa` | Placeholder text and prefix/suffix icons |
| `--destructive` | `#ef4444` (`#7f1d1d` dark) | Validation error border and helper message |
| `--control-height` / `--radius` | `36px` / `6px` | Standard control height and corner radius |

---

## 7. Do's, Don'ts & Accessibility

### Rules & Pitfalls
- ✅ **Do**: Pair every form control with a visible `<label>` (or `aria-label` in compact filter bars) and constrained width (`max-width: 600px` in single-column forms).
- ✅ **Do**: Validate format on `blur`, then re-validate on `input` after an error is shown so error states clear immediately when corrected.
- ❌ **Don't**: Rely solely on placeholder text as a substitute for field labels.
- ❌ **Don't**: Flash red validation errors on the user's very first keystroke.

### Accessibility (WCAG 2.1)
- **ARIA Role**: `role="button"`
- **Key Attributes**: Native drag-and-drop support
- **Keyboard Navigation**: Tab focuses upload area; Enter or Space opens native OS file picker.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
