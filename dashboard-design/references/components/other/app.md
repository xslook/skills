# App

> Category: **Other**  
> Identifier: `app`  
> Definition: Root application provider providing context and unified static function mounts.

---

## 1. Overview & Intent

### When to Use
Wrap around application root to provide consistent styles and enable modal/message hooks.

### When NOT to Use
Do not instantiate multiple nested App wrappers within the same DOM tree. Consult the [Component Decision Tree](../../component-decision-tree.md) for alternatives.

---

## 2. Component Anatomy & Semantic Slots

```text
App Structural Hierarchy:
├── Root: Global context provider and top-level container element.
```

---

## 3. Variants & Types

- **Root wrapper mode**

---

## 4. Sizes & Spatial Metrics

| Aspect | Specification | Notes |
| :--- | :--- | :--- |
| **DOM Footprint** | Zero-layout wrapper or `pointer-events: none` overlay | Does not alter child control heights (`24px`–`40px`) or `8px` grid alignment |
| **Scope** | Document root (`:root` / `<html>`) or target container (`position: relative`) | Cascades CSS custom properties and context downward |

---

## 5. Interaction & State Contract

- **Theme & Token Cascade**: Reactively updates `[data-theme="light|dark"]` and CSS custom properties without remounting child DOM nodes.
- **Decorative / Security Overlays**: Uses `pointer-events: none` and `aria-hidden="true"` so underlying interactive controls remain 100% accessible.

---

## 6. Design Tokens Specification

| CSS Custom Property | Light / Dark Value | Semantic Role |
| :--- | :--- | :--- |
| `--background` / `--foreground` | `#ffffff` / `#09090b` (`#09090b` / `#fafafa` dark) | Root context canvas and foreground |
| `--primary` / `--radius` | `#18181b` / `6px` | Global seed tokens managed by `ThemeManager` |
| `--chart-1` .. `--chart-5` | Categorical palette tokens | Accent and animated border beam stops |

---

## 7. Do's, Don'ts & Accessibility

### Rules & Pitfalls
- ✅ **Do**: Initialize `ThemeManager.initTheme({ defaultTheme: 'auto', syncWithSystem: true })` at application bootstrap.
- ✅ **Do**: Respect `prefers-reduced-motion: reduce` by disabling decorative animations (`BorderBeam`, transitions).
- ❌ **Don't**: Allow decorative or watermark overlays to intercept pointer clicks or keyboard focus.

### Accessibility (WCAG 2.1)
- **ARIA Role**: App root container
- **Key Attributes**: Root container
- **Keyboard Navigation**: Provides keyboard listener mounts.
- **Contrast Requirement**: Text must meet at least **4.5:1** contrast against backgrounds (**3:1** for large text).
