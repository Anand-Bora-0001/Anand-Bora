import { useEffect, useState } from "react";

/** Colors the 3D scenes need, read from the CSS tokens so styles stay the single source. */
export type Tone = "agents" | "systems" | "data" | "cloud";
export type ScenePalette = Record<Tone | "ink" | "accent" | "accent2" | "surface" | "bg" | "border", string>;

const variables: Record<keyof ScenePalette, string> = {
  agents: "--tone-agents",
  systems: "--tone-systems",
  data: "--tone-data",
  cloud: "--tone-cloud",
  accent: "--color-accent",
  accent2: "--color-accent-2",
  ink: "--color-text",
  surface: "--color-surface",
  bg: "--color-bg",
  border: "--color-border-strong",
};

/** Fired once a theme's colors are on the page (src/lib/theme.tsx). */
export const THEME_PAINTED = "themepainted";

export function readPalette(element: Element = document.documentElement): ScenePalette {
  const style = getComputedStyle(element);
  return Object.fromEntries(
    Object.entries(variables).map(([key, name]) => [key, style.getPropertyValue(name).trim() || "#888888"]),
  ) as ScenePalette;
}

const palettes = new Map<string, ScenePalette>();

/** Any theme's palette, whichever is on screen: read from a hidden element carrying that theme. */
export function paletteFor(theme: string): ScenePalette {
  let palette = palettes.get(theme);
  if (!palette) {
    const probe = document.createElement("div");
    probe.dataset.theme = theme;
    probe.hidden = true;
    document.body.append(probe);
    palette = readPalette(probe);
    probe.remove();
    palettes.set(theme, palette);
  }
  return palette;
}

/** The current palette, re-read whenever a theme finishes painting. */
export function usePalette() {
  const [palette, setPalette] = useState(readPalette);
  useEffect(() => {
    const update = () => setPalette(readPalette());
    window.addEventListener(THEME_PAINTED, update);
    return () => window.removeEventListener(THEME_PAINTED, update);
  }, []);
  return palette;
}
