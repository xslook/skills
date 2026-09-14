---
version: 1.0.0
name: Web Design System Specification
description: Enterprise-grade UI design system built on Natural, Certain, Meaningful, and Growing design values.
colors:
  # Brand & Status Seeds
  primary: '#1677FF'
  success: '#52C41A'
  warning: '#FAAD14'
  error: '#FF4D4F'
  info: '#1677FF'
  link: '#1677FF'

  # Base Palette Seeds (12 Colors)
  blue: '#1677FF'
  blue-1: '#E6F4FF'
  blue-2: '#BAE0FF'
  blue-3: '#91CAFF'
  blue-4: '#69B1FF'
  blue-5: '#4096FF'
  blue-6: '#1677FF'
  blue-7: '#0958D9'
  blue-8: '#003EB3'
  blue-9: '#002C8C'
  blue-10: '#001D66'

  purple: '#722ED1'
  cyan: '#13C2C2'
  green: '#52C41A'
  magenta: '#EB2F96'
  pink: '#EB2F96'
  red: '#F5222D'
  orange: '#FA8C16'
  yellow: '#FADB14'
  volcano: '#FA541C'
  geekblue: '#2F54EB'
  gold: '#FAAD14'
  lime: '#A0D911'

  # Surface & Backgrounds (Light Theme)
  surface: '#FFFFFF'
  surface-container: '#FAFAFA'
  surface-layout: '#F5F5F5'
  surface-elevated: '#FFFFFF'
  surface-spotlight: 'rgba(0, 0, 0, 0.85)'
  surface-mask: 'rgba(0, 0, 0, 0.45)'

  # Text & Content (Alpha-based Neutrals)
  on-surface: 'rgba(0, 0, 0, 0.88)'           # Heading & Primary Text
  on-surface-secondary: 'rgba(0, 0, 0, 0.65)' # Body & Secondary Text
  on-surface-tertiary: 'rgba(0, 0, 0, 0.45)'  # Captions, Icons, Labels
  on-surface-disabled: 'rgba(0, 0, 0, 0.25)'  # Disabled text & placeholder
  on-surface-inverse: '#FFFFFF'               # Text on dark backgrounds

  # Borders & Dividers
  outline: '#D9D9D9'                          # Base border
  outline-variant: '#F0F0F0'                  # Secondary border / dividers
  outline-split: 'rgba(5, 5, 5, 0.06)'        # Table split / fine separators

typography:
  font-family-base: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"
  font-family-code: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace"
  display-lg:
    fontSize: 38px
    fontWeight: '600'
    lineHeight: 46px
  headline-lg:
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
  headline-md:
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 20px
  code:
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px

rounded:
  none: 0px
  xs: 2px
  sm: 4px
  DEFAULT: 6px
  lg: 8px
  xl: 16px
  full: 9999px

spacing:
  unit: 4px
  base-grid: 8px
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  control-height-xs: 16px
  control-height-sm: 24px
  control-height: 32px
  control-height-lg: 40px

elevation:
  level-0: 'none'
  level-1: '0 1px 2px 0 rgba(0,0,0,0.05), 0 1px 6px -1px rgba(0,0,0,0.03), 0 2px 4px 0 rgba(0,0,0,0.03)'
  level-2: '0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05)'
  level-3: '0 12px 32px 4px rgba(0,0,0,0.08), 0 8px 20px -4px rgba(0,0,0,0.12), 0 16px 48px 16px rgba(0,0,0,0.06)'
  card-hover: '0 1px 2px -2px rgba(0,0,0,0.16), 0 3px 6px 0 rgba(0,0,0,0.12), 0 5px 12px 4px rgba(0,0,0,0.09)'

motion:
  duration-fast: '0.1s'
  duration-mid: '0.2s'
  duration-slow: '0.3s'
  ease-out: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
  ease-in-out: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  ease-out-circ: 'cubic-bezier(0.08, 0.82, 0.17, 1)'
  ease-out-back: 'cubic-bezier(0.12, 0.4, 0.29, 1.46)'
---

# Web Design System Specification

A framework-agnostic reference defining design tokens, spatial metrics, and elevation models.

## 1. Design Values

- **Natural**: Follow physical laws and human perceptual habits. Minimize cognitive load.
- **Certain**: Maintain high predictability, low entropy, and clear feedback loops.
- **Meaningful**: Reserve visual weight solely for actions and information. Eliminate decoration.
- **Growing**: Scale from compact forms to high-density data grids without losing structure.

## 2. Spatial Metrics

- **Base Grid**: 8px spatial grid; 4px micro step.
- **Control Heights**:
  - `Small`: 24px/32px (compact tables, high-density toolbars)
  - `Middle`: 32px/36px (standard forms, buttons, inputs)
  - `Large`: 40px (login screens, hero inputs, key calls to action)
- **Typography Scale**:
  - Base body: `14px` size, `22px` line height.
  - Numbers in data grids require `font-variant-numeric: tabular-nums`.

## 3. Elevation & Shadows

- **Level 0 (Flat)**: `none` (inputs, flat cards, dividers).
- **Level 1 (Hover)**: Sub-surface elevation (card hover, floating buttons).
- **Level 2 (Attached)**: Dropdowns, popovers, date pickers.
- **Level 3 (Modal)**: Modals, drawers, global notification banners.

## 4. Navigation Links

- [Design Values](./specifications/values.md)
- [Design Tokens](./theme/design-tokens.md)
- [Dashboard Workflows](./WORKFLOWS.md)
- [Best Practices](./BEST_PRACTICES.md)
- [Grid System](./layout/grid-system.md)
- [Component Overview](./components/overview.md)
- [Reference Theme (shadcn/ui)](./theme/shadcn/theme.css)
- [Decision Trees](./references/component-decision-tree.md)
