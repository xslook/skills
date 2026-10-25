/**
 * Minimal Toast Notification Manager
 * Uses strictly textContent to avoid XSS vulnerabilities.
 */

let region = null;

function ensureRegion() {
  if (!region || !region.isConnected) {
    region = document.getElementById('toast-region');
    if (!region) {
      region = document.createElement('div');
      region.id = 'toast-region';
      region.className = 'toast-region';
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
  }
  return region;
}

export const Toast = {
  show(title, description = '', { variant = 'default', duration = 4000 } = {}) {
    const container = ensureRegion();

    const toast = document.createElement('div');
    toast.className = `toast ${variant !== 'default' ? `toast-${variant}` : ''}`;
    toast.setAttribute('role', variant === 'error' ? 'alert' : 'status');

    const content = document.createElement('div');
    content.className = 'toast-content';

    const titleEl = document.createElement('div');
    titleEl.className = 'toast-title';
    titleEl.textContent = title;
    content.appendChild(titleEl);

    if (description) {
      const descEl = document.createElement('div');
      descEl.className = 'toast-description';
      descEl.textContent = description;
      content.appendChild(descEl);
    }

    toast.appendChild(content);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn btn-ghost btn-xs';
    closeBtn.textContent = '✕';
    closeBtn.setAttribute('aria-label', 'Dismiss');
    closeBtn.onclick = () => toast.remove();
    toast.appendChild(closeBtn);

    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        if (toast.isConnected) {
          toast.style.opacity = '0';
          toast.style.transform = 'translateY(0.5rem)';
          setTimeout(() => toast.remove(), 200);
        }
      }, duration);
    }

    return toast;
  },

  success(title, description = '', options = {}) {
    return this.show(title, description, { ...options, variant: 'success' });
  },

  error(title, description = '', options = {}) {
    return this.show(title, description, { ...options, variant: 'error' });
  },
};
