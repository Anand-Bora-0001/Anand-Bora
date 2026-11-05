export interface Role {
  period: string;
  title: string;
  org: string;
  href?: string;
  current?: boolean;
  summary: string;
  points: string[];
  tags: string[];
}

export const roles: Role[] = [
  {
    period: "Aug 2026 — Now",
    title: "Full-Stack Developer",
    org: "Flid AI",
    href: "https://flid.ai/",
    current: true,
    summary: "Taking features from first idea to production in LeapView and Alloy Catalog: the interfaces, the services behind them, and the AI agents inside both.",
    points: [
      "LeapView: 135+ merged pull requests across agent-authored dashboards, governed access, tables and performance.",
      "Alloy Catalog: the Ask-the-catalog agent, Tantivy search, 3D part and assembly views, data quality and the home launchpad.",
      "Deployment: rolled out LeapView's hosted demo, hardened its staging and release checks, and added CI gates.",
      "Redesigned the flid.ai public site and made it fast.",
    ],
    tags: ["Go", "Rust", "DuckDB", "TypeScript", "MCP", "Agents"],
  },
  {
    period: "2024",
    title: "Python Developer Intern",
    org: "AI Adventures LLP",
    summary: "Practical automation for education and everyday operations.",
    points: [
      "Built attendance and absence-detection workflows with Python and Google Sheets.",
      "Bulk certificate generation and Moodle customization.",
      "API integrations and automated delivery with GitHub Actions.",
    ],
    tags: ["Python", "Flask", "Google Sheets API", "GitHub Actions"],
  },
  {
    period: "2022 — 2026",
    title: "B.E. Computer Engineering",
    org: "Savitribai Phule Pune University",
    summary: "Genba Sopanrao Moze College of Engineering, Pune. CGPA 8.55.",
    points: [],
    tags: ["Systems", "Databases", "Networks"],
  },
];
