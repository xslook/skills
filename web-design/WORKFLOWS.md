# Enterprise Dashboard Workflows

Comprehensive recipes and step-by-step blueprints for implementing common, high-value enterprise dashboard patterns using the web design system.

---

## 1. Data Table with Filtering, Sorting & Selection

### Intent
High-density analytical table supporting multi-column filters, column sorting, batch row selection, and pagination.

### Architectural Anatomy
```text
┌────────────────────────────────────────────────────────────────────────┐
│ Filter Bar: [Search Input] [Status Select] [Date Range]  [Export] [New]│
├────────────────────────────────────────────────────────────────────────┤
│ [ ] | Name ▲▼   | Status       | Role     | Updated   | Actions        │
├────────────────────────────────────────────────────────────────────────┤
│ [x] | John Doe  | [Active]     | Admin    | 2h ago    | Edit · Delete  │
│ [ ] | Jane Smith| [Pending]    | Editor   | 1d ago    | Edit · Delete  │
├────────────────────────────────────────────────────────────────────────┤
│ Total: 48 items                Page [ < 1 2 3 > ]  Show [ 10 / page ▼ ]│
└────────────────────────────────────────────────────────────────────────┘
```

### Implementation Blueprint
```html
<!-- 1. Filter Toolbar -->
<div class="card" style="margin-bottom: 1rem; padding: 1rem;">
  <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; justify-content: space-between;">
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;">
      <div class="input-wrapper" style="width: 240px;">
        <span class="input-prefix">🔍</span>
        <input type="text" class="input" placeholder="Filter by name or email...">
      </div>
      <select class="input" style="width: 140px;">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
    <div style="display: flex; gap: 0.5rem;">
      <button class="btn btn-outline btn-sm">Export CSV</button>
      <button class="btn btn-primary btn-sm">+ Add Member</button>
    </div>
  </div>
</div>

<!-- 2. Data Table Container -->
<div class="table-container">
  <table class="table">
    <thead>
      <tr>
        <th style="width: 40px;"><input type="checkbox" aria-label="Select all rows"></th>
        <th>Name <span style="cursor: pointer; opacity: 0.6;">▲▼</span></th>
        <th>Status</th>
        <th>Role</th>
        <th>Last Active</th>
        <th style="text-align: right;">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><input type="checkbox" checked></td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div class="badge badge-secondary" style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">JD</div>
            <div>
              <div style="font-weight: 500;">John Doe</div>
              <div class="text-muted text-xs">john@example.com</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-success">Active</span></td>
        <td>Admin</td>
        <td class="text-muted text-sm">2 hours ago</td>
        <td style="text-align: right;">
          <button class="btn btn-ghost btn-sm">Edit</button>
          <button class="btn btn-ghost btn-sm" style="color: var(--destructive);">Delete</button>
        </td>
      </tr>
      <tr>
        <td><input type="checkbox"></td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div class="badge badge-secondary" style="width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">JS</div>
            <div>
              <div style="font-weight: 500;">Jane Smith</div>
              <div class="text-muted text-xs">jane@example.com</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-secondary">Pending</span></td>
        <td>Editor</td>
        <td class="text-muted text-sm">Yesterday</td>
        <td style="text-align: right;">
          <button class="btn btn-ghost btn-sm">Edit</button>
          <button class="btn btn-ghost btn-sm" style="color: var(--destructive);">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

<!-- 3. Pagination Bar -->
<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding: 0 0.5rem;">
  <span class="text-muted text-sm">Showing 1 to 2 of 48 results</span>
  <div style="display: flex; gap: 0.375rem; align-items: center;">
    <button class="btn btn-outline btn-sm" disabled>Previous</button>
    <button class="btn btn-primary btn-sm">1</button>
    <button class="btn btn-outline btn-sm">2</button>
    <button class="btn btn-outline btn-sm">3</button>
    <button class="btn btn-outline btn-sm">Next</button>
  </div>
</div>
```

---

## 2. Multi-Step Form with Validation

### Intent
Step-by-step wizard capturing complex settings across multiple steps with client-side validation and responsive field layouts.

