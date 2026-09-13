# Dark Theme Specification

Rules for color derivation, surface elevation inversion, and contrast preservation in dark mode.

---

## 1. Surface Elevation Model (Higher is Lighter)

Because drop shadows are nearly invisible against dark backgrounds, dark mode indicates physical elevation by lightening the surface tone:

```text
Elevation Hierarchy:
Level 0 (Canvas BgLayout)   : #141414 (deepest background)
     ▼
Level 1 (Card BgContainer)  : #1f1f1f (card and container surface)
     ▼
Level 2 (Popup BgElevated)  : #262626 (dropdowns, popovers, date pickers)
     ▼
Level 3 (Modal BgSpotlight) : #303030 (highest priority dialogs, tooltips)
```

---

## 2. Color Desaturation & Inverted Neutral Matrix

1. **Desaturation Rule**: Saturated brand colors glare against black surfaces. Reduce saturation by 10%–20% and increase lightness slightly for dark mode status tokens.
2. **Text Contrast (White Opacity)**:
   - Primary Headings & Text: `rgba(255, 255, 255, 0.85)` (avoid 100% pure `#FFFFFF` to reduce eye strain).
   - Secondary Body Text: `rgba(255, 255, 255, 0.65)`.
   - Tertiary Text & Icons: `rgba(255, 255, 255, 0.45)`.
   - Disabled Text & Placeholders: `rgba(255, 255, 255, 0.30)`.
   - Borders: `#424242` (primary borders), `#303030` (secondary split lines).

---

## 3. Dark Theme CSS Tokens

```css
[data-theme='dark'],
.dark {
  --background: #09090b;
  --foreground: #fafafa;
  --card: #09090b;
  --card-foreground: #fafafa;
  --popover: #09090b;
  --popover-foreground: #fafafa;

  --muted: #27272a;
  --muted-foreground: #a1a1aa;

  --border: #27272a;
  --border-secondary: #18181b;

  --primary: #fafafa;
  --primary-foreground: #18181b;
  --primary-hover: #e4e4e7;
  --primary-active: #d4d4d8;
}
```
