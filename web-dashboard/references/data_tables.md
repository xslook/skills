# Data Tables & Server-Driven Grid Specification

This guide defines the architecture and markup patterns for high-performance, server-driven data tables with sorting, filtering, row selection, and pagination.

---

## 1. Architectural Philosophy: URL as Source of Truth

Rather than storing sorting, filtering, and page offsets in client JavaScript memory (as with TanStack Table), the URL is the definitive source of truth:

```text
/dashboard/invoices?q=acme&status=paid&sort=amount&dir=desc&page=2
```

1. **Deterministic & Bookmarkable**: Refreshing or sharing the URL always yields the exact same filtered table view.
2. **Instant SSR**: The first page view renders immediately on the server.
3. **Progressive Enhancement via Swap**: Changing a filter, clicking a column header, or paginating dispatches an `X-Fragment` fetch and swaps only the `<data-table>` card without reloading the entire page.

---

## 2. Table Component Anatomy

```html
<data-table id="invoices-table" class="card">
  <!-- 1. Header Toolbar -->
  <div class="card-header">
    <div class="card-header-row">
      <div>
        <h3 class="card-title">Invoices</h3>
        <p class="card-description">Manage and inspect customer billing.</p>
      </div>

      <!-- Filter Form (Enhanced by data-swap) -->
      <form action="/dashboard/invoices" method="GET" data-swap="invoices-table" class="flex items-center gap-2">
        <div class="input-icon-group" style="width: 14rem;">
          <svg class="icon"><use href="/static/icons/sprite.svg#search"/></svg>
          <input type="search" name="q" value="{{ .Query }}" placeholder="Filter invoices..." class="input input-sm">
        </div>

        <select name="status" class="select" style="height: 2rem; font-size: 0.8125rem;">
          <option value="">All Statuses</option>
          <option value="paid" {{ if eq .Status "paid" }}selected{{ end }}>Paid</option>
          <option value="pending" {{ if eq .Status "pending" }}selected{{ end }}>Pending</option>
          <option value="failed" {{ if eq .Status "failed" }}selected{{ end }}>Failed</option>
        </select>
        <button type="submit" class="btn btn-outline btn-sm">Filter</button>
      </form>
    </div>
  </div>

  <!-- 2. Bulk Selection Floating / Docked Bar -->
  <div class="table-bulk-bar" data-visible="false">
    <div class="flex items-center gap-2">
      <span class="font-semibold text-foreground"><span data-selection-count>0</span> selected</span>
    </div>
    <div class="flex items-center gap-2">
      <button type="button" class="btn btn-outline btn-xs" data-action="export-selected">Export</button>
      <button type="button" class="btn btn-destructive btn-xs" data-action="delete-selected">Delete</button>
    </div>
  </div>

  <!-- 3. Table Element -->
  <div class="table-wrapper" style="border: none; border-radius: 0;">
    <table class="table">
      <thead>
        <tr>
          <th style="width: 40px;">
            <input type="checkbox" class="checkbox" aria-label="Select all rows">
          </th>
          <th aria-sort="{{ .InvoiceSortState }}">
            <a href="{{ .InvoiceSortURL }}" data-swap="invoices-table" class="table-sort-btn">
              <span>Invoice</span>
              <svg class="icon"><use href="/static/icons/sprite.svg#arrow-up-down"/></svg>
            </a>
          </th>
          <th>Status</th>
          <th aria-sort="{{ .AmountSortState }}">
            <a href="{{ .AmountSortURL }}" data-swap="invoices-table" class="table-sort-btn">
              <span>Amount</span>
              <svg class="icon"><use href="/static/icons/sprite.svg#arrow-up-down"/></svg>
            </a>
          </th>
          <th>Date</th>
          <th style="width: 50px;"></th>
        </tr>
      </thead>
      <tbody>
        {{ range .Items }}
        <tr>
          <td><input type="checkbox" value="{{ .ID }}" class="checkbox" aria-label="Select row {{ .InvoiceNumber }}"></td>
          <td class="font-medium">{{ .InvoiceNumber }}</td>
          <td><span class="badge badge-{{ .StatusBadgeVariant }}">{{ .Status }}</span></td>
          <td class="font-medium">${{ .Amount }}</td>
          <td class="text-muted">{{ .FormattedDate }}</td>
          <td class="text-right">
            <button type="button" class="btn btn-ghost btn-icon btn-xs" aria-label="Actions">
              <svg class="icon"><use href="/static/icons/sprite.svg#ellipsis"/></svg>
            </button>
          </td>
        </tr>
        {{ else }}
        <tr>
          <td colspan="6" class="text-center py-8 text-muted">
            No matching records found.
          </td>
        </tr>
        {{ end }}
      </tbody>
    </table>
  </div>

  <!-- 4. Pagination Footer -->
  <div class="pagination">
    <span class="text-muted">Showing <strong>{{ .StartItem }}</strong> to <strong>{{ .EndItem }}</strong> of <strong>{{ .TotalCount }}</strong> entries</span>
    <ul class="pagination-links">
      <li>
        <a href="{{ .PrevPageURL }}" data-swap="invoices-table" class="pagination-link {{ if not .HasPrev }}disabled{{ end }}">Previous</a>
      </li>
      {{ range .Pages }}
      <li>
        <a href="{{ .URL }}" data-swap="invoices-table" class="pagination-link {{ if .IsActive }}active{{ end }}">{{ .Number }}</a>
      </li>
      {{ end }}
      <li>
        <a href="{{ .NextPageURL }}" data-swap="invoices-table" class="pagination-link {{ if not .HasNext }}disabled{{ end }}">Next</a>
      </li>
    </ul>
  </div>
</data-table>
```

---

## 3. Client Ergonomics (`<data-table>`)

The `<data-table>` Custom Element (`static/js/components/data-table.js`) handles:
1. **Header Checkbox Sync**:
   - Checking the header checkbox checks all row checkboxes.
   - If some rows (but not all) are selected, the header checkbox enters an `indeterminate` state.
2. **Selected Row Styling**:
   - Automatically sets `data-state="selected"` on `<tr>` when its checkbox is checked.
   - Modern browsers also apply `:has(input[type="checkbox"]:checked)` for instant styling.
3. **Dynamic Bulk Bar**:
   - When 1 or more rows are selected, `.table-bulk-bar` becomes visible and updates the count element `[data-selection-count]`.
4. **Search Debounce**:
   - Any `<input type="search">` inside the table card automatically debounces typing by 300ms before calling `form.requestSubmit()`, triggering an instant fragment update.
