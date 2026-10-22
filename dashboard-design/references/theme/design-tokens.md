# Design Tokens Architecture

The design system structures styling variables across a 4-tier cascade, decoupling seed values from component-specific CSS rules.

---

## 1. The 4-Tier Cascade Model

```text
┌─────────────────────────────────────────────────────────┐
│ 1. Seed Tokens                                          │
│    Root brand & scale primitives: primary seed,         │
│    base font size (14px), base radius (6px), 4px unit   │
└───────────────────────────┬─────────────────────────────┘
                            │ (algorithmic expansion)
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Map Tokens                                           │
│    Derivative scales: --surface-0..4, --text-0..3,      │
│    --spacing-1..12, --radius-xs..xl, --shadow-xs..xl    │
└───────────────────────────┬─────────────────────────────┘
                            │ (semantic assignment)
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Alias Tokens                                         │
│    Cross-component semantics: --background, --foreground│
│    --primary, --border, --ring, --control-height        │
└───────────────────────────┬─────────────────────────────┘
                            │ (component binding)
                            ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Component Tokens                                     │
│    Scoped overrides: --sidebar-width, --header-height,  │
│    --card, --popover, --table-row-height                │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Core CSS Custom Property Catalog

### Surface & Elevation Hierarchy (`--surface-*`)
- `--surface-0` / `--background`: Base page canvas (`#ffffff` light, `#09090b` dark).
- `--surface-1` / `--card`: Container, card, and table surface (`#ffffff` light, `#121215` dark).
- `--surface-2` / `--muted`: Subtle fill, hover highlight, and table header surface (`#f4f4f5` light, `#1c1c20` dark).
- `--surface-3` / `--popover`: Floating popover, dropdown, and date picker surface (`#ffffff` light, `#242429` dark).
- `--surface-4`: High-elevation modal dialog and drawer surface (`#ffffff` light, `#2a2a30` dark).

### Text Hierarchy (`--text-*`)
- `--text-0` / `--foreground`: High-contrast primary headings and body text (`#09090b` light, `#fafafa` dark).
- `--text-1` / `--muted-foreground`: Secondary text, metadata subtitles, and table headers (`#71717a` light, `#a1a1aa` dark).
- `--text-2`: Tertiary captions, helper hints, and input placeholders (`#a1a1aa` light, `#71717a` dark).
- `--text-3`: Disabled text and inactive indicators (`#d4d4d8` light, `#52525b` dark).

### Brand & Status Tokens
- `--primary` / `--primary-foreground`: Primary interactive fill (`#18181b` / `#fafafa` in default Monochrome preset; `#1677ff` / `#ffffff` in Enterprise Blue preset).
- `--secondary` / `--secondary-foreground`: Subtle secondary button and badge fill (`#f4f4f5` light, `#27272a` dark).
- `--success` / `--success-bg` / `--success-border`: Safe/operational status (`#16a34a` light, `#15803d` dark).
- `--warning` / `--warning-bg` / `--warning-border`: Caution/pending status (`#f59e0b` light, `#b45309` dark).
- `--destructive` / `--destructive-hover`: Error/danger status (`#ef4444` light, `#7f1d1d` dark).
- `--info` / `--info-bg` / `--info-border`: Informational callout (`#2563eb` light, `#1d4ed8` dark).

### Semantic Boundary & Focus Tokens
- `--border`: Default component and card boundaries (`#e4e4e7` light, `#27272a` dark).
- `--border-secondary`: Secondary dividers and subtle table lines (`#f4f4f5` light, `#18181b` dark).
- `--input`: Form control border (`#e4e4e7` light, `#27272a` dark).
- `--ring`: Keyboard `:focus-visible` outline ring (`#18181b` light, `#fafafa` dark).

### Spacing Scale (`4px`/`8px` Modular Grid)
- `--spacing-1`: `4px` (Micro icon/tag gap)
- `--spacing-2`: `8px` (Tight inline element gap)
- `--spacing-3`: `12px` (Compact padding / form label-to-input gap)
- `--spacing-4`: `16px` (Standard module gap / card compact padding)
- `--spacing-6`: `24px` (Standard card padding / grid column gutter)
- `--spacing-8`: `32px` (Major section vertical separation)
- `--spacing-12`: `48px` (Macro page-level spacing)

### Control Height Tiers
- `--control-height-xs`: `24px` (Micro badges, inline table action chips)
- `--control-height-sm`: `32px` (Small controls, compact density mode, filter toolbars)
- `--control-height`: `36px` (Default standard controls: buttons, inputs, selects)
- `--control-height-lg`: `40px` (Large controls, loose density mode, hero CTAs)

### Border Radius Tokens
- `--radius-xs`: `2px` (Micro tags, progress bar caps)
- `--radius-sm`: `4px` (Checkboxes, compact buttons, dropdown items)
- `--radius`: `6px` (Default controls: buttons, inputs, selects)
- `--radius-md`: `8px` (Alerts, data table wrappers, popovers)
- `--radius-lg`: `12px` (Cards, modal dialogs, inset dashboard canvas)
- `--radius-xl`: `16px` (Feature highlight containers, onboarding banners)
- `--radius-full`: `9999px` (Capsule badges, segmented pills, circular avatars)
