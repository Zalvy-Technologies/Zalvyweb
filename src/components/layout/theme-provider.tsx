"use client";

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { THEME_STORAGE_KEY, applyTheme, resolveStoredTheme, type Theme, THEMES } from "@/lib/theme";

interface ThemeContextValue {
  theme: Theme;
  resolved: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
  themes: readonly Theme[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
}

const THEME_KEY = THEME_STORAGE_KEY;

/**
 * `ThemeProvider` — single client boundary where ZALVY's theme state lives.
 *
 * Theme resolution strategy:
 *  - The stored value is read once via `useSyncExternalStore` (subscribes to
 *    `storage` events across tabs) and cached server-side as `null` (dark default).
 *  - `prefers-color-scheme` is observed via matchMedia and triggers re-render
 *    only when the user's preference is `system`.
 *  - The pre-hydration script (see `app/layout.tsx`) applies `data-theme`
 *    synchronously before paint so there's no FOUC.
 */
function subscribeTheme(callback: () => void): () => void {
  if (typeof window === "undefined") return noop;
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
}

function noop() {
  /* SSR has no window — nothing to unsubscribe. */
}

function getStoredSnapshot(): Theme | null {
  if (typeof window === "undefined") return null;
  return resolveStoredTheme();
}

function getServerSnapshot(): null {
  return null;
}

/** Sink for `media.addEventListener` — kept named so lint is satisfied. */
function subscribeMediaPrefersLight(onChange: () => void): () => void {
  if (typeof window === "undefined") return noop;
  const media = window.matchMedia("(prefers-color-scheme: light)");
  media.addEventListener("change", onChange);
  return () => {
    media.removeEventListener("change", onChange);
  };
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  enableSystem = true,
}: ThemeProviderProps) {
  const stored = useSyncExternalStore(subscribeTheme, getStoredSnapshot, getServerSnapshot);
  const [userChoice, setUserChoice] = useState<Theme | null>(null);
  const prefersLight = useSyncExternalStore(
    subscribeMediaPrefersLight,
    () =>
      typeof window === "undefined"
        ? false
        : window.matchMedia("(prefers-color-scheme: light)").matches,
    () => false,
  );

  const theme: Theme = userChoice ?? stored ?? (enableSystem ? "system" : defaultTheme);
  const resolved: Theme = theme === "system" ? (prefersLight ? "light" : "dark") : theme;

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  const setTheme = useCallback((next: Theme) => {
    setUserChoice(next);
    try {
      window.localStorage.setItem(THEME_KEY, next);
      window.dispatchEvent(new StorageEvent("storage", { key: THEME_KEY }));
    } catch {
      /* localStorage may be blocked (SSR / privacy mode) — silently ignore. */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(resolved === "dark" ? "light" : "dark");
  }, [resolved, setTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolved, setTheme, toggle, themes: THEMES }),
    [theme, resolved, setTheme, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within <ThemeProvider />.");
  }
  return ctx;
}
