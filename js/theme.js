/**
 * js/theme.js — Aasara Global Theme Manager
 * ------------------------------------------
 * Manages the dark / light mode toggle across every page.
 *
 * HOW IT WORKS
 * ------------
 * 1. On load, reads 'aasara_theme' from localStorage ('dark' or 'light').
 *    If nothing is stored, defaults to 'light'.
 * 2. Applies 'data-theme="dark"' on <html> when dark mode is active.
 *    All colour tokens in style.css respond to this attribute.
 * 3. injectThemeToggle() creates the 🌙/☀️ button and appends it wherever
 *    the calling page specifies (or falls back to document.body).
 *
 * PUBLIC API
 * ----------
 *   applyTheme()           — read localStorage and apply to <html>
 *   toggleTheme()          — flip between dark and light, save to localStorage
 *   injectThemeToggle(el)  — insert the toggle button into el (optional)
 */

(function () {
  'use strict';

  const KEY = 'aasara_theme';

  function applyTheme() {
    const stored = localStorage.getItem(KEY) || 'light';
    document.documentElement.setAttribute('data-theme', stored);
    // Update any already-rendered toggle buttons
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.textContent  = stored === 'dark' ? '☀️' : '🌙';
      btn.title        = stored === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      btn.setAttribute('aria-label', btn.title);
    });
  }

  function toggleTheme() {
    const current = localStorage.getItem(KEY) || 'light';
    const next    = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(KEY, next);
    applyTheme();
  }

  function injectThemeToggle(container) {
    const btn = document.createElement('button');
    btn.className  = 'theme-toggle-btn';
    btn.type       = 'button';
    const stored   = localStorage.getItem(KEY) || 'light';
    btn.textContent = stored === 'dark' ? '☀️' : '🌙';
    btn.title       = stored === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    btn.setAttribute('aria-label', btn.title);
    btn.addEventListener('click', toggleTheme);
    (container || document.body).appendChild(btn);
    return btn;
  }

  // Apply on script load immediately so there is no flash of wrong theme
  applyTheme();

  // Expose globally
  window.applyTheme       = applyTheme;
  window.toggleTheme      = toggleTheme;
  window.injectThemeToggle = injectThemeToggle;
})();
