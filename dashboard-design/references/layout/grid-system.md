# Grid System & Responsive Layout

The layout system divides page width using a **24-column grid** and **6 responsive breakpoints**.

---

## 1. 24-Column Grid Rules

- **Divisibility**: 24 columns allow integer splits into 1/2 (12 cols), 1/3 (8 cols), 1/4 (6 cols), and 1/6 (4 cols).
- **Columns vs. Gutters**:
  - **Column**: Fluid width that stretches with viewport resizing.
  - **Gutter**: Fixed-pixel horizontal spacing between columns (`16px` or `24px`).
  - Blocks must span an integer number of columns and must not bleed across gutter boundaries.

---

## 2. Responsive Breakpoints

| Breakpoint | Minimum Width | Device Context | Recommended Gutter | Column Span Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **xs** | `< 576px` | Mobile Portrait | `8px` | Single column full width (`span: 24`) |
| **sm** | `≥ 576px` | Mobile Landscape / Mini Tablet | `16px` | Dual columns (`span: 12`) |
| **md** | `≥ 768px` | Tablet Portrait / Narrow Desktop | `16px` | 2 to 3 columns (`span: 12` or `span: 8`) |
| **lg** | `≥ 992px` | Standard Laptops (1280px / 1366px) | `24px` | 3 to 4 columns (`span: 8` or `span: 6`) |
| **xl** | `≥ 1200px` | Desktop Displays (1440px) | `24px` | 4 columns (`span: 6`) standard workbench |
| **xxl** | `≥ 1600px` | Wide Displays (1920px+) | `32px` | 4 to 6 columns (`span: 6` or `span: 4`) with max-width container |

---

## 3. Standard Layout Modes

### Left-Right Layout (Fixed Sider, Fluid Body)
- Sider width: Fixed at `208px` (expanded) or `80px` (collapsed).
- Main content: Fluid flex box (`flex: 1`) taking remaining width.

### Top-Bottom Layout (Centered Content)
- Navigation bar: 100% full-width header.
- Main content: Centered container with a maximum content constraint (`max-width: 1200px` or `1440px`, `margin: 0 auto`).
