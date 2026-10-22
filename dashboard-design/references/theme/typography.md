# Typography Specification

The typography system establishes a mathematical type scale anchored on a `14px` base body size (`--font-size-sm`) with proportional line heights optimized for dense enterprise scanning.

---

## 1. Font Family Cascade

```css
/* Standard UI Sans-Serif Font Family */
--font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';

/* Monospace & Code Font Family */
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
```

---

## 2. Type Scale & Line-Height Matrix

| Semantic Role | CSS Token | Font Size | Line Height | Ratio | Typical Dashboard Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display LG** | `--font-size-4xl` | `36px` | `44px` (`1.22`) | 1.22 | Hero KPI counters, executive summary figures |
| **Headline LG (H1)** | `--font-size-3xl` | `30px` | `38px` (`1.27`) | 1.27 | Top-level page titles |
| **Headline MD (H2)** | `--font-size-2xl` | `24px` | `32px` (`1.33`) | 1.33 | Section headers, `.stat-card-title` KPI metrics |
| **Headline SM (H3)** | `--font-size-xl` | `20px` | `28px` (`1.40`) | 1.40 | `.card-title`, drawer titles |
| **Title LG (H4)** | `--font-size-lg` | `18px` | `26px` (`1.44`) | 1.44 | `.dialog-title`, modal headers |
| **Body LG / Sub-header** | `--font-size-base` | `16px` | `24px` (`1.50`) | 1.50 | Sub-card group titles, large (`lg`) form controls |
| **Body MD (Default Base)** | `--font-size-sm` | **`14px`** | **`22px` (`1.57`)** | **1.57** | **Default UI text**: tables, inputs, buttons, menus |
| **Body SM / Caption** | `--font-size-xs` | `12px` | `20px` (`1.67`) | 1.67 | Badges, helper hints, validation errors, timestamps |
| **Code / Monospace** | `--font-mono` | `13px` | `20px` (`1.54`) | 1.54 | Commit hashes, resource IDs, API keys, log lines |

---

## 3. Font Weights

- **Regular (`400` / `--font-weight-regular`)**: Default body text, table cell content, input values, secondary descriptions.
- **Medium (`500` / `--font-weight-medium`)**: Button labels, active navigation items, form field labels, table column headers.
- **SemiBold (`600` / `--font-weight-semibold`)**: Card titles, modal headers, section headings (H2–H4), status badges.
- **Bold (`700` / `--font-weight-bold`)**: Reserved strictly for hero KPI metrics (`.stat-card-title`) and top-level display headings (`.heading-1`). Avoid using `700` on body text or table rows.

---

## 4. Tabular Figures (`tabular-nums`)

In all data tables, KPI metric cards, financial columns, timers, and pagination counters, always apply:

```css
font-variant-numeric: tabular-nums;
```

This enforces equal glyph widths across digits (`0`–`9`), ensuring decimals and thousands separators align vertically down columns and preventing horizontal jitter during live telemetry updates.
