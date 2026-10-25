/**
 * Application Entry Module
 * Initializes theme, actions, swap protocol, and registers components.
 * Baseline 2024+ (ES Module)
 */

import { initActions, registerAction } from './core/actions.js';
import { initSwapEnhancements, swap } from './core/swap.js';
import { initTheme, toggleTheme } from './core/theme.js';
import { Toast } from './core/toast.js';
import { API } from './core/api.js';

// Export for external page scripts if needed
export { API, Toast, swap, toggleTheme };

// Register standard global actions
registerAction('toggle-theme', () => {
  toggleTheme();
});

registerAction('dismiss-toast', (trigger) => {
  const toast = trigger.closest('.toast');
  if (toast) toast.remove();
});

// Auto-initialize core features when DOM is ready
function init() {
  initTheme();
  initActions();
  initSwapEnhancements();

  // Import custom elements to register them in CustomElementRegistry
  import('./components/app-sidebar.js');
  import('./components/data-table.js');
  import('./components/chart-card.js');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