### Implementation Blueprint
```html
<div class="card" style="max-width: 640px; margin: 0 auto;">
  <!-- Step Progress Indicator -->
  <div class="card-header" style="border-bottom: 1px solid var(--border);">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="badge badge-default">1</span>
        <span style="font-weight: 600;">Account</span>
      </div>
      <div style="flex: 1; height: 1px; background: var(--border); margin: 0 1rem;"></div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="badge badge-secondary">2</span>
        <span class="text-muted">Profile</span>
      </div>
      <div style="flex: 1; height: 1px; background: var(--border); margin: 0 1rem;"></div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span class="badge badge-secondary">3</span>
        <span class="text-muted">Review</span>
      </div>
    </div>
    <h2 class="card-title">Account Credentials</h2>
    <p class="card-description">Set up your workspace authentication credentials.</p>
  </div>

  <!-- Form Body -->
  <div class="card-content" style="display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem;">
    <div>
      <label class="text-sm" style="font-weight: 500; display: block; margin-bottom: 0.375rem;">Work Email <span style="color: var(--destructive);">*</span></label>
      <input type="email" class="input" placeholder="name@company.com" required>
      <span class="text-muted text-xs" style="margin-top: 0.25rem; display: block;">Verification link will be dispatched here.</span>
    </div>

    <div>
      <label class="text-sm" style="font-weight: 500; display: block; margin-bottom: 0.375rem;">Password <span style="color: var(--destructive);">*</span></label>
      <input type="password" class="input input-error" value="12345">
      <span class="text-xs" style="color: var(--destructive); margin-top: 0.25rem; display: block;">Password must contain at least 8 characters.</span>
    </div>

    <div>
      <label class="text-sm" style="font-weight: 500; display: block; margin-bottom: 0.375rem;">Deployment Region</label>
      <select class="input">
        <option value="us-east">US East (N. Virginia)</option>
        <option value="eu-central">EU Central (Frankfurt)</option>
        <option value="ap-southeast">AP Southeast (Singapore)</option>
      </select>
    </div>
  </div>

  <!-- Step Actions -->
  <div class="card-footer" style="justify-content: space-between; border-top: 1px solid var(--border);">
    <button class="btn btn-outline" disabled>Back</button>
    <button class="btn btn-primary">Continue to Profile →</button>
  </div>
</div>
```

---

## 3. Analytics KPI Cards & Chart Grid

### Intent
Executive and operations overview displaying key performance metrics with trend indicators, quick time-range filters, and multi-column visual containers.

### Implementation Blueprint
```html
<!-- 1. Header Toolbar with Preset Date Filters -->
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
  <div>
    <h1 class="heading-2" style="margin: 0;">Analytics Overview</h1>
    <p class="text-muted text-sm" style="margin: 0.25rem 0 0 0;">Monitor key business metrics and API health in real time.</p>
  </div>
  <div style="display: flex; gap: 0.375rem; align-items: center; background: var(--secondary); padding: 0.25rem; border-radius: var(--radius);">
    <button class="btn btn-ghost btn-sm" style="background: var(--card); box-shadow: var(--shadow-xs);">Today</button>
    <button class="btn btn-ghost btn-sm">7D</button>
    <button class="btn btn-ghost btn-sm">30D</button>
    <button class="btn btn-ghost btn-sm">QTD</button>
  </div>
</div>

<!-- 2. KPI Metrics Grid (24-Column / 4 Cards) -->
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
  <!-- Metric Card 1 -->
  <div class="card" style="padding: 1.25rem;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="text-muted text-sm font-medium">Total Revenue</span>
      <span class="text-muted text-xs">USD</span>
    </div>
    <div style="font-size: 1.75rem; font-weight: 700; margin: 0.5rem 0 0.25rem 0;">$45,231.89</div>
    <div style="display: flex; align-items: center; gap: 0.375rem; font-size: 0.75rem;">
      <span style="color: var(--success); font-weight: 600;">+20.1%</span>
      <span class="text-muted">from last month</span>
    </div>
  </div>

  <!-- Metric Card 2 -->
  <div class="card" style="padding: 1.25rem;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="text-muted text-sm font-medium">Subscriptions</span>
      <span class="text-muted text-xs">Users</span>
    </div>
    <div style="font-size: 1.75rem; font-weight: 700; margin: 0.5rem 0 0.25rem 0;">+2,350</div>
    <div style="display: flex; align-items: center; gap: 0.375rem; font-size: 0.75rem;">
      <span style="color: var(--success); font-weight: 600;">+180.1%</span>
      <span class="text-muted">from last month</span>
    </div>
  </div>

  <!-- Metric Card 3 -->
  <div class="card" style="padding: 1.25rem;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="text-muted text-sm font-medium">Failure Rate</span>
      <span class="text-muted text-xs">p99</span>
    </div>
    <div style="font-size: 1.75rem; font-weight: 700; margin: 0.5rem 0 0.25rem 0;">0.04%</div>
    <div style="display: flex; align-items: center; gap: 0.375rem; font-size: 0.75rem;">
      <span style="color: var(--destructive); font-weight: 600;">+0.01%</span>
      <span class="text-muted">requires attention</span>
    </div>
  </div>

  <!-- Metric Card 4 -->
  <div class="card" style="padding: 1.25rem;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span class="text-muted text-sm font-medium">Active Workers</span>
      <span class="text-muted text-xs">Cluster</span>
    </div>
    <div style="font-size: 1.75rem; font-weight: 700; margin: 0.5rem 0 0.25rem 0;">573</div>
    <div style="display: flex; align-items: center; gap: 0.375rem; font-size: 0.75rem;">
      <span style="color: var(--success); font-weight: 600;">Optimal</span>
      <span class="text-muted">across 3 regions</span>
    </div>
  </div>
</div>
```

