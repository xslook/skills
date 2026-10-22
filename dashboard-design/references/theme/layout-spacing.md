# Spacing & Spatial Metrics

The layout system uses an `8px` base geometric grid with `4px` micro-increments to maintain proportional spatial balance across all density modes.

---

## 1. Spacing Scale

All margins, paddings, and layout gaps adhere to the `4px`/`8px` modular scale:

| CSS Token | Value | Hierarchy | Typical Usage |
| :--- | :--- | :--- | :--- |
| `--spacing-1` (`size-xxs`) | `4px` | Micro | Icon-to-text gap, compact badge padding, segmented track padding |
| `--spacing-2` (`size-xs`) | `8px` | Tight | Button group gap, input prefix/suffix spacing, compact list items |
| `--spacing-3` (`size-sm`) | `12px` | Standard Inner | Form label-to-input vertical gap, table cell vertical padding |
| `--spacing-4` (`size-md`) | `16px` | Module | Form field-to-field gap, card grid gap, toolbar padding |
| `--spacing-6` (`size-lg`) | `24px` | Container | Standard card padding (`1.5rem`), desktop grid gutter |
| `--spacing-8` (`size-xl`) | `32px` | Section | Major section vertical separation, wide display gutter |
| `--spacing-12` (`size-xxl`) | `48px` | Macro | Page-level regional dividers, empty-state vertical margins |

---

## 2. Standard Control Heights

Interactive inputs, buttons, and selects use 4 standardized height tiers:

| Tier | CSS Token | Height | Font Size / Line Height | Horizontal Padding | Target Context |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Extra-Small (xs)** | `--control-height-xs` | `24px` | `12px / 20px` | `6px–8px` | Inline table action chips, micro tags, compact badges |
| **Small (sm)** | `--control-height-sm` | `32px` | `12px / 20px` | `12px` (`0.75rem`) | **Compact density mode**, table filter toolbars, secondary header actions |
| **Default (md)** | `--control-height` | **`36px`** | `14px / 22px` | `16px` (`1rem`) | **Default standard**: Primary forms, dialog actions, standard buttons |
| **Large (lg)** | `--control-height-lg` | `40px` | `16px / 24px` | `24px` (`1.5rem`) | **Loose density mode**, login forms, hero search bars, touch targets |

---

## 3. Border Radii Scale

- `--radius-xs` (`2px`): Micro badges, progress bar caps, keyboard shortcut kbd tags.
- `--radius-sm` (`4px`): Checkboxes, small buttons (`.btn-sm`), dropdown menu items, tab triggers.
- `--radius` (`6px`): **Default control radius**: standard buttons (`.btn`), inputs (`.input`), selects, segmented groups.
- `--radius-md` (`8px`): Alert banners (`.alert`), data table containers (`.table-container`), floating popovers.
- `--radius-lg` (`12px`): Cards (`.card`, `.stat-card`), modal dialogs (`.dialog-content`), inset dashboard canvas (`.sidebar-inset`).
- `--radius-xl` (`16px`): Feature spotlight containers, onboarding hero panels.
- `--radius-full` (`9999px`): Pill badges (`.badge`), floating batch action bars, circular avatars.
