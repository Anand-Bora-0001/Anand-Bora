import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { THEME_PAINTED } from "./palette";
import { defaultTheme, isThemeId, themeById, type Scheme, type ThemeId, type ThemeInfo } from "./themes";

/**
 * Theme model
 *   preference: what the visitor chose — one of the themes, or "system" (default), which
 *               shows Matte Black or Flexoki to match the OS.
 *   preview:    a theme shown while the visitor browses the picker, not yet chosen.
 *   theme:      what is actually shown: the preview if there is one, else the preference.
 *
 * index.html applies the same rules before React loads, so there is no flash.
 * The shown theme lives on <html data-theme>, which is all CSS needs.
 */
export type ThemePreference = ThemeId | "system";

const STORAGE_KEY = "theme";
const lightQuery = "(prefers-color-scheme: light)";

const readPreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isThemeId(stored)) return stored;
    // Before there were eight themes the site stored "light" or "dark".
    if (stored === "light" || stored === "dark") return defaultTheme[stored];
  } catch {
    /* storage blocked: fall back to the OS */
  }
  return "system";
};
const systemTheme = (): ThemeId => defaultTheme[window.matchMedia(lightQuery).matches ? "light" : "dark"];
const resolve = (preference: ThemePreference): ThemeId => (preference === "system" ? systemTheme() : preference);

/** The theme most recently asked for. A cross-fade paints a frame later, so painting reads this
 *  rather than its own argument: whichever request came last is the one that lands. */
let wanted: string | undefined;

/** Paints a theme. Colors cross-fade where the browser supports view transitions. */
function apply(theme: ThemeId) {
  const root = document.documentElement;
  wanted ??= root.dataset.theme;
  if (wanted === theme) return;
  wanted = theme;
  const paint = () => {
    if (!wanted || root.dataset.theme === wanted) return;
    root.dataset.theme = wanted;
    const bg = getComputedStyle(root).getPropertyValue("--color-bg").trim();
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", bg);
    window.dispatchEvent(new CustomEvent(THEME_PAINTED, { detail: wanted }));
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  type Transition = { ready: Promise<void>; finished: Promise<void>; updateCallbackDone: Promise<void> };
  const doc = document as Document & { startViewTransition?: (update: () => void) => Transition };
  if (reduced || typeof doc.startViewTransition !== "function") return paint();
  // Arrowing quickly through themes starts a new fade before the last one ends; the browser
  // then skips the old one, which is expected, not an error.
  const fade = doc.startViewTransition(paint);
  for (const step of [fade.ready, fade.finished, fade.updateCallbackDone]) step.catch(() => {});
}

interface ThemeContextValue {
  /** The theme on screen (a preview, while one is showing). */
  theme: ThemeId;
  info: ThemeInfo;
  scheme: Scheme;
  /** The visitor's saved choice. */
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** Show a theme without saving it; null returns to the saved one. */
  preview: (theme: ThemeId | null) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readPreference);
  const [chosen, setChosen] = useState<ThemeId>(() => resolve(readPreference()));
  const [previewing, setPreviewing] = useState<ThemeId | null>(null);
  const theme = previewing ?? chosen;

  useEffect(() => {
    setChosen(resolve(preference));
    if (preference !== "system") return;
    const media = window.matchMedia(lightQuery);
    const onChange = () => setChosen(systemTheme());
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);

  useEffect(() => apply(theme), [theme]);

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
    // In one update, so the page never shows the old choice between the preview and the new one.
    setPreviewing(null);
    setChosen(resolve(next));
    setPreferenceState(next);
  }, []);

  const value = useMemo<ThemeContextValue>(() => {
    const info = themeById(theme);
    return { theme, info, scheme: info.scheme, preference, setPreference, preview: setPreviewing };
  }, [theme, preference, setPreference]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
  return context;
}
