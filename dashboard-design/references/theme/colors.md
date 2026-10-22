# Color System Specification

The color system provides two primary brand presets (Monochrome Zinc/Obsidian and Enterprise Daybreak Blue), functional status tokens, a 12-palette categorical scale for data visualization, and a stratified neutral hierarchy.

---

## 1. Primary Brand Presets

| Preset | Light `--primary` | Light `--primary-Hover` | Dark `--primary` | Recommended Context |
| :--- | :--- | :--- | :--- | :--- |
| **Monochrome Obsidian (Default)** | `#18181B` | `#27272A` | `#FAFAFA` | Modern SaaS dashboards, developer consoles, AI workbenches (allows status & chart colors to stand out without brand hue clashes) |
| **Enterprise Daybreak Blue** | `#1677FF` | `#4096FF` | `#4096FF` | Traditional ERP, financial operations, corporate portals |

---

## 2. Functional Status Colors

| Status | CSS Token | Light Seed | Light Bg (`*-bg`) | Light Border (`*-border`) | Dark Seed | Dark Bg (`*-bg`) | Dark Border (`*-border`) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Success** | `--success` | `#16A34A` | `#F0FDF4` | `#BBF7D0` | `#15803D` | `#052E16` | `#166534` |
| **Warning** | `--warning` | `#F59E0B` | `#FFFBEC` | `#FDE68A` | `#B45309` | `#451A03` | `#78350F` |
| **Destructive / Error** | `--destructive` | `#EF4444` | `#FEF2F2` | `#FECACA` | `#7F1D1D` | `#450A0A` | `#991B1B` |
| **Info** | `--info` | `#2563EB` | `#EFF6FF` | `#BFDBFE` | `#1D4ED8` | `#172554` | `#1E40AF` |

---

## 3. Neutral Text & Surface Hierarchy

| Semantic Role | CSS Token | Light Value | Dark Value | Application |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Text** | `--text-0` / `--foreground` | `#09090B` | `#FAFAFA` | Headings, primary metrics, table cell values |
| **Secondary Text** | `--text-1` / `--muted-foreground` | `#71717A` | `#A1A1AA` | Subtitles, column headers, form descriptions |
| **Tertiary Text** | `--text-2` | `#A1A1AA` | `#71717A` | Captions, placeholders, missing-data dashes (`—`) |
| **Disabled Text** | `--text-3` | `#D4D4D8` | `#52525B` | Disabled controls, inactive indicators |
| **Primary Border** | `--border` | `#E4E4E7` | `#27272A` | Card outlines, input borders, table outer frames |
| **Secondary Border** | `--border-secondary` | `#F4F4F5` | `#18181B` | Subtle hairline row dividers, card footer splits |

---

## 4. The 12 Categorical Palettes (Charts, Tags & Badges)

For multi-series charts, categorical tags, and status indicators, each of the 12 base palettes expands into a 10-step derivative scale (**Index 1 to 10**, where **Index 6** is the primary seed):

| Color Key | Name | Seed Value (Index 6) | Typical Dashboard Application |
| :--- | :--- | :--- | :--- |
| `blue` | Daybreak Blue | `#1677FF` | Primary data series, active processing state |
| `purple` | Golden Purple | `#722ED1` | Analytics cohorts, AI/ML features, premium tiers |
| `cyan` | Cyan | `#13C2C2` | Telemetry, IoT nodes, network throughput |
| `green` | Polar Green | `#52C41A` | Healthy uptime, positive growth delta |
| `magenta` | Magenta | `#EB2F96` | User engagement, categorical tags |
| `pink` | Pink | `#EB2F96` | Highlight badges, secondary segments |
| `red` | Dust Red | `#EF4444` / `#F5222D` | Critical anomalies, SLA breaches |
| `orange` | Sunset Orange | `#FA8C16` | Queued jobs, throttling warnings |
| `yellow` | Sunrise Yellow | `#FADB14` | Attention callouts, star ratings |
| `volcano` | Volcano | `#FA541C` | High-urgency operational alerts |
| `geekblue` | Geek Blue | `#2F54EB` | Infrastructure clusters, database shards |
| `gold` | Calendula Gold | `#FAAD14` | Pending approvals, billing/financial metrics |
| `lime` | Lime | `#A0D911` | Secondary positive comparisons |

### 10-Step Derivative Scale Semantics
- **Index 1**: Subtle background tint (e.g., `#E6F4FF` for blue tag/alert backgrounds).
- **Index 2**: Hover background tint (`#BAE0FF`).
- **Index 3**: Border and pill outline tint (`#91CAFF`).
- **Index 4**: Sub-primary accent tint (`#69B1FF`).
- **Index 5**: Interactive hover state (`#4096FF`).
- **Index 6**: Default primary seed (`#1677FF`).
- **Index 7**: Interactive active/pressed state (`#0958D9`).
- **Index 8–10**: High-contrast text and deep chart fills (`#003EB3` → `#001D66`).
