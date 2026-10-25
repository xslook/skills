# Component Catalog & Markup Contracts

This reference documents the canonical HTML structure, class names, states, and accessibility attributes for each shadcn-style component in the native web design system.

---

## 1. Button

```html
<!-- Primary Button -->
<button type="button" class="btn btn-primary">Save Changes</button>

<!-- Secondary Button -->
<button type="button" class="btn btn-secondary">Secondary Action</button>

<!-- Outline Button -->
<button type="button" class="btn btn-outline">Cancel</button>

<!-- Ghost Button -->
<button type="button" class="btn btn-ghost">Dismiss</button>

<!-- Destructive Button -->
<button type="button" class="btn btn-destructive">Delete Database</button>

<!-- Sizes -->
<button type="button" class="btn btn-primary btn-xs">Extra Small</button>
<button type="button" class="btn btn-primary btn-sm">Small</button>
<button type="button" class="btn btn-primary btn-lg">Large</button>

<!-- Icon Only Button -->
<button type="button" class="btn btn-ghost btn-icon btn-sm" aria-label="Settings">
  <svg class="icon"><use href="/static/icons/sprite.svg#settings"/></svg>
</button>

<!-- Disabled State -->
<button type="button" class="btn btn-primary" disabled aria-disabled="true">Processing...</button>
```

---

## 2. Badge

```html
<!-- Default Primary Badge -->
<span class="badge">Active</span>

<!-- Secondary Badge -->
<span class="badge badge-secondary">Draft</span>

<!-- Outline Badge -->
<span class="badge badge-outline">v2.4.0</span>

<!-- Status Badges -->
<span class="badge badge-success">Completed</span>
<span class="badge badge-warning">Review Needed</span>
<span class="badge badge-destructive">Failed</span>
```

---

## 3. Card & Section KPI Metric Card

### 3.1 Standard Content Card
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Project Overview</h3>
    <p class="card-description">Summary of active infrastructure nodes.</p>
  </div>
  <div class="card-content">
    <p class="text-sm">Main body content goes here.</p>
  </div>
  <div class="card-footer">
    <button type="button" class="btn btn-primary btn-sm">Manage</button>
  </div>
</div>
```

### 3.2 Section KPI Metric Card (dashboard-01 style)
```html
<div class="card card-metric">
  <div class="card-metric-title">
    <span>Total Revenue</span>
    <svg class="icon text-muted"><use href="/static/icons/sprite.svg#credit-card"/></svg>
  </div>
  <div class="card-metric-value">$45,231.89</div>
  <div class="card-metric-delta positive">
    <svg class="icon"><use href="/static/icons/sprite.svg#trending-up"/></svg>
    <span>+20.1% from last month</span>
  </div>
</div>
```

---

## 4. Form Controls

```html
<!-- Input with Label and Helper Text -->
<div class="form-item">
  <label class="label" for="user-email">Email Address</label>
  <input type="email" id="user-email" name="email" class="input" placeholder="alice@example.com" required>
  <span class="form-description">Enter your corporate email.</span>
</div>

<!-- Input with Leading Icon -->
<div class="input-icon-group">
  <svg class="icon"><use href="/static/icons/sprite.svg#search"/></svg>
  <input type="search" class="input input-sm" placeholder="Search entries...">
</div>

<!-- Select Control -->
<div class="form-item">
  <label class="label" for="user-role">Role</label>
  <select id="user-role" name="role" class="select">
    <option value="member">Member</option>
    <option value="admin">Administrator</option>
  </select>
</div>

<!-- Checkbox -->
<label class="flex items-center gap-2 cursor-pointer text-sm font-medium">
  <input type="checkbox" name="notify" class="checkbox" checked>
  <span>Receive deployment alerts</span>
</label>

<!-- Switch -->
<label class="flex items-center gap-2 cursor-pointer text-sm font-medium">
  <div class="switch">
    <input type="checkbox" name="maintenance_mode">
    <span class="switch-thumb"></span>
  </div>
  <span>Maintenance Mode</span>
</label>

<!-- Field Validation Error -->
<div class="form-item">
  <label class="label" for="username">Username</label>
  <input type="text" id="username" class="input" aria-invalid="true">
  <span class="form-error">Username is already taken.</span>
</div>
```

---

## 5. Native Modal Dialog (`<dialog>`)

Uses native HTML5 `<dialog>` for zero-dependency focus trapping and accessibility:

```html
<!-- Trigger Button -->
<button type="button" class="btn btn-primary" data-action="open-dialog" data-target="user-dialog">
  Add User
</button>

<!-- Dialog Element -->
<dialog id="user-dialog" class="dialog">
  <div class="dialog-content">
    <div class="dialog-header">
      <h3 class="card-title">Add New User</h3>
      <p class="card-description">Create an access profile for a team member.</p>
      <button type="button" class="dialog-close btn-ghost" data-action="close-dialog" aria-label="Close">✕</button>
    </div>
    <form method="dialog">
      <div class="dialog-body space-y-4">
        <div class="form-item">
          <label class="label" for="new-email">Email</label>
          <input type="email" id="new-email" class="input" required>
        </div>
      </div>
      <div class="dialog-footer">
        <button type="button" class="btn btn-outline btn-sm" data-action="close-dialog">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm">Submit</button>
      </div>
    </form>
  </div>
</dialog>
```

---

## 6. Side Sheet / Drawer (`<dialog class="sheet">`)

```html
<dialog id="inspector-sheet" class="sheet" data-side="right">
  <div class="sheet-content">
    <div class="sheet-header">
      <h3 class="card-title">Resource Inspector</h3>
      <p class="card-description">Inspect real-time telemetry metrics.</p>
      <button type="button" class="dialog-close btn-ghost" data-action="close-dialog" aria-label="Close">✕</button>
    </div>
    <div class="sheet-body">
      <p class="text-sm">Detailed drawer content goes here.</p>
    </div>
    <div class="sheet-footer">
      <button type="button" class="btn btn-outline btn-sm" data-action="close-dialog">Close</button>
    </div>
  </div>
</dialog>
```

---

## 7. Tabs

```html
<div class="tabs">
  <div class="tabs-list" role="tablist">
    <button type="button" class="tabs-trigger active" role="tab" aria-selected="true">Overview</button>
    <button type="button" class="tabs-trigger" role="tab" aria-selected="false">Analytics</button>
    <button type="button" class="tabs-trigger" role="tab" aria-selected="false">Settings</button>
  </div>
  <div class="tabs-content" role="tabpanel">
    <!-- Active tab content -->
  </div>
</div>
```

---

## 8. Tooltip

Pure CSS tooltip via data attributes:
```html
<button type="button" class="btn btn-outline btn-icon" data-tooltip="Refresh Metrics" data-tooltip-side="right">
  <svg class="icon"><use href="/static/icons/sprite.svg#chart-bar"/></svg>
</button>
```

---

## 9. Empty State

```html
<div class="empty-state">
  <div class="empty-state-icon">
    <svg class="icon"><use href="/static/icons/sprite.svg#database"/></svg>
  </div>
  <div class="empty-state-title">No Databases Connected</div>
  <div class="empty-state-description">Get started by connecting your first PostgreSQL or SQLite cluster.</div>
  <div class="empty-state-action">
    <button type="button" class="btn btn-primary btn-sm">Connect Database</button>
  </div>
</div>
```

---

## 10. Avatar

```html
<!-- With Image -->
<div class="avatar avatar-md">
  <img src="/static/img/avatar.png" alt="User avatar">
</div>

<!-- With Fallback Initials -->
<div class="avatar avatar-sm">
  <span class="avatar-fallback">JD</span>
</div>
```
