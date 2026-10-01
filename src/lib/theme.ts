/**
 * ZALVY theme contract + helpers.
 *
 * The theme is persisted in localStorage and toggled at the document level via
 * a `data-theme` attribute consumed by tokens.css. The provider runs both
 * on the server (where defaults are computed) and on the client (where the
 * toggle is fully interactive). A pre-hydration inline script (in layout.tsx)
 * applies the saved theme before paint to prevent FOUC.
 */
export const THEMES = ["dark", "light", "high-contrast", "system"] as const;
export type Theme = (typeof THEMES)[number];

export const THEME_STORAGE_KEY = "zalvy-theme";

/**
 * Resolve the user's effective theme — `system` becomes a concrete dark/light
 * by consulting prefers-color-scheme in the client. Server defaults to dark.
 */
export function resolveSystemTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function resolveStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (raw && THEMES.includes(raw as Theme)) return raw as Theme;
    return null;
  } catch {
    return null;
  }
}

export function applyTheme(theme: Theme): Theme {
  const resolved = theme === "system" ? resolveSystemTheme() : theme;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = resolved;
  }
  return resolved;
}
