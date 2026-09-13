# Visual Hierarchy & Information Density

Guidelines for structural container nesting and density modes in enterprise interfaces.

---

## 1. Container Nesting Hierarchy

```text
Level 0: Viewport Background -> #F5F5F5 (Light neutral canvas)
   │
   ▼
Level 1: Page Shell -> Top navigation bar + Left sidebar
   │
   ▼
Level 2: Sectional Containers -> Cards (#FFFFFF + 1px border or subtle shadow, 8px radius, 24px padding)
   │
   ▼
Level 3: Component Units -> Tables, forms, lists placed within cards
```

- **Separation Rule**: Separate adjacent cards using whitespace (`16px` or `24px` margin) over the `#F5F5F5` canvas background rather than heavy borders.
- **Inner Dividers**: Within cards, use subtle hairline dividers (`rgba(5, 5, 5, 0.06)`).

---

## 2. Information Density Modes

| Density Mode | Control Height | Table Row Height | Card Padding | Target Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Compact** | **24px** | `38px` | `12px` / `16px` | Financial trading desks, real-time monitoring, DevOps consoles |
| **Default** | **32px** | `54px` | `24px` | **Standard**: Enterprise ERP, CRM, admin dashboards, approval flows |
| **Loose** | **40px** | `68px` | `32px` | Portals, onboarding flows, tablet environments, executive summaries |
