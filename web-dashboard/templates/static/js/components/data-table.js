/**
 * <data-table> Custom Element
 * Manages client-side table ergonomics: row selection, bulk bar counter,
 * and debounced filter inputs.
 */

export class DataTable extends HTMLElement {
  connectedCallback() {
    this.table = this.querySelector('table');
    this.selectAllCheckbox = this.querySelector('th input[type="checkbox"]');
    this.rowCheckboxes = Array.from(this.querySelectorAll('tbody td input[type="checkbox"]'));
    this.bulkBar = this.querySelector('.table-bulk-bar');
    this.countEl = this.querySelector('[data-selection-count]');

    this.bindEvents();
    this.updateSelectionState();
  }

  bindEvents() {
    if (this.selectAllCheckbox) {
      this.selectAllCheckbox.addEventListener('change', (e) => {
        const checked = e.target.checked;
        this.rowCheckboxes.forEach((cb) => {
          cb.checked = checked;
          const tr = cb.closest('tr');
          if (tr) tr.setAttribute('data-state', checked ? 'selected' : '');
        });
        this.updateSelectionState();
      });
    }

    if (this.table) {
      this.table.addEventListener('change', (e) => {
        if (e.target.matches('tbody td input[type="checkbox"]')) {
          const tr = e.target.closest('tr');
          if (tr) tr.setAttribute('data-state', e.target.checked ? 'selected' : '');
          this.updateSelectionState();
        }
      });
    }

    // Debounced search input handler if present inside the table card toolbar
    const searchInput = this.querySelector('input[type="search"], input[name="q"]');
    if (searchInput) {
      let timeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const form = searchInput.closest('form');
          if (form) form.requestSubmit();
        }, 300);
      });
    }
  }

  updateSelectionState() {
    const total = this.rowCheckboxes.length;
    const selected = this.rowCheckboxes.filter((cb) => cb.checked).length;

    if (this.selectAllCheckbox) {
      this.selectAllCheckbox.checked = selected === total && total > 0;
      this.selectAllCheckbox.indeterminate = selected > 0 && selected < total;
    }

    if (this.countEl) {
      this.countEl.textContent = selected.toString();
    }

    if (this.bulkBar) {
      this.bulkBar.setAttribute('data-visible', selected > 0 ? 'true' : 'false');
    }
  }
}

if (!customElements.get('data-table')) {
  customElements.define('data-table', DataTable);
}
