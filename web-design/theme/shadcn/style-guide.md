# Web Design System - shadcn/ui Style Guide

Implementation guide for building modern, high-contrast web interfaces inspired by shadcn/ui using standard CSS and JavaScript.

---

## 1. Quick Start

Link `theme.css`, `components.css`, and `theme.js` in your HTML document:

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern Web Application</title>
  <!-- 1. Theme Tokens (Colors, Radii, Shadows, Fonts) -->
  <link rel="stylesheet" href="./theme/shadcn/theme.css">
  <!-- 2. Component Primitives -->
  <link rel="stylesheet" href="./theme/shadcn/components.css">
</head>
<body>
  <!-- Application Layout -->
  
  <!-- 3. Theme Controller -->
  <script src="./theme/shadcn/theme.js"></script>
  <script>
    // Initialize theme with OS system sync and localStorage persistence
    ThemeManager.initTheme({ defaultTheme: 'auto', syncWithSystem: true });
  </script>
</body>
</html>
```

---

## 2. Component Primitives

### Buttons
```html
<!-- Primary / Default Button (Sleek solid dark) -->
<button class="btn btn-primary">Primary Action</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Secondary Action</button>

<!-- Outline Button -->
<button class="btn btn-outline">Outline Action</button>

<!-- Ghost Button -->
<button class="btn btn-ghost">Ghost</button>

<!-- Link Button -->
<button class="btn btn-link">Link</button>

<!-- Destructive Button -->
<button class="btn btn-destructive">Delete Item</button>

<!-- Sizing -->
<button class="btn btn-primary btn-sm">Small (32px)</button>
<button class="btn btn-primary">Default (36px)</button>
<button class="btn btn-primary btn-lg">Large (40px)</button>

<!-- Disabled -->
<button class="btn btn-primary" disabled>Disabled</button>
```

### Form Inputs
```html
<!-- Basic Input -->
<input type="text" class="input" placeholder="Enter your email...">

<!-- Input with Affix / Icons -->
<div class="input-wrapper">
  <span class="input-prefix">🔍</span>
  <input type="text" class="input" placeholder="Search resources...">
  <span class="input-suffix text-muted text-xs">⌘K</span>
</div>

<!-- Validation Error -->
<input type="text" class="input input-error" value="invalid-email">
```

### Card Container
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Project Overview</h3>
    <p class="card-description">Manage and monitor project deployments and health metrics.</p>
  </div>
  <div class="card-content">
    <p class="text-sm">Detailed telemetry and team activity data.</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-outline btn-sm">View Analytics</button>
    <button class="btn btn-primary btn-sm">Deploy Now</button>
  </div>
</div>
```

### Dialog / Modal
```html
<!-- Backdrop Overlay -->
<div class="dialog-overlay" id="dialog-mask" style="display: none;"></div>

<!-- Dialog Box -->
<div class="dialog-content" id="dialog-box" style="display: none;" role="dialog" aria-modal="true">
  <button class="dialog-close" onclick="closeDialog()">✕</button>
  <div class="dialog-header">
    <h2 class="dialog-title">Edit Profile</h2>
    <p class="dialog-description">Update your public account information here.</p>
  </div>
  <div class="card-content" style="padding: 1rem 0;">
    <input type="text" class="input" value="Jane Doe">
  </div>
  <div class="dialog-footer">
    <button class="btn btn-outline" onclick="closeDialog()">Cancel</button>
    <button class="btn btn-primary" onclick="saveProfile()">Save Changes</button>
  </div>
</div>
```

### Alert Callouts
```html
<div class="alert alert-info">
  <div>
    <div class="alert-title">Heads Up!</div>
    <div class="alert-description">You can add components without configuring Tailwind.</div>
  </div>
</div>

<div class="alert alert-destructive">
  <div>
    <div class="alert-title">Authentication Failed</div>
    <div class="alert-description">Your session has expired. Please sign in again.</div>
  </div>
</div>
```

### Badges
```html
<span class="badge badge-default">New Feature</span>
<span class="badge badge-secondary">In Review</span>
<span class="badge badge-outline">Draft</span>
<span class="badge badge-destructive">Critical</span>
<span class="badge badge-success">Operational</span>
```

### Data Table
```html
<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th>Invoice</th>
        <th>Status</th>
        <th>Method</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>INV001</td>
        <td><span class="badge badge-success">Paid</span></td>
        <td>Credit Card</td>
        <td style="text-align: right;">$250.00</td>
      </tr>
      <tr>
        <td>INV002</td>
        <td><span class="badge badge-secondary">Pending</span></td>
        <td>PayPal</td>
        <td style="text-align: right;">$150.00</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 3. Theme & Token Manipulation via JavaScript

```javascript
// Toggle between light and dark themes
document.getElementById('toggle-btn').addEventListener('click', () => {
  const activeTheme = ThemeManager.toggleTheme();
  console.log(`Current theme: ${activeTheme}`);
});

// Explicit mode setting
ThemeManager.setTheme('dark');  // Enables dark theme
ThemeManager.setTheme('light'); // Enables light theme
ThemeManager.setTheme('auto');  // Auto-syncs with OS dark mode

// Dynamic CSS Custom Property overrides
ThemeManager.setToken('primary', '#2563eb');     // Blue primary
ThemeManager.setToken('radius', '12px');         // Softer border radii

// Listen to theme changes
ThemeManager.onThemeChange(({ mode, theme }) => {
  console.log(`Theme updated to ${theme} (mode: ${mode})`);
});
```
