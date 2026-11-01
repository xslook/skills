---
name: dashboard-design
description: >-
  Use when designing, building, refactoring, or reviewing web dashboards, admin consoles, analytics workbenches, internal tools, or data-dense web UIs.
  Provides a zero-dependency vanilla CSS/JS design system (shadcn/ui style), design tokens, light/dark themes, 24-column layouts, and 72 UI component specs.
  Do not use for marketing landing pages or non-web apps.
---

# Enterprise Dashboard & Web UI Design (`dashboard-design`)

A zero-dependency, shadcn/ui-inspired design system and engineering specification for web dashboards, admin consoles, data workbenches, and internal tools using pure vanilla CSS custom properties and JavaScript.

---

## 1. When to Activate

- **Dashboards & Admin Consoles**: SaaS admin panels, analytics views, operational workbenches, CRM/ERP interfaces, monitoring screens, or user portals.
- **Data-Dense Views**: Analytical data tables (filtering, sorting, batch actions, pagination, virtualization), KPI metric grids, multi-step forms, or slide-over drawers.
- **Design Tokens & Theming**: CSS custom properties (`:root`, `[data-theme="dark"]`), dark mode surface elevation (`--surface-0` to `--surface-4`), or density modes (Compact, Default, Loose).
- **UI Components & Accessibility**: Implementing or auditing any of the 72 standardized components, WCAG 2.1 contrast, keyboard focus traps, or `tabular-nums` data formatting.

**Do NOT use for**: Marketing landing pages, promotional sites, pure backend services, or native mobile/desktop apps.

---

## 2. Execution Workflow

1. **Classify Page & Density**:
   - Pick the page archetype from [`page-templates.md`](./references/layout/page-templates.md) (Workbench, Form, List/Table, Detail, Result, Exception).
   - Pick the density mode from [`visual-hierarchy.md`](./references/layout/visual-hierarchy.md): **Compact** (`32px` controls / `36px` rows), **Default** (`36px` controls / `48px` rows), or **Loose** (`40px` controls / `56px` rows).
2. **Load Token & Style Foundation**:
   - Use [`templates/shadcn/theme.css`](./templates/shadcn/theme.css), [`templates/shadcn/components.css`](./templates/shadcn/components.css), and [`templates/shadcn/theme.js`](./templates/shadcn/theme.js) (see [`design-tokens.md`](./references/theme/design-tokens.md)).
   - Use Vanilla CSS with semantic variables (`var(--*)`). Never hardcode raw hex/RGB colors or off-grid pixel values.
3. **Select Components via Progressive Disclosure**:
   - Load [`workflows.md`](./references/workflows.md) and [`style-guide.md`](./templates/shadcn/style-guide.md) for full dashboard blueprints.
   - Check [`component-decision-tree.md`](./references/component-decision-tree.md) when choosing between similar components (e.g., `Modal` vs `Drawer` vs `Popconfirm`).
   - Read only the needed component specs from `references/components/<category>/<component>.md`.
4. **Verify Against Golden Rules & Checklist**:
   - Audit rules, dark mode elevation, keyboard accessibility, and data formatting before delivery.

---

## 3. Non-Negotiable Golden Rules

1. **DO NOT Use Internet Fonts (System Fonts Only)**:
   - Never load external or internet fonts such as Google Fonts (`fonts.googleapis.com`), Adobe Fonts, or CDN `@font-face` imports.
   - Strictly use native OS system font stacks defined in `--font-sans` and `--font-mono` for zero network latency, offline reliability, and crisp rendering.
2. **DO NOT Use Heavy CSS Frameworks (No Tailwind CSS)**:
   - Never use heavy utility or component CSS frameworks like Tailwind CSS, Bootstrap, Bulma, or external CSS CDN bundles.
   - Build exclusively with clean, lightweight vanilla CSS using semantic CSS custom properties (`var(--*)`) and modular component classes ([`theme.css`](./templates/shadcn/theme.css) and [`components.css`](./templates/shadcn/components.css)).
