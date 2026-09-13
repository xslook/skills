# Spacing & Spatial Metrics

The layout system uses an 8px base geometric grid with 4px micro-increments to maintain proportional spatial balance.

---

## 1. Spacing Scale

All margins, paddings, and component dimensions adhere to the 4px/8px modular scale:

| Token | Value | Hierarchy | Typical Usage |
| :--- | :--- | :--- | :--- |
| `size-xxs` | `4px` | Micro | Icon-to-text gap, compact tag horizontal padding |
| `size-xs` | `8px` | Tight | Input prefix spacing, button icon gap, dense list items |
| `size-sm` | `12px` | Standard Inner | Form label to control vertical gap, dropdown item vertical padding |
| `size-md` | `16px` | Module | Card element gaps, list row spacing, form item gaps |
| `size-lg` | `24px` | Container | Card interior padding, grid column gutters |
| `size-xl` | `32px` | Section | Major section vertical gaps, dialog content to footer gap |
| `size-xxl` | `48px` | Macro | Page-level regional dividers, empty-state top/bottom margins |

---

## 2. Standard Control Heights

Interactive inputs and buttons use 3 standard height tiers:

| Tier | Height | Font Size / Line Height | Horizontal Padding | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Small (sm)** | `24px` | `12px / 20px` | `8px` | High-density tables, compact toolbars |
| **Middle (md / default)** | `32px` | `14px / 22px` | `12px` | **Default**: Standard forms, dialog buttons |
| **Large (lg)** | `40px` | `16px / 24px` | `16px` | Login inputs, search hero bars, CTA buttons |

---

## 3. Border Radii Scale

- `border-radius-xs` (`2px`): Micro badges, progress bar ends.
- `border-radius-sm` (`4px`): Checkboxes, dropdown item hover fills.
- `border-radius` (`6px`): **Default base**: Buttons, input fields, selects.
- `border-radius-lg` (`8px`): Cards, modal dialogs, drawer panels.
- `border-radius-xl` (`16px`): Highlight cards, onboarding banners.
- `border-radius-full` (`9999px`): Pill tags, segmented controllers, circular avatars.
