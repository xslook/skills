# Enterprise Data Formatting Specification

Standards for formatting numbers, currencies, dates, sensitive data, and fallbacks across enterprise interfaces.

---

## 1. Numbers & Metrics

- **Thousands Separators**: Use comma grouping for numbers with 4 or more digits: `1,234,567.89`.
- **Decimal Precision**: Maintain consistent decimal places within the same column or card (e.g., always 2 decimal places: `12.50`, not `12.5`).
- **Tabular Figures**: Apply `font-variant-numeric: tabular-nums` to ensure equal character widths and vertical decimal alignment in tables.
- **Column Alignment**: Left-align text. Right-align numeric amounts and currency values.

---

## 2. Currency

- **Symbol Placement**: Place currency symbols directly before the value with no space: `$1,299.00` or `¥1,299.00`.
- **Multi-Currency Clarity**: In multi-currency applications, prefix the ISO 4217 code: `USD 1,299.00`, `EUR 850.00`.
- **Compact Metric Notation**: In dashboard metric cards, abbreviate large numbers (`12.4K`, `3.5M`, `1.2B`) and provide the exact unrounded value in a tooltip.

---

## 3. Date & Time

- **Full Timestamp**: `YYYY-MM-DD HH:mm:ss` (e.g., `2026-09-13 14:30:00`).
- **Date Only**: `YYYY-MM-DD` (e.g., `2026-09-13`).
- **Time Only**: `HH:mm:ss` (24-hour clock, e.g., `14:30:00`).
- **Date Ranges**: Separate with a tilde and spaces: `2026-01-01 ～ 2026-01-31`.
- **Relative Dates**: Use relative timestamps ("Just now", "5 mins ago", "Yesterday") for recent events (< 7 days), then degrade to absolute dates.

---

## 4. Sensitive Data Masking

Mask sensitive personally identifiable information (PII) by default, offering an unlock/reveal toggle where permitted:

| Data Type | Masking Rule | Example |
| :--- | :--- | :--- |
| **Phone Number** | Retain first 3 and last 4 digits; mask middle 4 digits | `138****1234` |
| **ID / Passport** | Retain first 4 and last 4 characters; mask middle characters | `330106********1234` |
| **Credit / Debit Card**| Retain last 4 digits; mask preceding blocks | `**** **** **** 1234` |
| **Email Address** | Retain first character and domain; mask preceding local part | `z***@example.com` |
| **Passwords / Keys** | Mask completely with dots | `••••••••` |

---

## 5. Fallback & Empty Values

- **Prohibited Placeholders**: Never display raw `null`, `undefined`, `NaN`, `None`, or blank empty cells.
- **Standard Fallback**: Use an en-dash `-` or `N/A` for missing, unpopulated, or non-applicable values.
- **Visual Weight**: Render fallback characters in muted text color (`on-surface-tertiary` or `on-surface-disabled`).