3. **Single Primary Action Per View**:
   - Render at most **one** solid primary button (`.btn-primary`) per operational area (page header, form footer, or modal dialog). Secondary actions must use `.btn-outline`, `.btn-secondary`, or `.btn-ghost`.
4. **Strict 4px/8px Spatial Grid & Control Heights**:
   - Align all paddings, gaps, and layout rhythms to the `4px`/`8px` spatial scale (`--spacing-1` to `--spacing-12`).
   - Use standard control heights: `xs` (`24px`), `sm` (`32px`), `default` (`36px`), or `lg` (`40px`). Never invent arbitrary pixel sizes.
5. **Dark Mode Elevation by Surface Lightening (Never Shadows Alone)**:
   - Light mode uses layered drop shadows (`--shadow-xs` to `--shadow-xl`).
   - Dark mode expresses elevation by progressively lightening surface tokens (`--surface-0: #09090b` canvas → `--surface-1: #121215` card → `--surface-2: #1c1c20` hover/header → `--surface-3: #242429` popover → `--surface-4: #2a2a30` modal).
6. **Tabular Numerals & Right-Aligned Metrics**:
   - Apply `font-variant-numeric: tabular-nums` and right-align all numeric columns, currency amounts, timestamps, and live KPI counters to prevent layout jitter.
7. **Stay on the Page (Contextual Overlays Over Full Navigation)**:
   - Use `Popconfirm` for row-level destructive confirmations, `Drawer` for inspecting/editing records in context, and a single-level `Modal` (never stack modals) for blocking confirmations.
8. **Zero Raw Fallbacks & Mandatory Data Hygiene**:
   - Never render raw `null`, `undefined`, `NaN`, or blank table cells; display a muted en-dash (`—`) or `N/A` using `--muted-foreground` (`--text-2`). Mask sensitive PII by default.
9. **Uncompromised Keyboard & Focus Accessibility**:
   - Never apply `outline: none` without a `:focus-visible` ring (`2px solid var(--ring)`). Modals and Drawers must trap `Tab` focus, lock body scroll, close on `Escape`, and restore focus on close.

---

## 4. System Directory & Navigation Router

