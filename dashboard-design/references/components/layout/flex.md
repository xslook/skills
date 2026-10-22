# Flex

> Category: **Layout**  
> Identifier: `flex`  
> Definition: Flexbox layout container providing alignment, direction, and gap control.

---

## 1. Overview & Intent

### When to Use
Use for 1D horizontal or vertical layouts, alignment controls, and uniform item spacing.

### When NOT to Use
Do not use for complex 2D column-based grid systems; use Grid instead. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
Flex Structural Hierarchy:
├── Root: Flexbox container with customizable justify, align, and gap tokens.
```

---

## 3. Variants & Types

- **Horizontal**: Row flex
- **Vertical**: Column flex
- **Wrap**: Wrapping flex items

---

## 4. Sizes & Spatial Metrics

| Breakpoint / Tier | Viewport Range | Gutter / Spacing Token | Standard Column Strategy |
| :--- | :--- | :--- | :--- |
| **xs / sm** | `< 576px` / `≥ 576px` | `--spacing-2` (`8px`) / `--spacing-4` (`16px`) | 1 column (`span 24`) / 2 columns (`span 12`) |
| **md / lg** | `≥ 768px` / `≥ 992px` | `--spacing-4` (`16px`) / `--spacing-6` (`24px`) | 2–3 columns (`span 12` / `8`) / 4 columns (`span 6`) |
| **xl / xxl** | `≥ 1200px` / `≥ 1600px` | `--spacing-6` (`24px`) / `--spacing-8` (`32px`) | 4–6 columns (`span 6` / `4`) within max-width shell |

---

## 5. Interaction & State Contract

- **Structural Container**: Pure layout primitive; does not capture keyboard focus (except interactive `Splitter` resize handles).
- **Responsive Reflow**: Smoothly collapses multi-column arrangements to vertical stacks on narrow viewports without horizontal overflow.

---

## 6. Design Tokens Specification

| CSS Custom Property | Light / Dark Value | Semantic Role |
| :--- | :--- | :--- |
| `--spacing-1` .. `--spacing-12` | `4px` .. `48px` | Modular gap, padding, and gutter scale |
| `--sidebar-width` / `--sidebar-width-icon` | `260px` / `48px` | Expanded and collapsed sidebar rail widths |
| `--header-height` | `52px` | Sticky workspace header height |
| `--border` / `--sidebar-border` | `#e4e4e7` (`#27272a` dark) | Structural divider and inset canvas border |

---

## 7. Do's, Don'ts & Accessibility

### Rules & Pitfalls
- ✅ **Do**: Align all container gaps and paddings strictly to the `4px`/`8px` spatial grid (`8px`, `12px`, `16px`, `24px`, `32px`).
- ✅ **Do**: Use `.sidebar-wrapper` + `.sidebar-inset` for modern collapsible workspace shells.
- ❌ **Don't**: Hardcode fixed pixel widths on fluid grid columns or let single-column forms stretch across `1920px` viewports.

### Accessibility (WCAG 2.1)
- **ARIA Role**: Container role
- **Key Attributes**: Semantic tags (`header`, `main`, `section`)
- **Keyboard Navigation**: Standard DOM tab order.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
