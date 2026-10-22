---
name: dashboard-design
description: >-
  Use this skill whenever designing, building, refactoring, or reviewing web dashboards, admin consoles, user portals, analytics workbenches, internal tools, or data-dense enterprise web interfaces.
  Activate for dashboard layouts (collapsible sidebars, 24-column grids, KPI metric cards, data tables, filter toolbars, multi-step forms, drawers, modals), design tokens (CSS custom properties, light/dark surface elevation inversion, density modes), and UI component specifications (72 standardized components with WCAG 2.1 accessibility and interaction state contracts).
  Do not use for consumer marketing landing pages, promotional brochure sites, pure backend logic, or native mobile/desktop apps.
---

# Enterprise Dashboard & Web UI Design Specification (`dashboard-design`)

A framework-agnostic design system and engineering specification tailored for web dashboards, admin consoles, data workbenches, and management portals. Synthesizes enterprise interaction contracts and 24-column spatial mathematics with a zero-dependency, shadcn/ui-inspired CSS & JavaScript token architecture.

---

## 1. When to Activate This Skill

Activate this skill immediately when encountering any of the following scenarios:

- **Dashboards & Admin Consoles**: Building or redesigning SaaS admin panels, analytics views, operational workbenches, CRM/ERP interfaces, NOC monitoring screens, or user management portals.
- **Data-Dense Views & Workflows**: Designing analytical data tables (filtering, sorting, batch selection, pagination, virtualization), KPI metric grids, multi-step wizard forms, or master-detail slide-over drawers.
- **Design System & Token Architecture**: Defining or refactoring CSS custom properties (`:root`, `[data-theme="dark"]`), 4-tier token cascades, dark mode surface elevation (`--surface-0` to `--surface-4`), or information density modes (Compact, Default, Loose).
- **UI Component Specifications**: Implementing or auditing any of the 72 standardized enterprise components across General, Layout, Navigation, Data Entry, Data Display, Feedback, and Utility categories.
- **UI Accessibility & Formatting Audits**: Enforcing WCAG 2.1 contrast ratios, keyboard focus traps, ARIA state contracts, `tabular-nums` alignment, or sensitive PII masking.

### When NOT to Activate This Skill
- Customer-facing marketing websites, promotional landing pages, or editorial blogs focused on decorative storytelling.
- Pure backend services, CLI tools, or database schemas with no web UI surface.
- Native mobile/desktop applications (unless mapping shared design tokens via [`token-mapping-guide.md`](./references/token-mapping-guide.md)).

---

## 2. Execution Workflow (Follow in Order)

1. **Classify the Interface & Density Tier**:
   - Determine the page archetype from [`page-templates.md`](./references/layout/page-templates.md) (Workbench, Form, List/Table, Detail, Result, Exception).
   - Select the target density mode from [`visual-hierarchy.md`](./references/layout/visual-hierarchy.md): **Compact** (`32px` controls / `36px` rows for trading/NOC/DevOps), **Default** (`36px` controls / `48px` rows for standard SaaS/admin), or **Loose** (`40px` controls / `56px` rows for executive summaries/touch).
