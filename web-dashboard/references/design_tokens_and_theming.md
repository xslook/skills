# Design Tokens & Theming Specification

This guide outlines the OKLCH-based design token architecture, theme customization guidelines, and flash-free dark mode implementation.

---

## 1. OKLCH Color Space & Design Tokens

Modern shadcn designs use the **OKLCH** color space (`oklch(L C H)`), which provides perceptually uniform lightness, wider gamut representation, and superior color mixing over legacy RGB/HSL formats.

### 1.1 Complete Token Reference Table

| Token Variable | Semantic Purpose | Light Mode Value (Neutral) | Dark Mode Value (Neutral) |
| :--- | :--- | :--- | :--- |
| `--background` | Base page canvas background | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--foreground` | Default page typography | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--card` | Surface background for cards, tables, panels | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--card-foreground` | Typography on card surfaces | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--popover` | Surface background for dropdowns, tooltips | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--popover-foreground` | Typography in popovers & dropdowns | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--primary` | Main interactive brand color (CTA buttons) | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--primary-foreground`| Text on primary buttons | `oklch(0.985 0 0)` | `oklch(0.205 0 0)` |
| `--secondary` | Subtle interactive button background | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--secondary-foreground`| Text on secondary elements | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--muted` | Subdued backgrounds (table headers, tab track)| `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--muted-foreground` | Secondary helper text & placeholder text | `oklch(0.556 0 0)` | `oklch(0.708 0 0)` |
| `--accent` | Hover state background on list items / buttons | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--accent-foreground` | Text on active / hovered list items | `oklch(0.205 0 0)` | `oklch(0.985 0 0)` |
| `--destructive` | Dangerous actions (delete, error badges) | `oklch(0.577 0.245 27.325)` | `oklch(0.45 0.18 27.3)` |
| `--destructive-foreground`| Text on destructive buttons | `oklch(0.985 0 0)` | `oklch(0.985 0 0)` |
| `--border` | Card, table, and separator borders | `oklch(0.922 0 0)` | `oklch(0.269 0 0)` |
| `--input` | Border color for inputs, selects, switches | `oklch(0.922 0 0)` | `oklch(0.269 0 0)` |
| `--ring` | Focus ring indicator color | `oklch(0.708 0 0)` | `oklch(0.439 0 0)` |

### 1.2 Dedicated Sidebar Tokens
The application shell uses dedicated tokens to support independent sidebar theming:
- `--sidebar`: Background of the navigation sidebar panel.
- `--sidebar-foreground`: Text and icon color inside the sidebar.
- `--sidebar-primary`: Highlight background for the active team/brand mark.
- `--sidebar-accent`: Hover background for sidebar menu buttons.
- `--sidebar-border`: Divider border between sidebar and the inset main area.

### 1.3 Chart Palette Tokens
Standard 5-color analytical chart scale:
- `--chart-1`: Primary series (Area fill, primary bars).
- `--chart-2`: Secondary comparison series.
- `--chart-3`: Tertiary data series.
- `--chart-4`: Quaternary data series.
- `--chart-5`: Quinary data series.

---

## 2. Radius & Typography Scale

```css
:root {
  --radius: 0.625rem; /* Base radius: 10px */
  --radius-sm: calc(var(--radius) - 4px); /* 6px: Checkboxes, badges, micro buttons */
  --radius-md: calc(var(--radius) - 2px); /* 8px: Standard buttons, text inputs */
  --radius-lg: var(--radius);              /* 10px: Cards, data tables, dialogs */
  --radius-xl: calc(var(--radius) + 4px); /* 14px: Inset dashboard outer shells */

  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
```

---

## 3. Dark Mode & Zero Flash of Unstyled Content (FOUC)

A common issue in SPAs is the "dark mode flash" on initial page load caused by waiting for client JavaScript to read `localStorage`.

### 3.1 Dual Storage Strategy (Cookie + LocalStorage)
1. When the user toggles theme via `core/theme.js`:
   - It sets `localStorage.setItem('theme', next)`.
   - It also sets a persistent cookie: `theme=dark; Path=/; Max-Age=31536000; SameSite=Lax`.
2. When the Go or Rust server receives an HTTP request:
   - It reads the `theme` cookie value.
   - If `theme == "dark"`, the server immediately renders:
     ```html
     <html lang="en" class="dark">
     ```
   - The browser receives pre-styled dark mode HTML. First Contentful Paint (FCP) occurs with **zero flash**.

### 3.2 Client Script Pre-Paint Fallback
In `layouts/base.html`, include this synchronous script tag with the per-request CSP nonce to handle users whose cookies were cleared:
```html
<script nonce="{{ .Nonce }}">
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
</script>
```

---

## 4. Theme Customization Guide

### 4.1 Applying a Brand Color (e.g., Violet / Indigo)
To customize your dashboard's primary brand color without breaking neutral dark/light surfaces, override only `--primary` and `--chart-1` in `:root`:

```css
:root {
  /* Brand Primary CTA (Indigo) */
  --primary: oklch(0.51 0.24 275.5);
  --primary-foreground: oklch(0.985 0 0);

  /* Primary Analytics Chart (matches brand) */
  --chart-1: oklch(0.51 0.24 275.5);
}

.dark {
  /* Dark mode Primary CTA (Vibrant Indigo) */
  --primary: oklch(0.65 0.22 275.5);
  --primary-foreground: oklch(0.145 0 0);
}
```

### 4.2 Switching Base Palettes (e.g., Neutral to Zinc)
To switch to a cooler "Zinc" tone, replace the base neutrals in `tokens.css`:
- Light `--background`: `oklch(1 0 0)`
- Light `--muted`: `oklch(0.96 0.005 264)`
- Light `--border`: `oklch(0.91 0.005 264)`
- Dark `--background`: `oklch(0.14 0.005 264)`
- Dark `--card`: `oklch(0.14 0.005 264)`
- Dark `--border`: `oklch(0.25 0.005 264)`
