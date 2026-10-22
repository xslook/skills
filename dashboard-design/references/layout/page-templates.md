# Enterprise Page Templates

Structural blueprints for the 6 most common enterprise page patterns.

---

## 1. Workbench Pattern

- **Page Header**: Avatar and user greeting on left; 3–4 key metric counters (Statistic component) on right.
- **2-Column Layout (16:8 or 18:6 column split)**:
  - **Main Area (Left)**: Metric card row, project card grid with progress bars, and recent activity timeline.
  - **Sidebar Area (Right)**: Quick action navigation links, team member directory, and documentation links.

---

## 2. Form Pattern

- **Basic Form**: Single centered column with `max-width: 600px`.
- **Step Form**: Horizontal Steps indicator at top; breaks complex forms into 3–5 stages with progress state persistence.
- **Sectioned Form**: Group fields into discrete Card sections with a sticky bottom action bar (Affix component) hosting Cancel and Submit buttons.

---

## 3. List & Table Pattern

1. **Page Header**: Breadcrumbs and entity title.
2. **Filter Bar**: 3 high-frequency filter inputs visible by default; expandable toggle for advanced filters.
3. **Action Toolbar**: Batch operation buttons on left ("Selected: 5 items", "Delete", "Export"); "New Item" primary button, refresh, and column visibility settings on right.
4. **Data Table**: Tabular figures, fixed columns for actions/IDs, and text truncation with tooltips.
5. **Pagination**: Right-aligned bottom pagination bar with page size selector and quick jumper.

---

## 4. Detail Page Pattern

1. **Detail Header**: Back button, object title, status badge, and primary action buttons.
2. **Descriptions Grid**: Multi-column key-value grid for core metadata (Created By, Timestamp, ID).
3. **Tabbed Content**: Tabs component dividing sub-resources ("Overview", "Orders", "Audit Logs").

---

## 5. Result Pattern

- **Status Icon**: Success (green check), Warning (amber alert), or Error (red cross).
- **Heading & Summary**: Clear status headline and descriptive outcome paragraph.
- **Process Card**: Ordered progress steps in an inner tinted container.
- **Action Buttons**: Primary action ("Back to List") and secondary action ("Create Another").

---

## 6. Exception Pattern

- **Illustrations**: Dedicated 403 (Forbidden), 404 (Not Found), and 500 (Server Error) illustrations.
- **Resolution Path**: Direct action button ("Back to Home" or "Request Access") instead of displaying raw code errors.
