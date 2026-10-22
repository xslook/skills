# Elevation & Shadow Specification

The elevation system uses 4 elevation levels and layered shadow formulas to model depth and spatial hierarchy.

---

## 1. Elevation Levels

| Level | Physical Model | Spatial Relation | Components |
| :--- | :--- | :--- | :--- |
| **Level 0 (Flat)** | 0 elevation, flush with canvas. | Base canvas layer. | Inputs, flat cards, page layout background, dividers. |
| **Level 1 (Sub-surface)** | Minimal elevation triggered by interaction. | Transient feedback layer. | Card hover states, floating action buttons. |
| **Level 2 (Attached)** | Elevated above canvas, tethered to trigger. | Follower overlay layer. | Dropdowns, Select menus, Popovers, DatePicker panels. |
| **Level 3 (Modal)** | Highest elevation, decoupled from trigger. | Full-focus blocking layer. | Modal dialogs, Drawers, global Notifications. |

---

## 2. Layered Shadow Formulas

To avoid harsh single-layer shadow edges, the elevation model blends composite shadow layers:
1. **Key Light Layer**: Tight blur, negative spread, higher opacity for edge definition.
2. **Ambient Light Layer**: Medium blur, zero spread, soft opacity for shadow body.
3. **Fill Light Layer**: Large blur, positive spread, low opacity for soft ambient diffusion.

### CSS Box-Shadow Definitions

```css
/* Level 1: Low Elevation (Card hover, subtle controls) */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm:
  0 1px 3px 0 rgba(0, 0, 0, 0.1),
  0 1px 2px -1px rgba(0, 0, 0, 0.1);

/* Level 2: Medium Elevation (Dropdowns, Select, Popovers, Tooltips) */
--shadow-md:
  0 4px 6px -1px rgba(0, 0, 0, 0.1),
  0 2px 4px -2px rgba(0, 0, 0, 0.1);

/* Level 3: High Elevation (Modals, Dialogs, Drawers, Notifications) */
--shadow-lg:
  0 10px 15px -3px rgba(0, 0, 0, 0.1),
  0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl:
  0 20px 25px -5px rgba(0, 0, 0, 0.1),
  0 8px 10px -6px rgba(0, 0, 0, 0.1);
```

---

## 3. Directional Shadows

- **Downward**: Standard components and dropdowns opening below.
- **Upward (Bottom Dock / Sticky Bar)**:
  `box-shadow: 0 -6px 16px 0 rgba(0,0,0,0.08), 0 -3px 6px -4px rgba(0,0,0,0.12), 0 -9px 28px 8px rgba(0,0,0,0.05);`
- **Leftward (Drawer Right / Fixed Right Column)**:
  `box-shadow: -6px 0 16px 0 rgba(0,0,0,0.08), -3px 0 6px -4px rgba(0,0,0,0.12), -9px 0 28px 8px rgba(0,0,0,0.05);`
- **Rightward (Navigation Sider / Drawer Left / Fixed Left Column)**:
  `box-shadow: 6px 0 16px 0 rgba(0,0,0,0.08), 3px 0 6px -4px rgba(0,0,0,0.12), 9px 0 28px 8px rgba(0,0,0,0.05);`