```text
dashboard-design/
├── SKILL.md                                    # Main entry point, golden rules, and router
├── references/                                 # Progressive-disclosure specifications
│   ├── design.md                               # Machine-readable Design Token dictionary
│   ├── workflows.md                            # 6 End-to-end dashboard implementation blueprints & diagnostics
│   ├── best-practices.md                       # Customization ladder, density modes, focus traps & performance
│   ├── component-decision-tree.md              # Decision flowcharts for choosing between similar components
│   ├── token-mapping-guide.md                  # Cross-platform mapping (CSS Variables, Flutter, SwiftUI, Compose)
│   ├── shadcn-theme.md                         # Reference theme integration guide & token alignment matrix
│   ├── anti-patterns.md                        # High-frequency visual, layout, and interaction pitfalls
│   │
│   ├── specifications/                         # Core Design & Content Specifications
│   │   ├── values.md                           # 4 Design values: Natural, Certain, Meaningful, Growing
│   │   ├── principles.md                       # 10 Interaction principles (Proximity, Alignment, Contrast, etc.)
│   │   ├── copywriting.md                      # UI copywriting, voice, and punctuation rules
│   │   ├── data-format.md                      # Numbers, currency, dates, PII masking, and fallbacks
│   │   └── accessibility.md                    # WCAG 2.1 contrast, keyboard bindings, and ARIA matrix
│   │
│   ├── theme/                                  # Theme & Token Architecture
│   │   ├── design-tokens.md                    # 4-tier token cascade (Seed -> Map -> Alias -> Component)
│   │   ├── colors.md                           # Brand presets, 12-palette derivative scale, and neutral hierarchy
│   │   ├── typography.md                       # Mathematical type scale, line heights, and tabular numerals
│   │   ├── layout-spacing.md                   # 8px/4px spatial grid, control heights, and border radii
│   │   ├── elevation-shadow.md                 # 4 elevation levels, layered & directional shadow formulas
│   │   ├── motion.md                           # Easing curves and duration hierarchy (100ms–300ms)
│   │   └── dark-mode.md                        # Dark theme surface elevation inversion & contrast rules
│   │
│   ├── layout/                                 # Layout System & Page Patterns
│   │   ├── grid-system.md                      # 24-column grid, 6 responsive breakpoints, and layout modes
│   │   ├── visual-hierarchy.md                 # Container nesting and 3 density modes (Compact, Default, Loose)
│   │   └── page-templates.md                   # 6 Patterns: Workbench, Form, List, Detail, Result, Exception
│   │
│   └── components/                             # Component Specifications (72 Components)
│       ├── overview.md                         # Component catalog, universal 8-state contract & sizing
│       ├── general/                            # button, float-button, icon, typography
│       ├── layout/                             # divider, flex, grid, layout, masonry, space, splitter
│       ├── navigation/                         # affix, anchor, breadcrumb, dropdown, menu, pagination, steps, tabs
│       ├── data-entry/                         # auto-complete, cascader, checkbox, color-picker, date-picker, form,
│       │                                       # input, input-number, mentions, radio, rate, select, slider,
│       │                                       # switch, time-picker, transfer, tree-select, upload
│       ├── data-display/                       # avatar, badge, calendar, card, carousel, collapse, descriptions,
│       │                                       # empty, image, list, listy, popover, qr-code, segmented,
│       │                                       # statistic, table, tag, timeline, tooltip, tour, tree
│       ├── feedback/                           # alert, drawer, message, modal, notification, popconfirm,
│       │                                       # progress, result, skeleton, spin, watermark
│       └── other/                              # app, border-beam, config-provider
│
└── templates/                                  # Zero-Dependency CSS & JS Reference Implementation
    └── shadcn/
        ├── theme.css                           # CSS custom properties (Light & Dark themes)
        ├── components.css                      # Production component primitive styles
        ├── theme.js                            # ThemeManager & collapsible sidebar controller
        └── style-guide.md                      # HTML/CSS/JS usage guide & full dashboard boilerplate
```

---

## 5. Component Index (72 Components)

