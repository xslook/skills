/**
 * Delegated Action Registry
 * Strictly avoids inline `onclick="..."` for strict CSP compliance.
 */

const actions = new Map();

/**
 * Register an action handler:
 * registerAction('toggle-sidebar', (el, event) => { ... })
 */
export function registerAction(name, handler) {
  actions.set(name, handler);
}

/**
 * Initializes global event delegation.
 */
export function initActions() {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-action]');
    if (!trigger) return;

    const actionName = trigger.dataset.action;
    const handler = actions.get(actionName);
    if (handler) {
      handler(trigger, event);
    } else {
      console.warn(`[web-dashboard] No action registered for: "${actionName}"`);
    }
  });

  // Native Dialog standard actions
  registerAction('open-dialog', (trigger) => {
    const targetId = trigger.dataset.target;
    const dialog = document.getElementById(targetId);
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  });

  registerAction('close-dialog', (trigger) => {
    const dialog = trigger.closest('dialog');
    if (dialog && typeof dialog.close === 'function') {
      dialog.close();
    }
  });
}
