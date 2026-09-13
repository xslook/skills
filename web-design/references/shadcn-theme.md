# shadcn/ui Theme Integration Guide

Step-by-step instructions for implementing the shadcn/ui-styled theme using standard HTML5, CSS, and JavaScript without external framework dependencies.

---

## 1. Quick Integration Steps

### Step 1: Link Token Stylesheet
Add `theme/shadcn/theme.css` to define all `:root` CSS custom properties, light mode, and dark mode variants:

```html
<link rel="stylesheet" href="./theme/shadcn/theme.css">
```

### Step 2: Link Component Stylesheet
Add `theme/shadcn/components.css` to apply standardized typography, buttons, inputs, cards, dialogs, alerts, and table styles:

```html
<link rel="stylesheet" href="./theme/shadcn/components.css">
```

### Step 3: Initialize Theme Controller
Include `theme/shadcn/theme.js` to manage dark mode switching, OS preference synchronization, and runtime token overrides:

```html
<script src="./theme/shadcn/theme.js"></script>
<script>
  ThemeManager.initTheme({ defaultTheme: 'auto', syncWithSystem: true });
</script>
```

---

## 2. Token Alignment Reference

| Semantic Role | Light Value | Dark Value | CSS Custom Property | Usage Example |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas Background** | `#FFFFFF` | `#09090B` | `--background` | `background-color: var(--background);` |
| **Foreground Text** | `#09090B` | `#FAFAFA` | `--foreground` | `color: var(--foreground);` |
| **Card Surface** | `#FFFFFF` | `#09090B` | `--card` | `background-color: var(--card);` |
| **Primary Action** | `#18181B` | `#FAFAFA` | `--primary` | `background-color: var(--primary);` |
| **Primary Foreground**| `#FAFAFA` | `#18181B` | `--primary-foreground` | `color: var(--primary-foreground);` |
| **Secondary Fill** | `#F4F4F5` | `#27272A` | `--secondary` | `background-color: var(--secondary);` |
| **Muted Text** | `#71717A` | `#A1A1AA` | `--muted-foreground` | `color: var(--muted-foreground);` |
| **Destructive / Error**| `#EF4444` | `#7F1D1D` | `--destructive` | `color: var(--destructive);` |
| **Success** | `#16A34A` | `#15803D` | `--success` | `border-color: var(--success);` |
| **Warning** | `#F59E0B` | `#B45309` | `--warning` | `background-color: var(--warning-bg);` |
| **Border** | `#E4E4E7` | `#27272A` | `--border` | `border: 1px solid var(--border);` |
| **Base Radius** | `6px` | `6px` | `--radius` | `border-radius: var(--radius);` |
| **Large Radius** | `12px` | `12px` | `--radius-lg` | `border-radius: var(--radius-lg);` |
| **Control Height** | `36px` | `36px` | `--control-height` | `height: var(--control-height);` |
| **Small Height** | `32px` | `32px` | `--control-height-sm` | `height: var(--control-height-sm);` |
| **Large Height** | `40px` | `40px` | `--control-height-lg` | `height: var(--control-height-lg);` |
| **Surface Shadow** | Layered | Diffuse | `--shadow-sm` | `box-shadow: var(--shadow-sm);` |

---

## 3. Interaction State Handling in Native CSS

Rely on standard CSS pseudo-classes without JavaScript state overhead:

```css
/* Focus Ring */
.interactive-element:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

/* Disabled State */
.interactive-element:disabled,
.interactive-element[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.5;
}
```
