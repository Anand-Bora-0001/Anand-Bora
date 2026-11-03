import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { load, root } from "./load.mjs";

const { projects } = load("src/content/projects.ts");
const { caseStudies } = load("src/content/work.ts");
const { site } = load("src/content/site.ts");
const paths = [
  "/",
  ...caseStudies.map((c) => `/work/${c.slug}`),
  "/projects",
  ...projects.map((p) => `/projects/${p.slug}`),
];
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  paths.map((path) => `  <url><loc>${site.url}${path}</loc></url>`).join("\n") +
  "\n</urlset>\n";
writeFileSync(resolve(root, "public/sitemap.xml"), xml);
console.log(`sitemap: ${paths.length} urls`);
