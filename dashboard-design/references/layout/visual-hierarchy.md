# Visual Hierarchy & Information Density

Guidelines for structural container nesting, surface stratification, and information density modes in enterprise interfaces.

---

## 1. Container Nesting Hierarchy

```text
Level 0: Viewport Shell        -> --sidebar (#FAFAFA light / #121215 dark) or --surface-0 (#FFFFFF / #09090B)
   │
   ▼
Level 1: Inset Workspace       -> .sidebar-inset (--background, 12px radius, 1px --sidebar-border)
   │
   ▼
Level 2: Sectional Containers  -> .card / .stat-card (--surface-1, 1px --border, 12px radius, 24px padding)
   │
   ▼
Level 3: Component Units       -> Tables, forms, charts, and lists placed inside cards
```

- **Separation Rule**: Separate sibling cards using consistent grid gaps (`16px` or `24px`) rather than double borders.
- **Inner Dividers**: Within cards and tables, separate rows using subtle `1px solid var(--border)` or `var(--border-secondary)` hairlines.

---

## 2. Information Density Modes

Dashboards support 3 standardized density profiles (synchronized with [`best-practices.md`](../best-practices.md)):

| Density Mode | Control Height | Table Row Height | Card / Panel Padding | Target Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Compact** | `32px` (`24px` micro) | `36px` | `12px` / `16px` | Financial trading desks, real-time NOC monitoring, DevOps log consoles |
| **Default** | **`36px`** | **`48px`** | **`16px` / `24px`** | **Standard**: Enterprise SaaS admin, CRM/ERP, analytics dashboards |
| **Loose** | `40px` | `56px` | `24px` / `32px` | Executive summaries, onboarding wizards, tablet/touch environments |
