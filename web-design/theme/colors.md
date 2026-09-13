# Color System Specification

The color system organizes colors into a 12-palette system, a 10-step derivative scale, functional status colors, and an alpha-based neutral matrix.

---

## 1. The 12 Base Palettes

Each palette expands into 10 steps (Index 1 to 10), where **Index 6 is the default primary seed**:

| Color Key | Name | Seed Value (Index 6) | Application |
| :--- | :--- | :--- | :--- |
| `blue` | Daybreak Blue | `#1677FF` | Default brand color, primary calls to action |
| `purple` | Golden Purple | `#722ED1` | Analytics, luxury, premium dashboards |
| `cyan` | Cyan | `#13C2C2` | Health, technology, IoT dashboards |
| `green` | Polar Green | `#52C41A` | Success states, safe operations |
| `magenta` | Magenta | `#EB2F96` | Social notifications, promotional badges |
| `pink` | Pink | `#EB2F96` | Tag highlights, lifestyle categories |
| `red` | Dust Red | `#F5222D` / `#FF4D4F` | Error, destructive actions, critical alarms |
| `orange` | Sunset Orange | `#FA8C16` | Pending operations, warm alerts |
| `yellow` | Sunrise Yellow | `#FADB14` | High-attention callouts |
| `volcano` | Volcano | `#FA541C` | High-urgency warnings |
| `geekblue` | Geek Blue | `#2F54EB` | Infrastructure, big data consoles |
| `gold` | Calendula Gold | `#FAAD14` | Warning states, finance, credits |
| `lime` | Lime | `#A0D911` | Freshness, positive indicators |

### 10-Step Derivative Scale

- **Index 1**: Light background tint (e.g., Alert/Tag backgrounds).
- **Index 2**: Hover background tint.
- **Index 3**: Border and separator tint.
- **Index 4**: Sub-primary accent tint.
- **Index 5**: Primary hover state (`#4096ff` for blue).
- **Index 6**: Primary default state (`#1677ff` for blue).
- **Index 7**: Primary active/pressed state (`#0958d9` for blue).
- **Index 8**: High-contrast active text.
- **Index 9**: Deep chart elements.
- **Index 10**: High-contrast borders in dark theme.

---

## 2. Functional Status Colors

| Status | Seed Color (Index 6) | Background Tint (Index 1) | Border Tint (Index 3) | Hover (Index 5) | Active (Index 7) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Success** | `#52C41A` | `#F6FFED` | `#B7EB8F` | `#73D13D` | `#389E0D` |
| **Warning** | `#FAAD14` | `#FFFBE6` | `#FFE58F` | `#FFC53D` | `#D48806` |
| **Error** | `#FF4D4F` | `#FFF2F0` | `#FFA39E` | `#FF7875` | `#D9363E` |
| **Info** | `#1677FF` | `#E6F4FF` | `#91CAFF` | `#4096FF` | `#0958D9` |

---

## 3. Neutral Alpha Matrix (Light Theme)

Neutral text and surfaces use black opacity over background surfaces:

| Role | Alpha Value | Solid Equivalent | Application |
| :--- | :--- | :--- | :--- |
| **Heading & Emphasis** | `rgba(0, 0, 0, 0.88)` | `#1F1F1F` | Titles, primary metrics, table headers |
| **Body Text** | `rgba(0, 0, 0, 0.65)` | `#595959` | Form inputs, paragraph text, menu items |
| **Tertiary / Subtitle** | `rgba(0, 0, 0, 0.45)` | `#8C8C8C` | Captions, breadcrumbs, counter labels |
| **Disabled / Placeholder** | `rgba(0, 0, 0, 0.25)` | `#BFBFBF` | Disabled controls, text placeholders |
| **Hover Fill** | `rgba(0, 0, 0, 0.06)` | `#F0F0F0` | Button hover fill, selected row background |
| **Border** | `rgba(0, 0, 0, 0.15)` | `#D9D9D9` | Standard component borders |
| **Split Line** | `rgba(5, 5, 5, 0.06)` | `#F0F0F0` | Table row dividers |
