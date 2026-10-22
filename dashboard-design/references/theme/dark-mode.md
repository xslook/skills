# Dark Theme Specification

Rules for surface elevation inversion, color desaturation, and contrast preservation in dark mode (`[data-theme="dark"]` / `.dark`).

---

## 1. Surface Elevation Model (Higher is Lighter)

Because drop shadows are nearly invisible against dark backgrounds, dark mode expresses physical elevation by progressively lightening the surface token (`--surface-0` through `--surface-4`):

```text
Dark Mode Elevation Hierarchy:
Level 0 (--surface-0 : #09090B)  ──► Base page canvas (deepest background)
   ▼
Level 1 (--surface-1 : #121215)  ──► Cards, data tables, collapsible sidebar
   ▼
Level 2 (--surface-2 : #1C1C20)  ──► Hover highlights, subtle fills, sticky table headers
   ▼
Level 3 (--surface-3 : #242429)  ──► Attached dropdowns, select menus, popovers, date pickers
   ▼
Level 4 (--surface-4 : #2A2A30)  ──► Blocking modal dialogs, slide-over drawers, tooltips
```

---

## 2. Color Desaturation & Text Contrast Rules

1. **Desaturation Rule**: Fully saturated status colors glare against dark surfaces. Dark mode status tokens (`--success: #15803d`, `--warning: #b45309`, `--destructive: #7f1d1d`, `--info: #1d4ed8`) reduce saturation and pair with deep tinted backgrounds (`--success-bg: #052e16`, `--warning-bg: #451a03`, `--info-bg: #172554`).
2. **Text Contrast Hierarchy**:
   - **Primary Text (`--text-0` / `--foreground`)**: `#FAFAFA` (avoids harsh `#FFFFFF` halation while maintaining >15:1 contrast).
   - **Secondary Text (`--text-1` / `--muted-foreground`)**: `#A1A1AA` (subtitles, table headers, metadata).
   - **Tertiary Text (`--text-2`)**: `#71717A` (captions, placeholders, keyboard shortcut hints).
   - **Disabled Text (`--text-3`)**: `#52525B` (disabled controls).
3. **Border Definition**:
   - Always pair elevated dark surfaces with a `1px solid var(--border)` (`#27272A`) boundary so containers remain crisp even on low-contrast monitors.

---

## 3. Dark Theme CSS Custom Properties

```css
[data-theme="dark"],
.dark {
  --background: #09090b;
  --foreground: #fafafa;

  --surface-0: #09090b;
  --surface-1: #121215;
  --surface-2: #1c1c20;
  --surface-3: #242429;
  --surface-4: #2a2a30;

  --text-0: #fafafa;
  --text-1: #a1a1aa;
  --text-2: #71717a;
  --text-3: #52525b;

  --card: #121215;
  --card-foreground: #fafafa;
  --popover: #242429;
  --popover-foreground: #fafafa;

  --primary: #fafafa;
  --primary-foreground: #18181b;
  --primary-hover: #e4e4e7;
  --primary-active: #d4d4d8;

  --secondary: #27272a;
  --secondary-foreground: #fafafa;
  --muted: #27272a;
  --muted-foreground: #a1a1aa;

  --border: #27272a;
  --border-secondary: #18181b;
  --input: #27272a;
  --ring: #fafafa;
}
```
