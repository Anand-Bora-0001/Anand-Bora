/** Colors the 3D scenes need, read from the CSS tokens so styles stay the single source. */
export type Tone = "agents" | "systems" | "data" | "cloud";
export type ScenePalette = Record<Tone | "ink" | "accent2" | "surface", string>;

const variables: Record<keyof ScenePalette, string> = {
  agents: "--tone-agents",
  systems: "--tone-systems",
  data: "--tone-data",
  cloud: "--tone-cloud",
  accent2: "--color-accent-2",
  ink: "--color-text",
  surface: "--color-surface",
};

export function readPalette(): ScenePalette {
  const style = getComputedStyle(document.documentElement);
  return Object.fromEntries(
    Object.entries(variables).map(([key, name]) => [key, style.getPropertyValue(name).trim() || "#888888"]),
  ) as ScenePalette;
}
