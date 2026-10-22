# Components Overview & Universal Interaction Contracts

The design system provides **72 standardized components** categorized across 7 functional domains.

---

## 1. Classification Matrix

| Domain | Count | Components |
| :--- | :--- | :--- |
| **General** | 4 | Button, FloatButton, Icon, Typography |
| **Layout** | 7 | Divider, Flex, Grid, Layout, Masonry, Space, Splitter |
| **Navigation** | 8 | Affix, Anchor, Breadcrumb, Dropdown, Menu, Pagination, Steps, Tabs |
| **Data Entry** | 18 | AutoComplete, Cascader, Checkbox, ColorPicker, DatePicker, Form, Input, InputNumber, Mentions, Radio, Rate, Select, Slider, Switch, TimePicker, Transfer, TreeSelect, Upload |
| **Data Display** | 21 | Avatar, Badge, Calendar, Card, Carousel, Collapse, Descriptions, Empty, Image, List, Listy, Popover, QRCode, Segmented, Statistic, Table, Tag, Timeline, Tooltip, Tour, Tree |
| **Feedback** | 11 | Alert, Drawer, Message, Modal, Notification, Popconfirm, Progress, Result, Skeleton, Spin, Watermark |
| **Other** | 3 | App, BorderBeam, ConfigProvider |

---

## 2. Universal Interaction States Contract

All interactive controls (buttons, inputs, selects, toggles, menu items, and clickable cards/rows) adhere to the 8 standard interaction states:

| State | Trigger | Visual Presentation | CSS Token Binding |
| :--- | :--- | :--- | :--- |
| **1. Normal** | Resting state, ready for interaction. | Neutral border (`--border` / `--input`) and foreground text (`--foreground`) on container surface (`--surface-1`). | `--surface-1`, `--border`, `--foreground` |
| **2. Hover** | Pointer enters boundary. | Primary fills transition to `--primary-hover`; subtle controls apply `--accent` fill; cursor becomes `pointer`. | `--primary-hover`, `--accent`, `--muted-foreground` |
| **3. Active / Pressed** | Pointer clicked and held (`:active`). | Primary fills transition to `--primary-active`; secondary fills transition to `--secondary-active`. | `--primary-active`, `--secondary-active` |
| **4. Focus** | Keyboard `Tab` navigation (`:focus-visible`) or input focus. | **2px focus outline ring** (`outline: 2px solid var(--ring); outline-offset: 2px`). Never remove without replacement. | `--ring`, `--foreground` |
| **5. Selected / Checked** | Active toggle, checked state, or current route. | Solid `--primary` fill (checkbox/radio/switch) or `--secondary` / `--sidebar-accent` highlight with medium/semibold weight. | `--primary`, `--secondary`, `--sidebar-accent` |
| **6. Disabled** | Inactive or unauthorized (`disabled` / `aria-disabled="true"`). | Opacity reduced (`0.5`), text muted (`--text-3`), cursor `not-allowed`, pointer events blocked. | `--text-3`, `opacity: 0.5` |
| **7. Loading** | In-flight async submission (`aria-busy="true"`). | Embedded circular spinner; outer width/height preserved to prevent layout shift; duplicate clicks blocked. | `aria-busy="true"`, `opacity: 0.65` |
| **8. Error / Warning** | Validation failure (`aria-invalid="true"`). | Border switches to `--destructive` (or `--warning`); focus ring matches status color; error message linked via `aria-describedby`. | `--destructive`, `--warning` |

---

## 3. Standard Control Height Tiers

Interactive form controls, buttons, and toolbar items align to 4 height tiers on the `4px`/`8px` spatial grid:

| Tier | CSS Token | Height | Font Size / Line Height | Horizontal Padding | Target Context |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Extra-Small (xs)** | `--control-height-xs` | `24px` | `12px / 20px` | `6px–8px` | Inline table action chips, micro badges, compact tags |
| **Small (sm)** | `--control-height-sm` | `32px` | `12px / 20px` | `12px` (`0.75rem`) | **Compact density mode**, table filter bars, header secondary buttons |
| **Default (md)** | `--control-height` | **`36px`** | `14px / 22px` | `16px` (`1rem`) | **Default standard**: Common forms, dialog actions, primary buttons |
| **Large (lg)** | `--control-height-lg` | `40px` | `16px / 24px` | `24px` (`1.5rem`) | **Loose density mode**, login forms, hero search inputs, touch targets |