---

## 4. Hierarchical Selection & Detail Drawer

### Intent
Drill-down exploration of organizational trees, folders, or categories, opening a non-modal slide-over drawer to inspect details without losing list context.

### Implementation Blueprint
```html
<div style="display: flex; gap: 1.5rem; align-items: flex-start;">
  <!-- Left Category Tree / Cascader Panel -->
  <div class="card" style="width: 280px; padding: 1rem; flex-shrink: 0;">
    <div style="font-weight: 600; font-size: 0.875rem; margin-bottom: 0.75rem;">Organizational Units</div>
    <div style="display: flex; flex-direction: column; gap: 0.25rem;">
      <div class="btn btn-secondary btn-sm" style="justify-content: flex-start;">📁 Engineering (42)</div>
      <div style="margin-left: 1rem; display: flex; flex-direction: column; gap: 0.25rem;">
        <div class="btn btn-ghost btn-sm" style="justify-content: flex-start;">├── Frontend (18)</div>
        <div class="btn btn-ghost btn-sm" style="justify-content: flex-start; background: var(--accent);">└── Backend (24)</div>
      </div>
      <div class="btn btn-ghost btn-sm" style="justify-content: flex-start;">📁 Product & Design (14)</div>
      <div class="btn btn-ghost btn-sm" style="justify-content: flex-start;">📁 Operations (9)</div>
    </div>
  </div>

  <!-- Right Central List -->
  <div class="card" style="flex: 1;">
    <div class="card-header">
      <h3 class="card-title">Backend Engineers (24)</h3>
    </div>
    <div class="card-content" style="padding: 0;">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Primary Cluster</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr style="cursor: pointer;" onclick="openDrawer()">
            <td><strong>Alex Rivera</strong></td>
            <td>eu-central-1</td>
            <td><span class="badge badge-success">Online</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- Slide-Over Detail Drawer -->
<div id="detail-drawer" style="position: fixed; inset: 0; z-index: 60; display: none;">
  <!-- Backdrop -->
  <div style="position: absolute; inset: 0; background: rgba(0, 0, 0, 0.5);" onclick="closeDrawer()"></div>
  <!-- Drawer Panel -->
  <div class="card" style="position: absolute; right: 0; top: 0; bottom: 0; width: 440px; border-radius: 0; border-left: 1px solid var(--border); box-shadow: var(--shadow-xl); display: flex; flex-direction: column; padding: 1.5rem;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 class="heading-4" style="margin: 0;">Member Profile</h3>
      <button class="btn btn-ghost btn-sm" onclick="closeDrawer()">✕</button>
    </div>
    <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <span class="text-muted text-xs">Full Name</span>
        <div style="font-weight: 600; font-size: 1rem;">Alex Rivera</div>
      </div>
      <div>
        <span class="text-muted text-xs">Primary Role</span>
        <div>Staff Distributed Systems Engineer</div>
      </div>
      <div>
        <span class="text-muted text-xs">Assigned Microservices</span>
        <div style="display: flex; gap: 0.375rem; flex-wrap: wrap; margin-top: 0.25rem;">
          <span class="badge badge-secondary">auth-service</span>
          <span class="badge badge-secondary">gateway</span>
          <span class="badge badge-secondary">billing-worker</span>
        </div>
      </div>
    </div>
    <div style="display: flex; justify-content: flex-end; gap: 0.5rem; border-top: 1px solid var(--border); padding-top: 1rem;">
      <button class="btn btn-outline" onclick="closeDrawer()">Close</button>
      <button class="btn btn-primary">Edit Member</button>
    </div>
  </div>
</div>
```

---

## 5. Bulk Actions & Destructive Confirmation

### Intent
Floating action banner triggered when 1 or more table rows are selected, providing batch processing and high-certainty confirmation dialogs.

