/**
 * The ten themes, after Omarchy's. Colors live in src/styles/tokens.css (one block per theme); this list is
 * what the theme picker shows and what the hero's 3D scene switches on. index.html repeats
 * the ids and background colors so the right theme paints before React loads.
 */
export type ThemeId =
  | "matte-black"
  | "tokyo-night"
  | "hackerman"
  | "lumon"
  | "retro-82"
  | "ristretto"
  | "osaka-jade"
  | "lupine"
  | "rose-pine"
  | "flexoki";
export type Scheme = "light" | "dark";
export type SceneId =
  | "lattice"
  | "sheets"
  | "portal"
  | "sunset"
  | "assembly"
  | "bars"
  | "ribbon"
  | "crystal"
  | "cairn"
  | "gyroscope";

export interface ThemeInfo {
  id: ThemeId;
  name: string;
  scheme: Scheme;
  /** One line for the picker. */
  blurb: string;
  scene: SceneId;
  /** Name of the 3D scene, shown in the picker. */
  sceneName: string;
  /** Background, surface, accent and second accent, for the picker's swatch. */
  swatch: [string, string, string, string];
}

export const themes: ThemeInfo[] = [
  { id: "matte-black", name: "Matte Black", scheme: "dark", blurb: "Pure black, one amber spark", scene: "lattice", sceneName: "Data lattice", swatch: ["#121212", "#1a1a1a", "#e68e0d", "#ffc107"] },
  { id: "tokyo-night", name: "Tokyo Night", scheme: "dark", blurb: "Neon violet over a night city", scene: "portal", sceneName: "Neon portal", swatch: ["#1a1b26", "#222436", "#bb9af7", "#7dcfff"] },
  { id: "hackerman", name: "Hackerman", scheme: "dark", blurb: "Phosphor green on a dark terminal", scene: "bars", sceneName: "Bar-chart city", swatch: ["#0b0c16", "#121424", "#82fb9c", "#7cf8f7"] },
  { id: "lumon", name: "Lumon", scheme: "dark", blurb: "Ice blue on cold slate", scene: "crystal", sceneName: "Glass crystals", swatch: ["#16242d", "#1b2d3a", "#8bc9eb", "#d1eef8"] },
  { id: "retro-82", name: "Retro 82", scheme: "dark", blurb: "Synthwave sunset over a navy grid", scene: "sunset", sceneName: "Synthwave sunset", swatch: ["#05182e", "#0a2540", "#faa968", "#2fb5a8"] },
  { id: "ristretto", name: "Ristretto", scheme: "dark", blurb: "Hot pink and honey on espresso", scene: "ribbon", sceneName: "Knotted ribbon", swatch: ["#2c2525", "#352c2c", "#fd6883", "#f9cc6c"] },
  { id: "osaka-jade", name: "Osaka Jade", scheme: "dark", blurb: "Gold leaf on deep jade", scene: "cairn", sceneName: "Balanced stones", swatch: ["#111c18", "#172620", "#e5c736", "#63b07a"] },
  { id: "lupine", name: "Lupine", scheme: "light", blurb: "Electric blue and magenta on white", scene: "sheets", sceneName: "Stacked sheets", swatch: ["#fafafa", "#ffffff", "#3060e2", "#bd00b8"] },
  { id: "rose-pine", name: "Rosé Pine Dawn", scheme: "light", blurb: "Dawn rose and pine", scene: "gyroscope", sceneName: "Gyroscope", swatch: ["#faf4ed", "#fffaf3", "#286983", "#975366"] },
  { id: "flexoki", name: "Flexoki", scheme: "light", blurb: "Typewriter ink on warm paper", scene: "assembly", sceneName: "Exploded assembly", swatch: ["#fffcf0", "#ffffff", "#205ea6", "#b14d14"] },
];

export const defaultTheme: Record<Scheme, ThemeId> = { dark: "matte-black", light: "flexoki" };

export const themeById = (id: ThemeId) => themes.find((t) => t.id === id)!;
export const isThemeId = (value: unknown): value is ThemeId => themes.some((t) => t.id === value);
