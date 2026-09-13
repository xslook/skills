# Component Decision Trees

Flowcharts and comparison matrices for selecting between similar components.

---

## 1. Feedback & Confirmation Decision Tree

```text
User feedback or confirmation required?
 │
 ├── Persistent in-page notification? (Visible without user action)
 │    ├── Banner warning or system announcement ─────────────► [Alert]
 │    └── Empty data state or route exception ────────────────► [Empty] / [Result]
 │
 └── Triggered by interaction?
      │
      ├── Informational only? (No user decision required)
      │    ├── Quick transient confirmation ("Copied", "Saved")
      │    │    └── Centered, auto-dismisses in 3s ───────────► [Message]
      │    └── Complex or background task notification
      │         └── Corner popup, rich description, dismissable ► [Notification]
      │
      └── Decision or confirmation required?
           │
           ├── Lightweight row-level destructive confirmation?
           │    ├── Keep context, anchor popup to trigger button ──► [Popconfirm]
           │    └── Severe database-wide operation requiring typing ─► [Modal]
           │
           └── Sub-workflow or multi-field form?
                ├── Self-contained, blocking task ────────────► [Modal]
                └── Complex sub-form requiring main page reference ──► [Drawer]
```

---

## 2. Selection & Option Controls Decision Tree

```text
User needs to select 1 option:
 │
 ├── Few options (≤ 5) and all options must be visible?
 │    ├── View switcher or filter bar ────────────────────────► [Segmented]
 │    └── Standard form field ────────────────────────────────► [Radio Group]
 │
 ├── Moderate options (6 to 20+)?
 │    └── Searchable, collapsible dropdown ───────────────────► [Select]
 │
 └── Hierarchical or tree-structured options?
      ├── Fixed deep hierarchy (e.g., Country -> State -> City) ► [Cascader]
      └── Dynamic, irregular tree hierarchy (e.g., File system) ─► [TreeSelect]
```

---

## 3. Switch vs. Checkbox

| Condition | Recommended Component | Rationale |
| :--- | :--- | :--- |
| **Instant effect on toggle** (e.g., enable dark mode, toggle notifications) | **[Switch]** | Immediate state update; requires no "Submit" or "Save" button. |
| **Part of a form submitted together** (e.g., agree to terms, subscribe) | **[Checkbox]** | Value buffers locally until form submit. |
| **Parent with sub-items (Select All / Mixed)** | **[Checkbox (Indeterminate)]** | Native tri-state support (`checked`, `unchecked`, `indeterminate`). |

---

## 4. Table vs. List vs. Virtual List

| Data Characteristics | Recommended Component | Rationale |
| :--- | :--- | :--- |
| Structured columns, cross-row sorting, filtering, and fixed columns | **[Table]** | Full tabular features for structured data. |
| Unstructured card items, varied media, fluid editorial reading | **[List]** | Flexible layouts, media embedding. |
| Dataset exceeds 1,000 to 100,000 items without pagination | **[Listy]** | Virtualized viewport rendering maintains 60fps scrolling. |