### Implementation Blueprint
```html
<!-- Floating Batch Action Banner (Bottom Sticky) -->
<div class="card" style="position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); z-index: 40; padding: 0.75rem 1.5rem; display: flex; align-items: center; gap: 1.5rem; box-shadow: var(--shadow-lg); border-radius: var(--radius-full);">
  <div style="display: flex; align-items: center; gap: 0.5rem;">
    <span class="badge badge-default" style="border-radius: 50%; width: 20px; height: 20px; padding: 0; display: inline-flex; align-items: center; justify-content: center;">3</span>
    <span style="font-weight: 500; font-size: 0.875rem;">items selected</span>
  </div>
  <div style="height: 1rem; width: 1px; background: var(--border);"></div>
  <div style="display: flex; gap: 0.5rem;">
    <button class="btn btn-outline btn-sm">Export Selected</button>
    <button class="btn btn-outline btn-sm">Assign Tag</button>
    <button class="btn btn-destructive btn-sm" onclick="openConfirmModal()">Delete</button>
  </div>
</div>

<!-- Destructive Confirmation Modal -->
<div id="confirm-modal" style="display: none;">
  <div class="dialog-overlay"></div>
  <div class="dialog-content">
    <div class="dialog-header">
      <h2 class="dialog-title" style="color: var(--destructive);">Delete 3 selected resources?</h2>
      <p class="dialog-description">This operation is irreversible. All associated database records, access keys, and telemetry logs will be permanently expunged.</p>
    </div>
    <div class="dialog-footer">
      <button class="btn btn-outline" onclick="closeConfirmModal()">Cancel</button>
      <button class="btn btn-destructive" onclick="executeBatchDelete()">Yes, Delete Resources</button>
    </div>
  </div>
</div>
```

---

## 6. Modern Inset Collapsible Dashboard Layout

### Intent
High-efficiency workspace architecture featuring a collapsible inset sidebar, sticky utility header, responsive metric KPI cards, data visualization canvas, and a primary data table.

### Architectural Anatomy
```text
┌────────────────────────────────────────────────────────────────────────┐
│ [Workspace Brand]   │ [Sidebar Trigger] [Page Title]    [Search] [User]│
├─────────────────────┼──────────────────────────────────────────────────┤
│ [Primary Actions]   │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│ • Nav Item 1        │ │ Metric │ │ Metric │ │ Metric │ │ Metric │     │
│ • Nav Item 2        │ └────────┘ └────────┘ └────────┘ └────────┘     │
│                     │ ┌──────────────────────────────────────────────┐ │
│ [Group Label]       │ │ Chart Canvas / Analytics Overview            │ │
│ • Section Item A    │ └──────────────────────────────────────────────┘ │
│ • Section Item B    │ ┌──────────────────────────────────────────────┐ │
│                     │ │ Filter Bar: [Search] [Tabs]         [Export] │ │
│ [System / Settings] │ │ ──────────────────────────────────────────── │ │
│ [User Profile]      │ │ Data Table: Multi-column Records & Actions   │ │
│                     │ └──────────────────────────────────────────────┘ │
└─────────────────────┴──────────────────────────────────────────────────┘
```

### Implementation Highlights
- **Inset Canvas**: Uses `.sidebar-wrapper` with `.sidebar` and `.sidebar-inset`, giving the main content area a clean floating border, subtle shadow, and curved corners (`--radius-lg`).
- **Collapsible Sidebar**: Supports dynamic toggle via `ThemeManager.toggleSidebar()` between full width (`--sidebar-width: 260px`) and icon-only rail (`--sidebar-width-icon: 48px`).
- **Complete Template**: For full HTML/CSS implementation, see [style-guide.md](file:///Users/xiong/Documents/Gemini/AntDesign/theme/shadcn/style-guide.md#4-complete-dashboard-layout-boilerplate).

---

## 7. Troubleshooting & Diagnostics Flowchart

| Symptom | Root Cause | Solution |
| :--- | :--- | :--- |
| **Dropdown / DatePicker clipped by parent card** | Parent container has `overflow: hidden`. | Set `position: fixed` or portal popup outside the card; or change container overflow to `overflow: visible`. |
| **Modal backdrop does not cover entire screen** | Root element missing viewport height or ancestor has CSS `transform`. | Move `.dialog-overlay` directly under `<body>` to bypass stacking context traps. |
| **Focus ring invisible on custom button/input** | Removed `outline: none` without adding `:focus-visible`. | Restore `outline: 2px solid var(--ring)` with `outline-offset: 2px`. |
| **Table squished or illegible on small viewports** | Missing horizontal scroll wrapper. | Enclose `table` inside `.table-container` with `overflow-x: auto`. |
| **Dark mode surface colors indistinguishable** | Relying exclusively on drop shadows in dark mode. | Use numerical surface elevation tokens (`--surface-0` canvas, `--surface-1` card, `--surface-2` hover, `--surface-3` popup, `--surface-4` modal). |
