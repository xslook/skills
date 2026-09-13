# Motion System Specification

Guidelines for transition durations, easing curves, and choreographies in enterprise interfaces.

---

## 1. Motion Principles

1. **Natural**: Transitions must follow physical momentum and inertia (e.g., button ripples, dropdown spring dampening).
2. **Efficient**: Motion must not block productivity. Keep durations between `100ms` and `300ms`.
3. **Exit Faster Than Entry**: Entering elements can announce their arrival with an ease-out animation; exiting elements must vanish immediately without sequential delays.

---

## 2. Duration Hierarchy

| Tier | Duration | Usage |
| :--- | :--- | :--- |
| **Fast** | **0.1s (100ms)** | Hover color changes, active click downscale, icon toggles, checkbox checks |
| **Mid** | **0.2s (200ms)** | Dropdown reveals, tooltip appearances, collapse accordion unfolds, segmented sliding tabs |
| **Slow** | **0.3s (300ms)** | Modal dialog appearances, drawer slide-overs, page-level crossfades |

---

## 3. Cubic-Bezier Easing Curves

```css
/* Enter Transition (Ease-Out-Circ): Quick entry, decelerated stop */
--ease-out-circ: cubic-bezier(0.08, 0.82, 0.17, 1);

/* Spring Popups (Ease-Out-Back): Subtle overshoot, for tooltips and badges */
--ease-out-back: cubic-bezier(0.12, 0.4, 0.29, 1.46);

/* General Exit (Ease-Out): Clean exit */
--ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);

/* Accelerated Exit (Ease-In-Back): Quick dismissal */
--ease-in-back: cubic-bezier(0.71, -0.46, 0.88, 0.6);

/* Bidirectional Smooth (Ease-In-Out): Accordion height changes, horizontal carousels */
--ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
```
