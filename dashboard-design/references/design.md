---
version: 2.0.0
name: Enterprise Dashboard Design Token Dictionary
description: Unified CSS custom property dictionary and spatial metrics for enterprise dashboards, admin consoles, and data-dense web interfaces.
tokens:
  colors:
    # Default Brand Preset (Monochrome Obsidian / Zinc - shadcn default)
    primary-light: '#18181B'
    primary-foreground-light: '#FAFAFA'
    primary-dark: '#FAFAFA'
    primary-foreground-dark: '#18181B'

    # Optional Enterprise Blue Brand Preset (Daybreak Blue)
    brand-blue: '#1677FF'
    brand-blue-hover: '#4096FF'
    brand-blue-active: '#0958D9'

    # Functional Status Tokens (Light / Dark)
    success-light: '#16A34A'
    success-bg-light: '#F0FDF4'
    success-border-light: '#BBF7D0'
    success-dark: '#15803D'
    success-bg-dark: '#052E16'
    success-border-dark: '#166534'

    warning-light: '#F59E0B'
    warning-bg-light: '#FFFBEC'
    warning-border-light: '#FDE68A'
    warning-dark: '#B45309'
    warning-bg-dark: '#451A03'
    warning-border-dark: '#78350F'

    destructive-light: '#EF4444'
    destructive-hover-light: '#DC2626'
    destructive-dark: '#7F1D1D'
    destructive-hover-dark: '#991B1B'

    info-light: '#2563EB'
    info-bg-light: '#EFF6FF'
    info-border-light: '#BFDBFE'
    info-dark: '#1D4ED8'
    info-bg-dark: '#172554'
    info-border-dark: '#1E40AF'

    # Stratified Surface Hierarchy (Light Mode)
    surface-0-light: '#FFFFFF' # Base page canvas
    surface-1-light: '#FFFFFF' # Card / container surface
    surface-2-light: '#F4F4F5' # Subtle fill / hover / table header
    surface-3-light: '#FFFFFF' # Floating dropdown / popover surface
    surface-4-light: '#FFFFFF' # High-elevation modal / dialog surface

    # Stratified Surface Hierarchy (Dark Mode - Higher is Lighter)
    surface-0-dark: '#09090B'  # Base page canvas
    surface-1-dark: '#121215'  # Card / container / sidebar surface
    surface-2-dark: '#1C1C20'  # Subtle fill / hover / table header
    surface-3-dark: '#242429'  # Floating dropdown / popover surface
    surface-4-dark: '#2A2A30'  # High-elevation modal / dialog surface

    # Numerical Text Hierarchy (Light / Dark)
    text-0-light: '#09090B'    # Primary headings & body text
    text-1-light: '#71717A'    # Secondary metadata & subtitles
    text-2-light: '#A1A1AA'    # Tertiary captions & placeholders
    text-3-light: '#D4D4D8'    # Disabled text
    text-0-dark: '#FAFAFA'
    text-1-dark: '#A1A1AA'
    text-2-dark: '#71717A'
    text-3-dark: '#52525B'

    # Borders & Rings
    border-light: '#E4E4E7'
    border-secondary-light: '#F4F4F5'
    border-dark: '#27272A'
    border-secondary-dark: '#18181B'

    # 12 Categorical Palette Seeds (Charts, Tags & Multi-Series Visualization)
    blue: '#1677FF'
    purple: '#722ED1'
    cyan: '#13C2C2'
    green: '#52C41A'
    magenta: '#EB2F96'
    pink: '#EB2F96'
    red: '#EF4444'
    orange: '#FA8C16'
    yellow: '#FADB14'
    volcano: '#FA541C'
    geekblue: '#2F54EB'
    gold: '#FAAD14'
    lime: '#A0D911'

  typography:
    font-sans: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif"
    font-mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
    scale:
      xs: { fontSize: 12px, lineHeight: 20px, role: 'Captions, badges, helper hints, timestamps' }
      sm: { fontSize: 14px, lineHeight: 22px, role: 'Base body text, form controls, buttons, table cells' }
      base: { fontSize: 16px, lineHeight: 24px, role: 'Sub-card titles (H4), large inputs, highlighted body' }
      lg: { fontSize: 18px, lineHeight: 26px, role: 'Dialog titles, section leads' }
      xl: { fontSize: 20px, lineHeight: 28px, role: 'Card titles (H3), drawer headers' }
      2xl: { fontSize: 24px, lineHeight: 32px, role: 'Section headers (H2), KPI card metrics' }
      3xl: { fontSize: 30px, lineHeight: 38px, role: 'Page top titles (H1)' }
      4xl: { fontSize: 36px, lineHeight: 44px, role: 'Hero display counters' }

  radii:
    none: 0px
    xs: 2px
    sm: 4px
    DEFAULT: 6px
    md: 8px
    lg: 12px
    xl: 16px
    full: 9999px

  spacing:
    unit: 4px
    base-grid: 8px
    spacing-1: 4px
    spacing-2: 8px
    spacing-3: 12px
    spacing-4: 16px
    spacing-6: 24px
    spacing-8: 32px
    spacing-12: 48px
    control-height-xs: 24px
    control-height-sm: 32px
    control-height: 36px
    control-height-lg: 40px

  elevation:
    shadow-xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
    shadow-sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
    shadow-md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
    shadow-lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
    shadow-xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'

  motion:
    duration-fast: 150ms
    duration-normal: 200ms
    duration-slow: 300ms
    ease-out: 'cubic-bezier(0.16, 1, 0.3, 1)'
    ease-in-out: 'cubic-bezier(0.4, 0, 0.2, 1)'
    ease-out-circ: 'cubic-bezier(0.08, 0.82, 0.17, 1)'
    ease-out-back: 'cubic-bezier(0.12, 0.4, 0.29, 1.46)'
