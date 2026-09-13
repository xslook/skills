# Typography Specification

The typography system establishes a mathematical type scale based on a 14px base size and proportional line-height ratios.

---

## 1. Font Family Cascade

```css
/* Standard Text Font Family */
--font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';

/* Monospace & Tabular Data Font Family */
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
```

---

## 2. Type Scale & Line-Height Matrix

| Role | Font Size | Line Height | Ratio | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display LG** | `38px` | `46px` | 1.21 | Hero metric values, welcome banner titles |
| **Headline LG (H1)** | `30px` | `38px` | 1.27 | Page-level top titles |
| **Headline MD (H2)** | `24px` | `32px` | 1.33 | Section and primary card titles |
| **Headline SM (H3)** | `20px` | `28px` | 1.40 | Modal dialog titles, drawer titles |
| **Title LG (H4)** | `16px` | `24px` | 1.50 | Sub-card headers, form group headers |
| **Title MD (H5)** | `14px` | `22px` | 1.57 | Standard bold titles, table headers |
| **Body LG** | `16px` | `24px` | 1.50 | Large body text, highlighted notifications |
| **Body MD (Base)** | **14px** | **22px** | **1.57** | **Standard body**, input fields, buttons, tables |
| **Body SM** | `12px` | `20px` | 1.67 | Helper text, validation errors, timestamps, tooltips |
| **Code** | `13px` | `20px` | 1.54 | Inline code, tokens, API properties |

---

## 3. Font Weights

- **Regular (400)**: Default body text, form input content, secondary descriptions.
- **Medium (500)**: Active tabs, selected menu items, table row labels.
- **SemiBold (600)**: Headings (H1 - H5), modal titles, table header columns.
- *Avoid weights ≥ 700 to prevent excessive visual density.*

---

## 4. Tabular Figures

In all data tables, statistics cards, and financial columns, apply:

```css
font-variant-numeric: tabular-nums;
```

This enforces monospaced numeric glyphs so decimals and digits align vertically across rows.
