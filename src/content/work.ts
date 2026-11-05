export type Tone = "agents" | "systems" | "data" | "cloud";

export interface CaseStudy {
  slug: string;
  name: string;
  kicker: string;
  tagline: string;
  summary: string;
  role: string;
  period: string;
  status: string;
  tone: Tone;
  visual: "leapview" | "catalog";
  stack: string[];
  metrics: { value: string; label: string }[];
  links: { label: string; href: string }[];
  /** Short list for the home page card. */
  highlights: string[];
  /** What the product is, for the case-study page. */
  context: string[];
  /** How data flows through it: rendered as a pipeline diagram. */
  pipeline: { step: string; detail: string }[];
  /** What I built, grouped by area. */
  contributions: { title: string; text: string; tags: string[] }[];
  shipped: string[];
  note?: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "leapview",
    name: "LeapView",
    kicker: "Flid AI · Open source",
    tagline: "Define metrics in code. Explore them everywhere.",
    summary:
      "Open-source business intelligence for teams who want analytics in Git and data on their own infrastructure. One governed metric, reused across dashboards, APIs and AI agents.",
    role: "Full-Stack Developer · core contributor",
    period: "Aug 2026 — Now",
    status: "Alpha · v0.4",
    tone: "agents",
    visual: "leapview",
    stack: ["Go", "DuckDB", "DuckLake", "PostgreSQL", "TypeScript", "MCP", "OIDC"],
    metrics: [
      { value: "135+", label: "merged pull requests" },
      { value: "Apache-2.0", label: "open-source license" },
      { value: "MCP", label: "endpoint for agents" },
    ],
    links: [
      { label: "leapview.dev", href: "https://leapview.dev/" },
      { label: "Source on GitHub", href: "https://github.com/flidai/leapview" },
    ],
    highlights: [
      "AI chat agents that explore governed metrics and draft dashboards",
      "Roles, row filters, column masks, OIDC sign-in and SCIM",
      "Hierarchical tables, pivots and a standalone chart playground",
    ],
    context: [
      "Most BI tools keep metric definitions inside the tool, so every dashboard re-implements revenue a little differently. LeapView keeps connections, semantic models, refresh pipelines and dashboards as reviewable files in Git, and serves them from your own infrastructure.",
      "Go serves the application, DuckDB executes queries, DuckLake manages analytical snapshots, and PostgreSQL stores control state. A governed query layer applies roles, grants, row filters and column masks to every surface — including the AI tools.",
    ],
    pipeline: [
      { step: "Git", detail: "Connections, models and dashboards as YAML" },
      { step: "Semantic layer", detail: "Metrics, dimensions and relationships" },
      { step: "DuckDB · DuckLake", detail: "Queries and analytical snapshots" },
      { step: "Governed queries", detail: "Roles, row filters, column masks" },
      { step: "Dashboards · API · Agents", detail: "One metric, every surface" },
    ],
    contributions: [
      {
        title: "Agents that build dashboards",
        text: "Chat agents in Explorer and Builder that query governed metrics, preview visuals, and author dashboard drafts as YAML — with saved visuals, attachments, chat recovery and an animated build of each tile.",
        tags: ["Agents", "MCP", "YAML"],
      },
      {
        title: "Governed access and administration",
        text: "Admin-approved roles that activate immediately, permission pages, optional SSO flows, admin-only session management, a simpler audit log, and encrypted credential drafts with isolated validation.",
        tags: ["OIDC", "SCIM", "Security"],
      },
      {
        title: "Tables, charts and layout",
        text: "Hierarchical tables with image cells and content-fit sizing, accessible windowed column resizing, chart and map layout fixes, and a standalone LeapView component with a chart playground.",
        tags: ["TypeScript", "Data viz", "a11y"],
      },
      {
        title: "Speed and polish",
        text: "Less navigation and dashboard-interaction overhead, a faster playground and public site, theme stability, and nightly CI kept free of vulnerabilities.",
        tags: ["Performance", "CI"],
      },
    ],
    shipped: [
      "Agent-controlled dashboard previews and saved visuals",
      "Hierarchical tables, image cells and content-fit sizing",
      "Standalone LeapView component and chart playground",
      "Encrypted credential drafts with isolated validation",
      "Animated dashboard building from chat",
      "Reduced navigation and dashboard interaction overhead",
      "Admin-approved roles that activate immediately",
      "Accessible windowed table resizing",
    ],
  },
  {
    slug: "alloy-catalog",
    name: "Alloy Catalog",
    kicker: "Flid AI · Product",
    tagline: "Every part, assembly and project — searchable, askable, in 3D.",
    summary:
      "Turns saved Autodesk Inventor files into a searchable catalog of parts, assemblies and projects, served through a web app, a JSON API and MCP — with an agent you can ask and 3D views of what you find.",
    role: "Full-Stack Developer · catalog app and agent",
    period: "Oct 2026 — Now",
    status: "In use at Flid AI",
    tone: "systems",
    visual: "catalog",
    stack: ["Rust", "TypeScript", "DuckDB", "Parquet", "Tantivy", "Three.js", "MCP"],
    metrics: [
      { value: "Read-only", label: "CAD extraction, no Inventor needed" },
      { value: "Tantivy", label: "full-text search engine" },
      { value: "3D", label: "parts and assemblies" },
    ],
    links: [],
    highlights: [
      "“Ask the catalog” agent with answer cards and a full-page mode",
      "Search served from Tantivy, with a configurable results table",
      "Full-screen 3D viewer and assembly scenes built from part models",
    ],
    context: [
      "Engineering teams accumulate thousands of Inventor files across shares and vaults. Finding a part, the assemblies it is used in, or who last worked on it usually means opening CAD software. Alloy Catalog reads the saved files on Linux — without Inventor and without modifying them — and builds a catalog anyone can search.",
      "A Rust pipeline extracts metadata, assembly links and embedded previews into a raw catalog and Parquet, normalizes it, and publishes a serving generation that powers search, the web app, the JSON API and an MCP server for agents.",
    ],
    pipeline: [
      { step: "Inventor files", detail: "Parts, assemblies and drawings" },
      { step: "Rust extraction", detail: "Read-only metadata, links, previews" },
      { step: "Raw → normalized", detail: "Parquet and DuckDB catalog" },
      { step: "Serving + search", detail: "Tantivy text search, similarity" },
      { step: "Web · API · MCP", detail: "Browse, search, ask, view in 3D" },
    ],
    contributions: [
      {
        title: "Ask the catalog",
        text: "An agent panel and full page for asking questions about parts and projects, with answer cards, smoother switching between conversations, and Ask-from-any-page.",
        tags: ["Agents", "MCP"],
      },
      {
        title: "Search that keeps up",
        text: "Moved text search fully onto Tantivy, retiring SQLite FTS5. Built the results table: one place to choose columns, steadier drag and drop, fixed left columns and list previews.",
        tags: ["Rust", "Tantivy"],
      },
      {
        title: "Parts and assemblies in 3D",
        text: "A full-screen 3D viewer and image zoom on the item page, and assembly scenes composed from part models — drawing one part when references match identical copies.",
        tags: ["Three.js", "3D"],
      },
      {
        title: "The everyday app",
        text: "A home launchpad with pinned items and what changed since your last visit, a data-quality overview, a people page with Microsoft profile photos, settings and administration, and page transitions that carry what you clicked.",
        tags: ["TypeScript", "UX", "a11y"],
      },
    ],
    shipped: [
      "Assembly scene for 3D views",
      "Item page: customizable overview, full-screen 3D viewer and image zoom",
      "Search: text served from Tantivy only",
      "Page transitions that carry the clicked name",
      "Home: pinned items and what changed since your last visit",
      "Ask the catalog: chat panel, full page and answer cards",
      "People's Microsoft profile photos in avatars",
      "Refreshed sign-in design and branding",
    ],
    note: "Alloy Catalog is a private product, so this page describes it at a high level.",
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
