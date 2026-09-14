---
name: web-design
description: >-
  Use when designing or developing web dashboards, admin consoles, user portals, or data-dense application interfaces. Do not use for customer-facing marketing websites, landing pages, backend logic, or native non-web apps.
---

# Web Design System Specification

A framework-agnostic web design system tailored for user and admin dashboards, data consoles, and management interfaces. Covers design tokens, 24-column layout grids, interaction contracts, and 72 component specifications, combining enterprise interaction patterns with a clean shadcn/ui-inspired aesthetic implemented in standard CSS and JavaScript.

## System Directory & Router

```text
web-design/
├── SKILL.md                          # Main entry point and navigation router
├── design.md                         # Machine-readable Design Token dictionary
│
├── specifications/                   # Core Design Specifications
│   ├── values.md                     # 4 Design values: Natural, Certain, Meaningful, Growing
│   ├── principles.md                 # 10 Interaction principles
│   ├── copywriting.md                # UI copywriting, voice, and punctuation rules
│   ├── data-format.md                # Numbers, currency, dates, masking, and fallbacks
│   └── accessibility.md              # WCAG 2.1 compliance, contrast, and keyboard navigation
│
├── theme/                            # Theme & Design Tokens
│   ├── design-tokens.md              # 4-tier token hierarchy (Seed -> Map -> Alias -> Component)
│   ├── colors.md                     # 12-palette derivative formulas, neutrals, and status colors
│   ├── typography.md                 # Mathematical type scale, line heights, tabular numbers
│   ├── layout-spacing.md             # 8px/4px spatial grid, control heights, border radiuses
│   ├── elevation-shadow.md           # 4 elevation levels, layered shadow formulas
│   ├── motion.md                     # Easing curves, duration hierarchy (100ms, 200ms, 300ms)
│   ├── dark-mode.md                  # Dark theme color mapping, surface elevation, and contrast
│   └── shadcn/                       # Reference implementation (shadcn/ui style in CSS & JS)
│       ├── theme.css                 # CSS custom properties (Light & Dark)
│       ├── theme.js                  # Theme manager & token controller
│       ├── components.css            # Primitive styles (Button, Input, Card, Dialog, etc.)
│       └── style-guide.md            # HTML/CSS/JS usage guide
│
├── layout/                           # Layout System & Page Patterns
│   ├── grid-system.md                # 24-column grid, 6 responsive breakpoints, layout modes
│   ├── visual-hierarchy.md           # Container nesting and 3 density modes (Compact, Default, Loose)
│   └── page-templates.md             # 6 Patterns: Workbench, Form, List, Detail, Result, Exception
│
├── components/                       # Specifications for all 72 Components
│   ├── overview.md                   # Component catalog, common sizing, 8 interaction states
│   ├── general/                      # button, float-button, icon, typography
│   ├── layout/                       # divider, flex, grid, layout, masonry, space, splitter
│   ├── navigation/                   # affix, anchor, breadcrumb, dropdown, menu, pagination, steps, tabs
│   ├── data-entry/                   # auto-complete, cascader, checkbox, color-picker, date-picker, form,
│   │                                 # input, input-number, mentions, radio, rate, select, slider,
│   │                                 # switch, time-picker, transfer, tree-select, upload
│   ├── data-display/                 # avatar, badge, calendar, card, carousel, collapse, descriptions,
│   │                                 # empty, image, list, listy, popover, qr-code, segmented,
│   │                                 # statistic, table, tag, timeline, tooltip, tour, tree
│   ├── feedback/                     # alert, drawer, message, modal, notification, popconfirm,
│   │                                 # progress, result, skeleton, spin, watermark
│   └── other/                        # app, border-beam, config-provider
│
└── references/                       # Selection & Cross-Platform Implementation
    ├── component-decision-tree.md    # Decision flowcharts for similar components
    ├── token-mapping-guide.md        # Token mapping for CSS, Tailwind, Flutter, iOS, Android
    ├── shadcn-theme.md               # shadcn/ui theme integration guide
    └── anti-patterns.md             # Common design pitfalls and violations
```

---

## Component Index

