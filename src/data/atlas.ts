export type AtlasFocus = "agents" | "systems" | "data";
export interface AtlasDomain {
  id: AtlasFocus;
  label: string;
  number: string;
  title: string;
  description: string;
  tools: string[];
  color: string;
  position: [number, number, number];
  project: string;
  projectLabel: string;
}
export const atlasDomains: AtlasDomain[] = [
  {
    id: "agents",
    label: "Agents",
    number: "01",
    title: "Intelligence with somewhere to go.",
    description:
      "Models become useful when they can work with context, call tools, and fit into a real product.",
    tools: ["Agent architectures", "Python", "Applied AI"],
    color: "#c6a0ff",
    position: [-2.1, 0.7, 0.4],
    project: "amex-pulse",
    projectLabel: "AmEx Pulse AI",
  },
  {
    id: "systems",
    label: "Systems",
    number: "02",
    title: "The engineering around the intelligence.",
    description:
      "Clear APIs, explicit boundaries, and visibility into what happened. The foundations behind dependable software.",
    tools: ["Go", "FastAPI", "Observability"],
    color: "#7ce8ef",
    position: [1.95, 0.45, 0.65],
    project: "observability-platform",
    projectLabel: "Identity & Cloud Observability",
  },
  {
    id: "data",
    label: "Data",
    number: "03",
    title: "From a stream of events to an answer.",
    description:
      "Connecting data workflows, storage, and analytics so the right information reaches the right part of the system.",
    tools: ["DuckDB", "SQL", "Data pipelines"],
    color: "#f2ba77",
    position: [0, -0.55, 2.05],
    project: "real-time-data-engineering",
    projectLabel: "Real-Time Data Engineering",
  },
];
export function getAtlasDomain(id: AtlasFocus): AtlasDomain {
  return atlasDomains.find((domain) => domain.id === id) ?? atlasDomains[0];
}
export function getTilt(x: number, y: number, width: number, height: number) {
  const horizontal = Math.max(
    -1,
    Math.min(1, (x / Math.max(width, 1) - 0.5) * 2),
  );
  const vertical = Math.max(
    -1,
    Math.min(1, (y / Math.max(height, 1) - 0.5) * 2),
  );
  return {
    rotateX: -vertical * 3,
    rotateY: horizontal * 4,
    lightX: (horizontal + 1) * 50,
    lightY: (vertical + 1) * 50,
  };
}

export function getAtlasRenderPolicy(state: {
  want3D: boolean;
  ready: boolean;
  failed: boolean;
  paused: boolean;
  reducedMotion: boolean;
  inView: boolean;
  pageVisible: boolean;
}) {
  const show3D = state.want3D && state.ready && !state.failed;
  return {
    show3D,
    animate:
      show3D &&
      !state.paused &&
      !state.reducedMotion &&
      state.inView &&
      state.pageVisible,
  };
}
