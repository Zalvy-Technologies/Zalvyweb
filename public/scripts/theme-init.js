/**
 * ZALVY — pre-hydration theme resolver.
 *
 * Runs synchronously before first paint to avoid a flash of the wrong theme
 * (FOUC). Reads the persisted theme (or the OS preference) and sets
 * `data-theme` on <html> before React hydrates.
 *
 * Kept as an external file (loaded via `script-src 'self'`) because inline
 * scripts are blocked by the site's nonce-based CSP: the App Router renderer
 * only attaches nonces to scripts it manages itself, so an inline
 * `dangerouslySetInnerHTML` script would never execute.
 */
(function () {
  try {
    var key = "zalvy-theme";
    var stored = localStorage.getItem(key);
    var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    var theme = stored || (prefersLight ? "light" : "dark");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === "light" ? "light" : "dark";
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }
})();