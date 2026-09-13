/**
 * Web Design System - Theme Manager
 * 
 * Zero-dependency theme controller for CSS custom properties.
 * Provides light/dark/system mode switching, persistence via localStorage,
 * and dynamic token inspection/manipulation.
 * Works as both an ES module and browser global (`window.ThemeManager`).
 */

(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    global.ThemeManager = factory();
  }
})(this, function () {
  'use strict';

  var STORAGE_KEY = 'ui-theme';
  var mediaQuery = typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  var currentMode = 'auto'; // 'light' | 'dark' | 'auto'

  /**
   * Determine effective theme (resolves 'auto' to 'dark' or 'light').
   * @param {string} mode - 'light', 'dark', or 'auto'
   * @returns {'light' | 'dark'}
   */
  function resolveTheme(mode) {
    if (mode === 'dark' || mode === 'light') {
      return mode;
    }
    if (mediaQuery && mediaQuery.matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Apply theme attribute to target element (default: document.documentElement).
   * @param {'light' | 'dark' | 'auto'} mode
   * @param {HTMLElement} [rootElement]
   */
  function setTheme(mode, rootElement) {
    var root = rootElement || (typeof document !== 'undefined' ? document.documentElement : null);
    if (!root) return;

    currentMode = mode;
    var effectiveTheme = resolveTheme(mode);

    root.setAttribute('data-theme', effectiveTheme);

    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      // Ignore localStorage errors (e.g. sandboxed iframe or disabled cookies)
    }

    // Dispatch custom DOM event
    if (typeof window !== 'undefined' && typeof CustomEvent === 'function') {
      var event = new CustomEvent('theme-change', {
        detail: {
          mode: mode,
          theme: effectiveTheme
        }
      });
      window.dispatchEvent(event);
    }
  }

  /**
   * Get active effective theme.
   * @returns {'light' | 'dark'}
   */
  function getTheme() {
    return resolveTheme(currentMode);
  }

  /**
   * Get configured theme mode.
   * @returns {'light' | 'dark' | 'auto'}
   */
  function getMode() {
    return currentMode;
  }

  /**
   * Toggle between light and dark themes.
   * @param {HTMLElement} [rootElement]
   * @returns {'light' | 'dark'} Newly applied effective theme
   */
  function toggleTheme(rootElement) {
    var newTheme = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(newTheme, rootElement);
    return newTheme;
  }

  /**
   * Read computed CSS custom property value.
   * @param {string} tokenName - e.g. '--primary' or 'primary'
   * @param {HTMLElement} [element]
   * @returns {string} Trimmed token value
   */
  function getToken(tokenName, element) {
    if (typeof window === 'undefined') return '';
    var el = element || document.documentElement;
    var prop = tokenName.startsWith('--') ? tokenName : '--' + tokenName;
    return window.getComputedStyle(el).getPropertyValue(prop).trim();
  }

  /**
   * Dynamically override a CSS custom property.
   * @param {string} tokenName - e.g. '--primary' or 'primary'
   * @param {string} value - CSS value string
   * @param {HTMLElement} [element]
   */
  function setToken(tokenName, value, element) {
    var el = element || (typeof document !== 'undefined' ? document.documentElement : null);
    if (!el) return;
    var prop = tokenName.startsWith('--') ? tokenName : '--' + tokenName;
    el.style.setProperty(prop, value);
  }

  /**
   * Subscribe to theme change events.
   * @param {function({ mode: string, theme: string }): void} callback
   * @returns {function(): void} Unsubscribe function
   */
  function onThemeChange(callback) {
    if (typeof window === 'undefined') return function () {};
    var handler = function (event) {
      callback(event.detail);
    };
    window.addEventListener('theme-change', handler);
    return function () {
      window.removeEventListener('theme-change', handler);
    };
  }

  /**
   * Initialize theme system.
   * Reads saved preference from localStorage and registers system dark mode listeners.
   * @param {Object} [options]
   * @param {'light' | 'dark' | 'auto'} [options.defaultTheme='auto']
   * @param {boolean} [options.syncWithSystem=true]
   * @param {HTMLElement} [options.rootElement]
   */
  function initTheme(options) {
    var opts = options || {};
    var defaultMode = opts.defaultTheme || 'auto';
    var syncWithSystem = opts.syncWithSystem !== false;
    var root = opts.rootElement || (typeof document !== 'undefined' ? document.documentElement : null);

    var savedMode = null;
    try {
      savedMode = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    var initialMode = savedMode || defaultMode;
    setTheme(initialMode, root);

    if (syncWithSystem && mediaQuery) {
      var listener = function () {
        if (currentMode === 'auto') {
          setTheme('auto', root);
        }
      };
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(listener);
      }
    }
  }

  return {
    initTheme: initTheme,
    setTheme: setTheme,
    getTheme: getTheme,
    getMode: getMode,
    toggleTheme: toggleTheme,
    getToken: getToken,
    setToken: setToken,
    onThemeChange: onThemeChange
  };
});
