/**
 * Core DOM & Scripting Utilities
 * Baseline 2024+
 */

export const qs = (selector, parent = document) => parent.querySelector(selector);
export const qsa = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

export const on = (element, event, handler, options) => {
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
};

/**
 * Safely parse a JSON data island (<script type="application/json" id="...">).
 * Avoids inline script execution and keeps data separate from HTML attributes.
 */
export function readJSONIsland(idOrElement) {
  const el = typeof idOrElement === 'string' ? document.getElementById(idOrElement) : idOrElement;
  if (!el) return null;
  try {
    return JSON.parse(el.textContent || '{}');
  } catch (err) {
    console.error(`Failed to parse JSON island [${el.id}]:`, err);
    return null;
  }
}

/**
 * Dynamically and idempotently loads an external script (e.g. lazy vendored Chart.js).
 */
const scriptLoads = new Map();
export function loadScript(src) {
  if (scriptLoads.has(src)) return scriptLoads.get(src);
  const promise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.dataset.loaded = 'false';
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    });
    script.addEventListener('error', (err) => reject(err));
    document.head.appendChild(script);
  });
  scriptLoads.set(src, promise);
  return promise;
}
