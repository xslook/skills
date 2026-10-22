# Affix

> Category: **Navigation**  
> Identifier: `affix`  
> Definition: Pins elements to top or bottom of viewport during scrolling.

---

## 1. Overview & Intent

### When to Use
Use for sticky table headers, bottom submission bars in long forms, or floating navigation.

### When NOT to Use
Do not affix large containers that cover significant portions of the viewport. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Affix Structural Hierarchy:
├── Root: Placeholder preserving scroll height.
├── FixedNode: Position-fixed container when scroll threshold triggers.
```

---

## 3. Variants & Types

- **Top Affix**: Fixed to top offset
- **Bottom Affix**: Fixed to bottom offset

---

## 4. Sizes & Spatial Metrics

| Element | Metric / Token | Value | Notes |
| :--- | :--- | :--- | :--- |
| **Sidebar Menu Item (`.sidebar-menu-button`)** | Height / Padding | `36px` (`2.25rem`) / `0 10px` | `10px` icon-to-label gap; collapses to `36px × 36px` icon button |
| **Tabs Strip (`.tabs-list` / `.tabs-trigger`)** | Height / Padding | `36px` container, `6px 14px` trigger | `3px` track padding in `--muted`; `--radius-sm` active pill |
| **Pagination / Steps / Breadcrumb** | Control Height | `32px` (`--control-height-sm`) | `6px`–`8px` item gap; `tabular-nums` page counters |

---

## 5. Interaction & State Contract

Follows [Components Overview](../overview.md#2-universal-interaction-states-contract):
- **Active / Current Route**: Highlights with `--sidebar-accent` (Sidebar) or `--background` + `--shadow-xs` (Tabs) and `font-weight: 500–600` (`aria-current="page"` or `aria-selected="true"`).
- **Hover**: Applies subtle `--accent` fill (`150ms`).
- **Keyboard**: Supports `Tab` to focus container and `Arrow` keys to traverse tabs/menu items.

---

## 6. Design Tokens Specification

| CSS Custom Property | Light / Dark Value | Semantic Role |
| :--- | :--- | :--- |
| `--sidebar` / `--sidebar-foreground` | `#fafafa` / `#18181b` (`#121215` / `#fafafa` dark) | Sidebar rail surface and text |
| `--sidebar-accent` | `#f4f4f5` (`#27272a` dark) | Active and hovered sidebar menu item fill |
| `--muted` / `--muted-foreground` | `#f4f4f5` / `#71717a` | Inactive tab strip track and secondary nav labels |
| `--ring` | `#18181b` (`#fafafa` dark) | Keyboard `:focus-visible` ring |

---

## 7. Do's, Don'ts & Accessibility

### Rules & Pitfalls
- ✅ **Do**: Clearly indicate the active route or tab using both background/border contrast and `font-weight: 500–600`.
- ✅ **Do**: Persist collapsible sidebar state in `localStorage` via `ThemeManager.initSidebar()`.
- ❌ **Don't**: Exceed 7 top-level tabs in a horizontal tab strip without grouping or scrolling.

### Accessibility (WCAG 2.1)
- **ARIA Role**: `role="region"`
- **Key Attributes**: None
- **Keyboard Navigation**: Standard DOM tab order.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
