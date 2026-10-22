# Interaction Design Principles

The system employs 10 core interaction principles: 4 foundational structural principles and 6 dynamic interaction principles.

---

## Foundational Structural Principles

### 1. Proximity
Map logical relationships to spatial distance:
- **Element-to-Label Gap**: Keep tightly coupled elements close (`4px` to `8px`).
- **Field-to-Field Gap**: Separate independent fields with standard spacing (`16px` to `24px`).
- **Section Gap**: Separate distinct logical sections with larger spacing (`32px` to `48px`).

### 2. Alignment
Create clean reading lines and visual anchors:
- **Text Alignment**: Left-align textual content and form labels. Right-align numeric values and currency in data tables.
- **Icon and Text**: Vertically center icons with text line-height baselines.
- **Grid Alignment**: Place every element along the 24-column grid. Minimize arbitrary vertical alignment axes.

### 3. Contrast
Create distinct visual hierarchy between different elements:
- **Primary vs. Secondary**: Highlight one primary action with solid fill; render secondary actions in outline or text.
- **Clear Differences**: Avoid subtle, ambiguous variations (e.g., 13px vs. 14px font, or `#666` vs. `#777`). Jump across scale steps when contrasting elements.

### 4. Repetition
Standardize repeating patterns across screens:
- **Consistent States**: Use identical colors, border radii, and feedback animations for identical actions across all pages.
- **Predictable Locations**: Place primary confirm buttons at the bottom-right of dialogs and search inputs at the top-left of list tables.

---

## Dynamic Interaction Principles

### 5. Directness
Provide in-place interactions where the user is looking:
- **Inline Editing**: Allow clicking a table cell or detail value to edit directly without navigating to an edit screen.
- **Contextual Actions**: Display row-level action buttons on hover over the target item.

### 6. Stay on the Page
Avoid unnecessary page transitions for quick subtasks:
- **Tooltips & Popovers**: Display supplementary information inline without leaving the view.
- **Popconfirm**: Use in-place popover confirmations for row deletions instead of full-screen modals.
- **Drawer**: Use slide-over panels for medium-complexity configurations while keeping the main page context visible.

### 7. Lightweight
Minimize clicks and cognitive load:
- **Progressive Disclosure**: Show the primary 20% of inputs by default; collapse advanced filters into an expandable panel.
- **Smart Defaults**: Retain previous selections and auto-focus the first logical input.

### 8. Invitation
Provide clear affordances before interaction occurs:
- **Hover Feedback**: Lighten background colors and change cursors to `pointer` on clickable surfaces.
- **Empty State Guidance**: Provide an illustration, a short explanation, and a direct action button when no data exists.

### 9. Transition
Maintain spatial continuity between states:
- **Expanding Popups**: Radiate overlays outward from the trigger element.
- **Duration Bounds**: Keep animations between `100ms` and `300ms`. Elements must exit faster than they enter.

### 10. Immediate Reaction
Respond to user actions within milliseconds:
- **Immediate State Changes**: Highlight borders and apply subtle scales immediately on click.
- **Async Loading**: Switch buttons to a loading spinner immediately upon submission and disable further clicks.