| Category | Components |
| :--- | :--- |
| **General (4)** | [Button](./components/general/button.md) \| [FloatButton](./components/general/float-button.md) \| [Icon](./components/general/icon.md) \| [Typography](./components/general/typography.md) |
| **Layout (7)** | [Divider](./components/layout/divider.md) \| [Flex](./components/layout/flex.md) \| [Grid](./components/layout/grid.md) \| [Layout](./components/layout/layout.md) \| [Masonry](./components/layout/masonry.md) \| [Space](./components/layout/space.md) \| [Splitter](./components/layout/splitter.md) |
| **Navigation (8)** | [Affix](./components/navigation/affix.md) \| [Anchor](./components/navigation/anchor.md) \| [Breadcrumb](./components/navigation/breadcrumb.md) \| [Dropdown](./components/navigation/dropdown.md) \| [Menu](./components/navigation/menu.md) \| [Pagination](./components/navigation/pagination.md) \| [Steps](./components/navigation/steps.md) \| [Tabs](./components/navigation/tabs.md) |
| **Data Entry (18)** | [AutoComplete](./components/data-entry/auto-complete.md) \| [Cascader](./components/data-entry/cascader.md) \| [Checkbox](./components/data-entry/checkbox.md) \| [ColorPicker](./components/data-entry/color-picker.md) \| [DatePicker](./components/data-entry/date-picker.md) \| [Form](./components/data-entry/form.md) \| [Input](./components/data-entry/input.md) \| [InputNumber](./components/data-entry/input-number.md) \| [Mentions](./components/data-entry/mentions.md) \| [Radio](./components/data-entry/radio.md) \| [Rate](./components/data-entry/rate.md) \| [Select](./components/data-entry/select.md) \| [Slider](./components/data-entry/slider.md) \| [Switch](./components/data-entry/switch.md) \| [TimePicker](./components/data-entry/time-picker.md) \| [Transfer](./components/data-entry/transfer.md) \| [TreeSelect](./components/data-entry/tree-select.md) \| [Upload](./components/data-entry/upload.md) |
| **Data Display (21)** | [Avatar](./components/data-display/avatar.md) \| [Badge](./components/data-display/badge.md) \| [Calendar](./components/data-display/calendar.md) \| [Card](./components/data-display/card.md) \| [Carousel](./components/data-display/carousel.md) \| [Collapse](./components/data-display/collapse.md) \| [Descriptions](./components/data-display/descriptions.md) \| [Empty](./components/data-display/empty.md) \| [Image](./components/data-display/image.md) \| [List](./components/data-display/list.md) \| [Listy](./components/data-display/listy.md) \| [Popover](./components/data-display/popover.md) \| [QRCode](./components/data-display/qr-code.md) \| [Segmented](./components/data-display/segmented.md) \| [Statistic](./components/data-display/statistic.md) \| [Table](./components/data-display/table.md) \| [Tag](./components/data-display/tag.md) \| [Timeline](./components/data-display/timeline.md) \| [Tooltip](./components/data-display/tooltip.md) \| [Tour](./components/data-display/tour.md) \| [Tree](./components/data-display/tree.md) |
| **Feedback (11)** | [Alert](./components/feedback/alert.md) \| [Drawer](./components/feedback/drawer.md) \| [Message](./components/feedback/message.md) \| [Modal](./components/feedback/modal.md) \| [Notification](./components/feedback/notification.md) \| [Popconfirm](./components/feedback/popconfirm.md) \| [Progress](./components/feedback/progress.md) \| [Result](./components/feedback/result.md) \| [Skeleton](./components/feedback/skeleton.md) \| [Spin](./components/feedback/spin.md) \| [Watermark](./components/feedback/watermark.md) |
| **Other (3)** | [App](./components/other/app.md) \| [BorderBeam](./components/other/border-beam.md) \| [ConfigProvider](./components/other/config-provider.md) |

---

## Component Specification Schema

Every component document in `components/` follows an 8-part specification:
1. **Overview & Intent**: Core purpose, when to use, and when not to use (with alternatives).
2. **Component Anatomy**: Structural slots, nesting hierarchy, and semantic DOM nodes.
3. **Variants & Types**: Visual styles (Solid, Outlined, Dashed, Text, Link) and semantic statuses.
4. **Sizes & Spatial Metrics**: Heights, font sizes, line heights, paddings, and radiuses for `sm` (24px/32px), `md` (32px/36px), `lg` (40px).
5. **Interaction States Contract**: Normal, Hover, Active, Focus, Selected, Disabled, Loading, Error.
6. **Layout, Alignment & Grouping**: Spatial gaps, alignment baselines, and responsive stacking.
7. **Design Tokens Specification**: Component-specific and shared design token bindings.
8. **Do's & Don'ts & Accessibility**: Rules for usage, ARIA roles, attributes, and keyboard bindings.

---

## LLM Retrieval Guidelines

- **Configuring Design Tokens or Colors**: Read [theme/design-tokens.md](./theme/design-tokens.md) and [theme/colors.md](./theme/colors.md).
- **shadcn Theme Implementation**: Use [theme/shadcn/theme.css](./theme/shadcn/theme.css), [theme/shadcn/components.css](./theme/shadcn/components.css), and [theme/shadcn/theme.js](./theme/shadcn/theme.js).
- **Building Page Layouts**: Read [layout/grid-system.md](./layout/grid-system.md) and [layout/page-templates.md](./layout/page-templates.md).
- **Designing or Implementing a Component**: Load only the specific document from `components/<category>/<component>.md`.
- **Resolving Component Ambiguities**: Check [references/component-decision-tree.md](./references/component-decision-tree.md).

---

## References & Acknowledgments

This design system synthesizes enterprise interaction contracts, state determination, and 24-column layout mathematics from the [Ant Design](https://ant.design/) specification, paired with a modern CSS and JavaScript reference implementation styled after shadcn/ui.