| Category | Components |
| :--- | :--- |
| **General (4)** | [Button](./references/components/general/button.md) \| [FloatButton](./references/components/general/float-button.md) \| [Icon](./references/components/general/icon.md) \| [Typography](./references/components/general/typography.md) |
| **Layout (7)** | [Divider](./references/components/layout/divider.md) \| [Flex](./references/components/layout/flex.md) \| [Grid](./references/components/layout/grid.md) \| [Layout](./references/components/layout/layout.md) \| [Masonry](./references/components/layout/masonry.md) \| [Space](./references/components/layout/space.md) \| [Splitter](./references/components/layout/splitter.md) |
| **Navigation (8)** | [Affix](./references/components/navigation/affix.md) \| [Anchor](./references/components/navigation/anchor.md) \| [Breadcrumb](./references/components/navigation/breadcrumb.md) \| [Dropdown](./references/components/navigation/dropdown.md) \| [Menu](./references/components/navigation/menu.md) \| [Pagination](./references/components/navigation/pagination.md) \| [Steps](./references/components/navigation/steps.md) \| [Tabs](./references/components/navigation/tabs.md) |
| **Data Entry (18)** | [AutoComplete](./references/components/data-entry/auto-complete.md) \| [Cascader](./references/components/data-entry/cascader.md) \| [Checkbox](./references/components/data-entry/checkbox.md) \| [ColorPicker](./references/components/data-entry/color-picker.md) \| [DatePicker](./references/components/data-entry/date-picker.md) \| [Form](./references/components/data-entry/form.md) \| [Input](./references/components/data-entry/input.md) \| [InputNumber](./references/components/data-entry/input-number.md) \| [Mentions](./references/components/data-entry/mentions.md) \| [Radio](./references/components/data-entry/radio.md) \| [Rate](./references/components/data-entry/rate.md) \| [Select](./references/components/data-entry/select.md) \| [Slider](./references/components/data-entry/slider.md) \| [Switch](./references/components/data-entry/switch.md) \| [TimePicker](./references/components/data-entry/time-picker.md) \| [Transfer](./references/components/data-entry/transfer.md) \| [TreeSelect](./references/components/data-entry/tree-select.md) \| [Upload](./references/components/data-entry/upload.md) |
| **Data Display (21)** | [Avatar](./references/components/data-display/avatar.md) \| [Badge](./references/components/data-display/badge.md) \| [Calendar](./references/components/data-display/calendar.md) \| [Card](./references/components/data-display/card.md) \| [Carousel](./references/components/data-display/carousel.md) \| [Collapse](./references/components/data-display/collapse.md) \| [Descriptions](./references/components/data-display/descriptions.md) \| [Empty](./references/components/data-display/empty.md) \| [Image](./references/components/data-display/image.md) \| [List](./references/components/data-display/list.md) \| [Listy](./references/components/data-display/listy.md) \| [Popover](./references/components/data-display/popover.md) \| [QRCode](./references/components/data-display/qr-code.md) \| [Segmented](./references/components/data-display/segmented.md) \| [Statistic](./references/components/data-display/statistic.md) \| [Table](./references/components/data-display/table.md) \| [Tag](./references/components/data-display/tag.md) \| [Timeline](./references/components/data-display/timeline.md) \| [Tooltip](./references/components/data-display/tooltip.md) \| [Tour](./references/components/data-display/tour.md) \| [Tree](./references/components/data-display/tree.md) |
| **Feedback (11)** | [Alert](./references/components/feedback/alert.md) \| [Drawer](./references/components/feedback/drawer.md) \| [Message](./references/components/feedback/message.md) \| [Modal](./references/components/feedback/modal.md) \| [Notification](./references/components/feedback/notification.md) \| [Popconfirm](./references/components/feedback/popconfirm.md) \| [Progress](./references/components/feedback/progress.md) \| [Result](./references/components/feedback/result.md) \| [Skeleton](./references/components/feedback/skeleton.md) \| [Spin](./references/components/feedback/spin.md) \| [Watermark](./references/components/feedback/watermark.md) |
| **Other (3)** | [App](./references/components/other/app.md) \| [BorderBeam](./references/components/other/border-beam.md) \| [ConfigProvider](./references/components/other/config-provider.md) |

---

## 6. Pre-Delivery Quality Checklist

Verify every dashboard and UI implementation against this gate before delivery:

- [ ] **No Internet Fonts or Heavy CSS Frameworks**: Zero Google Fonts / CDN font links (uses native `--font-sans` and `--font-mono` only) and zero Tailwind CSS / Bootstrap frameworks (uses lightweight vanilla CSS and tokens).
- [ ] **Token Hygiene**: All colors, surfaces, borders, radii, shadows, and typography use semantic CSS custom properties (`var(--*)`); zero hardcoded hex/RGB literals in component markup.
- [ ] **Dark Mode Parity**: Verified `[data-theme="dark"]` rendering uses stratified surface elevation (`--surface-0` through `--surface-4`) and meets WCAG 2.1 contrast minimums (`4.5:1` body text, `3.0:1` UI borders/large text).
- [ ] **Action Hierarchy**: Each view, toolbar, and modal footer has at most one `.btn-primary` action; destructive actions require confirmation (`Popconfirm` or `Modal`).
- [ ] **Data Formatting**: Numbers, currencies, and timestamps in tables/KPI cards use `font-variant-numeric: tabular-nums`; missing values display muted `—` or `N/A` (never `null`/`undefined`).
- [ ] **Responsive & Overflow Safety**: Tables are wrapped in `.table-container` (`overflow-x: auto`); single-column forms are constrained (`max-width: 600px–640px`); popups are not clipped by parent `overflow: hidden`.
- [ ] **Accessibility & Keyboard Contract**: Interactive controls preserve `:focus-visible` rings, modals/drawers trap focus and close on `Escape`, and form errors bind via `aria-invalid="true"` and `aria-describedby`.
