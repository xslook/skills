# Components Overview & Interaction Contracts

The system provides **72 standardized components** categorized into 7 domains.

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

All interactive components must adhere to the 8 standard states:

| State | Trigger | Visual Presentation | Token Binding |
| :--- | :--- | :--- | :--- |
| **1. Normal** | Resting state, ready for interaction. | Neutral border and text on white container surface. | `colorBgContainer`, `colorBorder`, `colorText` |
| **2. Hover** | Pointer enters boundary. | Highlighted one step (`Index 5`); cursor changes to `pointer`. | `colorPrimaryHover`, `colorBgTextHover` |
| **3. Active / Pressed** | Pointer clicked and held. | Darkened one step (`Index 7`); subtle physical depression or ripple. | `colorPrimaryActive`, `colorBgTextActive` |
| **4. Focus** | Keyboard Tab navigation or click into input. | **2px/3px focus outline ring**; border switches to primary color. Never remove without replacement. | `controlOutline`, `colorPrimary` |
| **5. Selected / Checked** | Active toggle or selected item. | Solid primary fill or tinted background with checkmark indicator. | `controlItemBgActive`, `colorPrimary` |
| **6. Disabled** | Inactive or unauthorized. | Gray background, muted text (25% opacity), cursor `not-allowed`, all events blocked. | `colorBgContainerDisabled`, `colorTextDisabled` |
| **7. Loading** | In-flight async submission. | Embedded circular spinner; dimensions preserved; repeat clicks blocked. | `opacityLoading` (`0.65`) |
| **8. Error / Warning** | Validation failure. | Red/gold border; focus outline switches to matching tint. | `colorError`, `colorErrorOutline` |

---

## 3. Standard Control Sizes

| Tier | Height | Font Size / Line Height | Horizontal Padding | Target Context |
| :--- | :--- | :--- | :--- | :--- |
| **Small (sm)** | `24px` | `12px / 20px` | `8px` | High-density tables, compact toolbars |
| **Middle (md / default)** | `32px` | `14px / 22px` | `12px` | **Default standard**: Common forms, dialog buttons |
| **Large (lg)** | `40px` | `16px / 24px` | `16px` | Login screens, hero search inputs |
