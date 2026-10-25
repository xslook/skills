/**
 * Theme Manager
 * Manages light / dark / system theme modes.
 * Synchronizes both localStorage and a `theme` cookie so the Go/Rust backend
 * can render `<html class="dark">` server-side to prevent theme flash (FOUC).
 */

const THEME_COOKIE = 'theme';
const THEME_STORAGE = 'theme';

export function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_STORAGE);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

  localStorage.setItem(THEME_STORAGE, theme);
  // 1 year cookie accessible by Go/Rust server
  document.cookie = `${THEME_COOKIE}=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`;

  document.dispatchEvent(new CustomEvent('ui:theme-changed', { detail: { theme, isDark } }));
}

export function toggleTheme() {
  const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

export function initTheme() {
  // Listen for OS scheme change if user hasn't set an explicit preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(THEME_STORAGE)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}
