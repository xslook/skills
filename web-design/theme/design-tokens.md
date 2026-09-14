# Design Tokens Architecture

The design system structures styling variables across a 4-tier cascade, decoupling base values from component-specific rules.

---

## 1. The 4-Tier Cascade Model

```text
┌─────────────────────────────────────────────────────────┐
│ 1. Seed Tokens                                          │
│    Root brand values: colorPrimary, colorSuccess,       │
│    fontSize, borderRadius, sizeUnit, wireframe          │
└───────────────────────────┬─────────────────────────────┘
                            │ (algorithmic expansion)
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Map Tokens                                           │
│    Derivative scales: colorPrimaryBg, colorPrimaryHover,│
│    fontSizeLG, borderRadiusSM, paddingMD                │
└───────────────────────────┬─────────────────────────────┘
                            │ (semantic assignment)
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Alias Tokens                                         │
│    Cross-component semantics: colorText, colorBorder,   │
│    colorBgContainer, controlHeight                      │
└───────────────────────────┬─────────────────────────────┘
                            │ (component binding)
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Component Tokens                                     │
│    Scoped overrides: Button.primaryShadow, Table.headerBg│
│    Menu.itemSelectedColor, Modal.headerBg               │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Core Token Catalog

### Color & Surface Tokens
- `surface-0`: Base page canvas (`#ffffff` light, `#09090b` dark).
- `surface-1`: Container, card, and table background (`#ffffff` light, `#121215` dark).
- `surface-2`: Subtle fill, hover highlight, and table header background (`#f4f4f5` light, `#1c1c20` dark).
- `surface-3`: Floating popover, dropdown, and date picker surface (`#ffffff` light, `#242429` dark).
- `surface-4`: High-elevation modal, dialog, and drawer surface (`#ffffff` light, `#2a2a30` dark).

### Text Hierarchy Tokens
- `text-0`: High-contrast primary headings and body text (`#09090b` light, `#fafafa` dark).
- `text-1`: Secondary text, metadata subtitles, and table headers (`#71717a` light, `#a1a1aa` dark).
- `text-2`: Tertiary captions, helper hints, and input placeholders (`#a1a1aa` light, `#71717a` dark).
- `text-3`: Disabled text and inactive indicators (`#d4d4d8` light, `#52525b` dark).

### Semantic Boundary Tokens
- `border`: Default component boundaries (`#e4e4e7` light, `#27272a` dark).
- `border-secondary`: Secondary dividers and subtle table lines (`#f4f4f5` light, `#18181b` dark).

### Spacing & Size Tokens
- `size-unit`: Base unit (`4px`).
- `size-step`: Standard step (`4px`).
- `padding-xxs`: `4px`
- `padding-xs`: `8px`
- `padding-sm`: `12px`
- `padding-md`: `16px`
- `padding-lg`: `24px`
- `padding-xl`: `32px`
- `padding-xxl`: `48px`

### Control Height Tokens
- `control-height-xs`: `16px` (badges, micro tags)
- `control-height-sm`: `24px` (compact controls in dense tables)
- `control-height`: `32px` (default controls)
- `control-height-lg`: `40px` (hero inputs, large buttons)

### Border Radius Tokens
- `border-radius-xs`: `2px` (micro tags, progress bars)
- `border-radius-sm`: `4px` (checkboxes, dropdown items)
- `border-radius`: `6px` (default controls: buttons, inputs, selects)
- `border-radius-lg`: `8px` (cards, modals, popovers)
- `border-radius-full`: `9999px` (capsule tags, round avatars, badge dots)
