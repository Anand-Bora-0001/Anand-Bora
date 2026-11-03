import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Theme model
 *   preference: what the visitor chose — "system" (default), "light" or "dark".
 *   theme:      what is actually shown, resolved from the preference and the OS.
 *
 * index.html applies the same rules before React loads, so there is no flash.
 * The resolved theme lives on <html data-theme>, which is all CSS needs.
 */
export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

const STORAGE_KEY = "theme";
const darkQuery = "(prefers-color-scheme: dark)";
// index.html defaults to dark unless the OS asks for light; keep both in step.

const readPreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* storage blocked: fall back to the OS */
  }
  return "system";
};
const systemTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
const resolve = (preference: ThemePreference): Theme =>
  preference === "system" ? systemTheme() : preference;

function apply(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  const bg = getComputedStyle(root).getPropertyValue("--color-bg").trim();
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg);
}

interface ThemeContextValue {
  theme: Theme;
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readPreference);
  const [theme, setTheme] = useState<Theme>(() => resolve(readPreference()));

  useEffect(() => {
    const next = resolve(preference);
    apply(next);
    setTheme(next);
    if (preference !== "system") return;
    const media = window.matchMedia(darkQuery);
    const onChange = () => {
      const followed = systemTheme();
      apply(followed);
      setTheme(followed);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);

  // Keep other open tabs in step.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setPreferenceState(readPreference());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked: the choice still applies for this visit */
    }
    setPreferenceState(next);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      preference,
      setPreference,
      toggle: () => setPreference(theme === "dark" ? "light" : "dark"),
    }),
    [theme, preference, setPreference],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
  return context;
}