---

# Dashboard Design Token Dictionary

Machine-readable reference defining the unified CSS custom property tokens, spatial metrics, and elevation rules across the `dashboard-design` skill.

## 1. Design Values

- **Natural**: Follow physical laws and human perceptual habits. Minimize cognitive load.
- **Certain**: Maintain high predictability, low collaboration entropy, and explicit feedback loops.
- **Meaningful**: Reserve visual weight solely for actions and information. Eliminate cosmetic decoration.
- **Growing**: Scale seamlessly from compact forms to high-density virtualized data grids.

## 2. Unified Spatial & Density Metrics

- **Base Spatial Grid**: `8px` spatial grid with `4px` micro-steps (`--spacing-1: 4px` through `--spacing-12: 48px`).
- **Control Heights**:
  - `Extra-Small (xs)`: `24px` (`--control-height-xs`, inline table tags, micro badges, compact cell actions)
  - `Small (sm)`: `32px` (`--control-height-sm`, compact density mode, filter bars, table toolbars)
  - `Default (md)`: `36px` (`--control-height`, standard buttons, form inputs, selects)
  - `Large (lg)`: `40px` (`--control-height-lg`, loose density mode, login screens, primary hero CTAs)
- **Density Modes**:
  - **Compact**: `32px` control height, `36px` table row height, `12px / 16px` container padding.
  - **Default**: `36px` control height, `48px` table row height, `16px / 24px` container padding.
  - **Loose**: `40px` control height, `56px` table row height, `24px / 32px` container padding.

## 3. Elevation & Surface Hierarchy

- **Light Mode**: Expresses depth via layered drop shadows (`--shadow-xs` through `--shadow-xl`) over white/zinc surfaces.
- **Dark Mode**: Expresses depth by progressively lightening surface tokens:
  - `--surface-0` (`#09090B`): Base page canvas
  - `--surface-1` (`#121215`): Card, table container, and sidebar surface
  - `--surface-2` (`#1C1C20`): Subtle fill, hover highlight, and sticky table header
  - `--surface-3` (`#242429`): Attached dropdown, select menu, and popover surface
  - `--surface-4` (`#2A2A30`): Blocking modal dialog and slide-over drawer surface

## 4. Navigation Links

- [Design Values](./specifications/values.md)
- [Design Tokens Architecture](./theme/design-tokens.md)
- [Dashboard Workflows](./workflows.md)
- [Best Practices](./best-practices.md)
- [24-Column Grid System](./layout/grid-system.md)
- [Components Overview](./components/overview.md)
- [Reference Theme CSS (`theme.css`)](../templates/shadcn/theme.css)
- [Component Decision Trees](./component-decision-tree.md)
