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

### Color Tokens
- `color-bg-base`: Root background (`#ffffff` light, `#000000` dark).
- `color-bg-layout`: Page background behind containers (`#f5f5f5`).
- `color-bg-container`: Cards, tables, and form container surfaces (`#ffffff`).
- `color-bg-elevated`: Floating surfaces like dropdowns and dialogs (`#ffffff`).
- `color-text`: Primary body and heading text (`rgba(0, 0, 0, 0.88)`).
- `color-text-secondary`: Subtitles and secondary text (`rgba(0, 0, 0, 0.65)`).
- `color-text-tertiary`: Captions, labels, and icons (`rgba(0, 0, 0, 0.45)`).
- `color-text-disabled`: Disabled text and input placeholders (`rgba(0, 0, 0, 0.25)`).
- `color-border`: Default component boundaries (`#d9d9d9`).
- `color-border-secondary`: Secondary dividers and subtle table lines (`#f0f0f0`).

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
