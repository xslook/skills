# Interactivity & Client Scripting Standards

This guide outlines conventions for JavaScript architecture, event delegation, custom elements, and safe DOM manipulation.

---

## 1. JavaScript Modular Architecture

Interactivity is strictly additive (progressive enhancement) and organized into clean ES modules:

```text
static/js/
├── app.js             # Entry module: initializes theme, actions, swap & components
├── core/              # Shared infrastructure utilities
│   ├── actions.js     # Global delegated action registry (CSP compliant)
│   ├── api.js         # Unified Fetch client
│   ├── dom.js         # Lightweight DOM and script loading helpers
│   ├── swap.js        # Fragment swap protocol (~60 LoC)
│   ├── theme.js       # Dark mode & cookie sync
│   └── toast.js       # Safe text-based toast alerts
└── components/        # Light-DOM Custom Elements
    ├── app-sidebar.js # <app-sidebar>
    ├── chart-card.js  # <chart-card>
    └── data-table.js  # <data-table>
```

---

## 2. CSP-Strict Delegated Action Registry (`data-action`)

### 2.1 The Problem with Inline Handlers
Inline script attributes (`onclick="handleClick()"`) violate strict Content Security Policies (`script-src 'self' 'nonce-...'`).

### 2.2 Registering & Invoking Actions
1. **Markup Contract**:
   ```html
   <button type="button" class="btn btn-outline" data-action="export-table" data-format="csv">
     Export CSV
   </button>
   ```
2. **Registration in Module**:
   ```javascript
   import { registerAction } from './core/actions.js';

   registerAction('export-table', (trigger, event) => {
     const format = trigger.dataset.format;
     console.log(`Exporting table as ${format}`);
   });
   ```
3. A single global listener on `document` catches clicked elements matching `[data-action]` and dispatches to the registered handler.

---

## 3. Light-DOM Custom Elements

All custom elements in the dashboard use **Light DOM** (no `attachShadow()`):
- **Why Light DOM?**: Shadow DOM encapsulates styles and prevents external CSS from penetrating the component. With Light DOM, all design tokens, utilities, and `@layer` rules apply directly without cumbersome CSS parts or duplicated stylesheets.

### 3.1 Custom Element Lifecycle Rules
1. **Idempotent `connectedCallback()`**:
   - Ensure event listeners are not duplicated if elements are disconnected and reconnected during fragment swaps.
2. **Mandatory `disconnectedCallback()`**:
   - Always remove global document listeners, mutation observers, or interval timers when the component unmounts.
3. **No Direct `innerHTML` Assignment**:
   - Never inject raw untrusted server text into `innerHTML`. Use `textContent` for strings or the trusted fragment template mechanism in `swap.js`.

---

## 4. Toast Notifications API

The global `Toast` helper provides safe, asynchronous user notifications:

```javascript
import { Toast } from './static/js/app.js';

// Success Notification
Toast.success('Database Clustered', 'New replica node joined the cluster.');

// Error Notification
Toast.error('Operation Failed', 'Insufficient permissions to delete invoice.');

// Custom Duration
Toast.show('Notice', 'Session will expire in 5 minutes.', { duration: 8000 });
```

All titles and descriptions are assigned via `.textContent`, neutralizing potential XSS injection vectors from error messages.

---

## 5. Keyboard Navigation & Accessibility Shortcuts

The shell registers global keyboard ergonomics:
- `⌘ + B` or `Ctrl + B`: Toggles the sidebar between expanded and collapsed icon-rail state.
- `Escape`: Closes open `<dialog>` modals and mobile off-canvas drawers.
- Focus trapping is natively provided by modern browsers when calling `dialog.showModal()`.