2. **Establish the Token & Theme Foundation**:
   - Load [`templates/shadcn/theme.css`](./templates/shadcn/theme.css), [`templates/shadcn/components.css`](./templates/shadcn/components.css), and [`templates/shadcn/theme.js`](./templates/shadcn/theme.js) (or map to the host project's token layer per [`design-tokens.md`](./references/theme/design-tokens.md)).
   - Never hardcode raw hex/RGB colors or off-grid pixel dimensions in view markup.
3. **Select Components & Blueprints via Progressive Disclosure**:
   - For end-to-end dashboard views, load [`workflows.md`](./references/workflows.md) and [`style-guide.md`](./templates/shadcn/style-guide.md).
   - When choosing between similar components (e.g., `Modal` vs `Drawer` vs `Popconfirm`, or `Switch` vs `Checkbox`), consult [`component-decision-tree.md`](./references/component-decision-tree.md).
   - Load only the specific component specs needed from `references/components/<category>/<component>.md`.
4. **Verify Against Golden Rules & Pre-Delivery Checklist**:
   - Audit visual hierarchy, dark mode elevation, keyboard accessibility, and data formatting before completing the task.

---

## 3. Non-Negotiable Golden Rules

1. **Single Primary Action Per View**:
   - Render at most **one** solid primary button (`.btn-primary`) per operational area (page header, form footer, or modal dialog). Secondary actions must use `.btn-outline`, `.btn-secondary`, or `.btn-ghost`.
2. **Strict 4px/8px Spatial Grid & Control Heights**:
   - All paddings, gaps, and layout rhythms must align to the `4px`/`8px` spatial scale (`--spacing-1` to `--spacing-12`).
   - Interactive controls must use standard height tiers: `xs` (`24px` micro), `sm` (`32px` compact), `default` (`36px` standard), or `lg` (`40px` large). Never invent arbitrary odd pixel sizes (`13px` padding, `35px` height).
3. **Dark Mode Elevation by Surface Lightening (Never Shadows Alone)**:
   - In light mode, elevation uses layered drop shadows (`--shadow-xs` to `--shadow-xl`).
   - In dark mode, drop shadows are invisible against dark canvases; express elevation by progressively lightening surface tokens (`--surface-0: #09090b` canvas → `--surface-1: #121215` card → `--surface-2: #1c1c20` hover/header → `--surface-3: #242429` popover → `--surface-4: #2a2a30` modal).
4. **Tabular Numerals & Right-Aligned Metrics**:
   - All numeric columns, currency amounts, timestamps, and live KPI counters must apply `font-variant-numeric: tabular-nums` and right-align in tables so digits and decimals align vertically without layout jitter.
5. **Stay on the Page (Contextual Overlays Over Full Navigation)**:
   - Prefer in-place interactions: use `Popconfirm` for row-level destructive confirmations, `Drawer` for inspecting/editing complex records while preserving list context, and `Modal` (single level only—never stack modals) for blocking confirmations.
6. **Zero Raw Fallbacks & Mandatory Data Hygiene**:
   - Never render raw `null`, `undefined`, `NaN`, or blank table cells; render a muted en-dash (`—` or `-`) or `N/A` using `--muted-foreground` (`--text-2`). Mask sensitive PII (phone, card, API keys) by default.
7. **Uncompromised Keyboard & Focus Accessibility**:
   - Never apply `outline: none` without a `:focus-visible` ring (`2px solid var(--ring)`). Modals and Drawers must trap `Tab` focus, lock background body scroll, dismiss on `Escape`, and restore focus to the trigger element on close.

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
│   ├── token-mapping-guide.md                  # Cross-platform mapping (CSS, Tailwind, Flutter, SwiftUI, Compose)
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

- [ ] **Token Hygiene**: All colors, surfaces, borders, radii, shadows, and typography use semantic CSS custom properties (`var(--*)`); zero hardcoded hex/RGB literals in component markup.
- [ ] **Dark Mode Parity**: Verified `[data-theme="dark"]` rendering uses stratified surface elevation (`--surface-0` through `--surface-4`) and meets WCAG 2.1 contrast minimums (`4.5:1` body text, `3.0:1` UI borders/large text).
- [ ] **Action Hierarchy**: Each view, toolbar, and modal footer has at most one `.btn-primary` action; destructive actions require confirmation (`Popconfirm` or `Modal`).
- [ ] **Data Formatting**: Numbers, currencies, and timestamps in tables/KPI cards use `font-variant-numeric: tabular-nums`; missing values display muted `—` or `N/A` (never `null`/`undefined`).
- [ ] **Responsive & Overflow Safety**: Tables are wrapped in `.table-container` (`overflow-x: auto`); single-column forms are constrained (`max-width: 600px–640px`); popups are not clipped by parent `overflow: hidden`.
- [ ] **Accessibility & Keyboard Contract**: Interactive controls preserve `:focus-visible` rings, modals/drawers trap focus and close on `Escape`, and form errors bind via `aria-invalid="true"` and `aria-describedby`.
