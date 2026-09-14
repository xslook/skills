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

---

## 4. Complete Dashboard Layout Boilerplate

Full page workspace layout featuring a collapsible inset sidebar, sticky header, 4 metric KPI cards, time-filter chart card, and actionable data table with zero external framework dependencies:

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard - shadcn/ui Style</title>
  <link rel="stylesheet" href="./theme.css">
  <link rel="stylesheet" href="./components.css">
</head>
<body>
  <!-- Root Sidebar Wrapper -->
  <div class="sidebar-wrapper">
    
    <!-- Collapsible Inset Sidebar -->
    <aside class="sidebar" id="app-sidebar" data-collapsed="false">
      <!-- Workspace Brand Header -->
      <div class="sidebar-header">
        <ul class="sidebar-menu">
          <li class="sidebar-menu-item">
            <a href="#" class="sidebar-menu-button" style="font-weight: 600; font-size: 15px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5.636 5.636a9 9 0 1 0 12.728 12.728a9 9 0 0 0 -12.728 -12.728z"></path>
                <path d="M16.243 7.757a6 6 0 0 0 -8.486 0"></path>
              </svg>
              <span>Acme Inc.</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Scrollable Navigation Content -->
      <div class="sidebar-content">
        <!-- Quick Create Action -->
        <div class="sidebar-group">
          <ul class="sidebar-menu">
            <li class="sidebar-menu-item" style="display: flex; gap: 0.375rem;">
              <button class="btn btn-primary btn-sm" style="flex: 1; justify-content: flex-start;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 11h3a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-3H8a1 1 0 0 1 0-2h3V8a1 1 0 0 1 2 0z"/>
                </svg>
                <span>Quick Create</span>
              </button>
              <button class="btn btn-outline btn-icon btn-sm" title="Inbox">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                  <polyline points="3 9 12 15 21 9"></polyline>
                </svg>
              </button>
            </li>
          </ul>
        </div>

        <!-- Primary Navigation Links -->
        <div class="sidebar-group">
          <ul class="sidebar-menu">
            <li class="sidebar-menu-item">
              <a href="#" class="sidebar-menu-button active">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="9" rx="1"></rect>
                  <rect x="14" y="3" width="7" height="5" rx="1"></rect>
                  <rect x="14" y="12" width="7" height="9" rx="1"></rect>
                  <rect x="3" y="16" width="7" height="5" rx="1"></rect>
                </svg>
                <span>Dashboard</span>
              </a>
            </li>
            <li class="sidebar-menu-item">
              <a href="#" class="sidebar-menu-button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M13 5h8M13 9h5M13 15h8M13 19h5M3 4h4v4H3zM3 14h4v4H3z"></path>
                </svg>
                <span>Lifecycle</span>
              </a>
            </li>
            <li class="sidebar-menu-item">
              <a href="#" class="sidebar-menu-button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span>Analytics</span>
              </a>
            </li>
            <li class="sidebar-menu-item">
              <a href="#" class="sidebar-menu-button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Projects</span>
              </a>
            </li>
            <li class="sidebar-menu-item">
              <a href="#" class="sidebar-menu-button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Team</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Document Section -->
        <div class="sidebar-group">
          <div class="sidebar-group-label">Documents</div>
          <ul class="sidebar-menu">
            <li class="sidebar-menu-item">
              <a href="#" class="sidebar-menu-button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
                <span>Data Library</span>
              </a>
              <button class="sidebar-menu-action" title="More">•••</button>
            </li>
            <li class="sidebar-menu-item">
              <a href="#" class="sidebar-menu-button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span>Reports</span>
              </a>
              <button class="sidebar-menu-action" title="More">•••</button>
            </li>
          </ul>
        </div>

        <!-- Utility Links (Pushed toward bottom) -->
        <div class="sidebar-group" style="margin-top: auto;">
          <ul class="sidebar-menu">
            <li class="sidebar-menu-item">
              <a href="#" class="sidebar-menu-button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>Settings</span>
              </a>
            </li>
            <li class="sidebar-menu-item">
              <a href="#" class="sidebar-menu-button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <span>Get Help</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- User Profile Footer -->
      <div class="sidebar-footer">
        <button class="sidebar-menu-button" style="height: 2.75rem;">
          <span class="avatar avatar-sm">CN</span>
          <div style="display: flex; flex-direction: column; text-align: left; line-height: 1.2;">
            <span style="font-weight: 500; font-size: 13px;">shadcn</span>
            <span class="text-xs text-muted">m@example.com</span>
          </div>
          <span style="margin-left: auto; color: var(--muted-foreground);">⋮</span>
        </button>
      </div>
    </aside>

    <!-- Inset Content Area -->
    <main class="sidebar-inset">
      <!-- Sticky Top Header -->
      <header class="dashboard-header">
        <div class="header-left">
          <button class="sidebar-trigger" id="toggle-sidebar-btn" aria-label="Toggle Sidebar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </button>
          <span class="separator separator-vertical"></span>
          <h1 class="dashboard-title">Documents</h1>
        </div>

        <div class="header-right">
          <!-- Search Affix Input -->
          <div class="input-wrapper" style="width: 220px; height: 32px;">
            <span class="input-prefix" style="font-size: 13px;">🔍</span>
            <input type="text" class="input input-sm" placeholder="Search...">
            <span class="input-suffix text-muted text-xs">⌘K</span>
          </div>

          <!-- Theme Mode Switcher -->
          <button class="btn btn-outline btn-icon btn-sm" id="toggle-theme-btn" title="Toggle Light/Dark Theme">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>

          <a href="#" class="btn btn-ghost btn-sm">GitHub</a>
        </div>
      </header>

      <!-- Dashboard Body -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem; padding-bottom: 2rem;">
        
        <!-- 1. 4 Metric KPI Cards Grid -->
        <section class="dashboard-grid">
          <!-- Metric 1: Total Revenue -->
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-label">Total Revenue</div>
                <div class="stat-card-title">$1,250.00</div>
              </div>
              <span class="badge badge-outline" style="color: var(--success); border-color: var(--success-border);">
                ↑ +12.5%
              </span>
            </div>
            <div class="stat-card-footer">
              <div class="stat-trend stat-trend-up">Trending up this month ↑</div>
              <div class="text-muted">Visitors for the last 6 months</div>
            </div>
          </div>

          <!-- Metric 2: New Customers -->
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-label">New Customers</div>
                <div class="stat-card-title">1,234</div>
              </div>
              <span class="badge badge-outline" style="color: var(--destructive); border-color: var(--destructive);">
                ↓ -20%
              </span>
            </div>
            <div class="stat-card-footer">
              <div class="stat-trend stat-trend-down">Down 20% this period ↓</div>
              <div class="text-muted">Acquisition needs attention</div>
            </div>
          </div>

          <!-- Metric 3: Active Accounts -->
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-label">Active Accounts</div>
                <div class="stat-card-title">45,678</div>
              </div>
              <span class="badge badge-outline" style="color: var(--success); border-color: var(--success-border);">
                ↑ +12.5%
              </span>
            </div>
            <div class="stat-card-footer">
              <div class="stat-trend stat-trend-up">Strong user retention ↑</div>
              <div class="text-muted">Engagement exceeds targets</div>
            </div>
          </div>

          <!-- Metric 4: Growth Rate -->
          <div class="stat-card">
            <div class="stat-card-header">
              <div>
                <div class="stat-card-label">Growth Rate</div>
                <div class="stat-card-title">4.5%</div>
              </div>
              <span class="badge badge-outline" style="color: var(--success); border-color: var(--success-border);">
                ↑ +4.5%
              </span>
            </div>
            <div class="stat-card-footer">
              <div class="stat-trend stat-trend-up">Steady performance increase ↑</div>
              <div class="text-muted">Meets growth projections</div>
            </div>
          </div>
        </section>

        <!-- 2. Chart Card Section -->
        <section style="padding: 0 1.5rem;">
          <div class="card">
            <div class="card-header" style="flex-direction: row; justify-content: space-between; align-items: center;">
              <div>
                <h3 class="card-title">Total Visitors</h3>
                <p class="card-description">Total traffic and engagement for the selected period</p>
              </div>
              <!-- Segmented Toggle Group -->
              <div class="toggle-group" id="time-filter">
                <button class="toggle-group-item active" data-range="3m">Last 3 months</button>
                <button class="toggle-group-item" data-range="30d">Last 30 days</button>
                <button class="toggle-group-item" data-range="7d">Last 7 days</button>
              </div>
            </div>
            <div class="card-content" style="padding-top: 1rem;">
              <!-- Data Visualization Canvas -->
              <svg viewBox="0 0 800 200" style="width: 100%; height: 200px; overflow: visible;">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="var(--chart-1)" stop-opacity="0.25"/>
                    <stop offset="100%" stop-color="var(--chart-1)" stop-opacity="0.0"/>
                  </linearGradient>
                </defs>
                <!-- Grid lines -->
                <line x1="0" y1="40" x2="800" y2="40" stroke="var(--border)" stroke-dasharray="4 4"/>
                <line x1="0" y1="90" x2="800" y2="90" stroke="var(--border)" stroke-dasharray="4 4"/>
                <line x1="0" y1="140" x2="800" y2="140" stroke="var(--border)" stroke-dasharray="4 4"/>
                <!-- Area fill -->
                <path d="M 0 140 Q 150 110, 250 80 T 500 60 T 800 30 L 800 180 L 0 180 Z" fill="url(#chartGradient)"/>
                <!-- Primary metric line -->
                <path d="M 0 140 Q 150 110, 250 80 T 500 60 T 800 30" fill="none" stroke="var(--chart-1)" stroke-width="2.5"/>
                <!-- Secondary metric line -->
                <path d="M 0 160 Q 150 140, 250 120 T 500 100 T 800 80" fill="none" stroke="var(--chart-2)" stroke-width="2" stroke-dasharray="6 4"/>
              </svg>
            </div>
          </div>
        </section>

        <!-- 3. Production Data Table Section -->
        <section style="padding: 0 1.5rem;">
          <div class="card">
            <!-- Table Toolbar & Navigation Tabs -->
            <div class="table-toolbar">
              <div class="tabs-list">
                <button class="tabs-trigger active">Outline</button>
                <button class="tabs-trigger">Past Performance</button>
                <button class="tabs-trigger">Personnel</button>
              </div>
              <div style="display: flex; gap: 0.5rem; align-items: center;">
                <input type="text" class="input input-sm" placeholder="Filter tasks..." style="width: 200px;">
                <button class="btn btn-outline btn-sm">Export</button>
              </div>
            </div>

            <!-- Table Primitives -->
            <div class="table-container" style="border: none; border-top: 1px solid var(--border); border-radius: 0;">
              <table class="table">
                <thead>
                  <tr>
                    <th style="width: 40px;"><input type="checkbox"></th>
                    <th>Task Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th style="text-align: right;">Target</th>
                    <th style="text-align: right;">Limit</th>
                    <th>Assignee</th>
                    <th style="width: 48px;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><input type="checkbox"></td>
                    <td style="font-weight: 500;"><a href="#" style="color: var(--foreground); text-decoration: none;">Technical approach</a></td>
                    <td><span class="badge badge-outline">Narrative</span></td>
                    <td><span class="badge badge-success">● Done</span></td>
                    <td style="text-align: right; font-variant-numeric: tabular-nums;">27</td>
                    <td style="text-align: right; font-variant-numeric: tabular-nums;">23</td>
                    <td>Jamik Tashpulatov</td>
                    <td><button class="btn btn-ghost btn-icon btn-sm">⋮</button></td>
                  </tr>
                  <tr>
                    <td><input type="checkbox"></td>
                    <td style="font-weight: 500;"><a href="#" style="color: var(--foreground); text-decoration: none;">Design exploration</a></td>
                    <td><span class="badge badge-outline">Narrative</span></td>
                    <td><span class="badge badge-secondary">◌ In Process</span></td>
                    <td style="text-align: right; font-variant-numeric: tabular-nums;">2</td>
                    <td style="text-align: right; font-variant-numeric: tabular-nums;">16</td>
                    <td>Eddie Lake</td>
                    <td><button class="btn btn-ghost btn-icon btn-sm">⋮</button></td>
                  </tr>
                  <tr>
                    <td><input type="checkbox"></td>
                    <td style="font-weight: 500;"><a href="#" style="color: var(--foreground); text-decoration: none;">Integration architecture</a></td>
                    <td><span class="badge badge-outline">Narrative</span></td>
                    <td><span class="badge badge-secondary">◌ In Process</span></td>
                    <td style="text-align: right; font-variant-numeric: tabular-nums;">19</td>
                    <td style="text-align: right; font-variant-numeric: tabular-nums;">21</td>
                    <td>Jamik Tashpulatov</td>
                    <td><button class="btn btn-ghost btn-icon btn-sm">⋮</button></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Table Pagination Summary -->
            <div class="table-pagination">
              <span>Showing 1 to 3 of 32 results</span>
              <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-outline btn-sm" disabled>Previous</button>
                <button class="btn btn-outline btn-sm">Next</button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  </div>

  <!-- Standard JavaScript Controller -->
  <script src="./theme.js"></script>
  <script>
    // 1. Initialize Theme Engine with system preference and storage
    ThemeManager.initTheme({ defaultTheme: 'auto', syncWithSystem: true });
    ThemeManager.initSidebar();

    // 2. Wire Theme Toggle Button
    document.getElementById('toggle-theme-btn').addEventListener('click', () => {
      ThemeManager.toggleTheme();
    });

    // 3. Wire Sidebar Collapse Button
    document.getElementById('toggle-sidebar-btn').addEventListener('click', () => {
      ThemeManager.toggleSidebar();
    });

    // 4. Wire Segmented Time Filter
    document.querySelectorAll('#time-filter .toggle-group-item').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#time-filter .toggle-group-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  </script>
</body>
</html>
```

