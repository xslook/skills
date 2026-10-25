/**
 * <app-sidebar> Custom Element
 * Manages desktop icon-rail toggle, mobile sheet toggle, backdrop,
 * and cookie persistence for SSR.
 */

const SIDEBAR_COOKIE = 'sidebar_state';

export class AppSidebar extends HTMLElement {
  connectedCallback() {
    this.backdrop = document.querySelector('.sidebar-backdrop');
    this.setupListeners();
    this.restoreState();
  }

  setupListeners() {
    // Listen for toggle actions from site-header button
    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-action="toggle-sidebar"]');
      if (toggleBtn) {
        this.toggle();
      }
    });

    // Mobile backdrop click to close
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => {
        this.setMobileOpen(false);
      });
    }

    // Keyboard shortcut (⌘+B or Ctrl+B)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  restoreState() {
    // If not already set by SSR, read from cookie or default to expanded
    if (!this.hasAttribute('data-state')) {
      const match = document.cookie.match(new RegExp(`(?:^|; )${SIDEBAR_COOKIE}=([^;]*)`));
      const state = match ? decodeURIComponent(match[1]) : 'expanded';
      this.setAttribute('data-state', state);
    }
  }

  toggle() {
    if (window.innerWidth <= 768) {
      const isOpen = this.getAttribute('data-mobile-open') === 'true';
      this.setMobileOpen(!isOpen);
    } else {
      const current = this.getAttribute('data-state') || 'expanded';
      const next = current === 'expanded' ? 'collapsed' : 'expanded';
      this.setAttribute('data-state', next);
      document.cookie = `${SIDEBAR_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    }
  }

  setMobileOpen(open) {
    this.setAttribute('data-mobile-open', open ? 'true' : 'false');
    if (this.backdrop) {
      this.backdrop.setAttribute('data-state', open ? 'open' : 'closed');
    }
    document.body.style.overflow = open ? 'hidden' : '';
  }
}

if (!customElements.get('app-sidebar')) {
  customElements.define('app-sidebar', AppSidebar);
}
