/**
 * Pure Vanilla HTML Fragment Swap Protocol (~60 LoC)
 * Replaces heavy client-side frameworks with server-rendered partial swaps.
 */

/**
 * Fetch an HTML fragment from `url` and swap the element `#${targetId}` in place.
 */
export async function swap(url, targetId, { push = false, replaceHistory = true, init = {} } = {}) {
  const target = document.getElementById(targetId);
  if (!target) {
    console.warn(`[web-dashboard] Swap target #${targetId} not found in DOM.`);
    return;
  }

  target.setAttribute('aria-busy', 'true');
  const headers = {
    'X-Fragment': targetId,
    Accept: 'text/html',
    ...init.headers,
  };

  try {
    const res = await fetch(url, {
      ...init,
      headers,
      credentials: 'same-origin',
    });

    if (res.status === 401) {
      window.location.assign('/login');
      return;
    }
    if (res.status === 204) return;

    const html = await res.text();
    const template = document.createElement('template');
    template.innerHTML = html;

    const next = template.content.getElementById(targetId) || template.content.firstElementChild;
    if (next) {
      target.replaceWith(next);
      if (push) {
        history.pushState({ targetId, url }, '', url);
      } else if (replaceHistory && init.method !== 'POST') {
        history.replaceState({ targetId, url }, '', url);
      }
      document.dispatchEvent(new CustomEvent('ui:swapped', { detail: { targetId, element: next, url } }));
    } else {
      console.error(`[web-dashboard] Fragment for #${targetId} not found in response.`);
    }
  } catch (err) {
    console.error(`[web-dashboard] Swap failed for #${targetId}:`, err);
  } finally {
    const el = document.getElementById(targetId);
    if (el) el.removeAttribute('aria-busy');
  }
}

/**
 * Auto-enhance links and forms with [data-swap="target-id"].
 */
export function initSwapEnhancements() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-swap]');
    if (!link || e.ctrlKey || e.metaKey || e.shiftKey || link.target) return;
    e.preventDefault();
    const targetId = link.dataset.swap;
    swap(link.href, targetId, { replaceHistory: true });
  });

  document.addEventListener('submit', (e) => {
    const form = e.target.closest('form[data-swap]');
    if (!form) return;
    e.preventDefault();

    const targetId = form.dataset.swap;
    const method = (form.method || 'GET').toUpperCase();
    const action = form.action || window.location.href;

    if (method === 'GET') {
      const url = new URL(action, window.location.origin);
      const formData = new FormData(form);
      for (const [key, value] of formData.entries()) {
        if (value) url.searchParams.set(key, value.toString());
        else url.searchParams.delete(key);
      }
      swap(url.toString(), targetId, { replaceHistory: true });
    } else {
      const formData = new FormData(form);
      swap(action, targetId, {
        init: { method: 'POST', body: formData },
        replaceHistory: false,
      });
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.targetId && e.state.url) {
      swap(e.state.url, e.state.targetId, { push: false, replaceHistory: false });
    }
  });
}
