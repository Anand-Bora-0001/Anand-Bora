import { readFileSync, writeFileSync } from "node:fs";
const source = readFileSync(
  new URL("../src/data/projects.ts", import.meta.url),
  "utf8",
);
const slugs = [...source.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(
  (match) => match[1],
);
const urls = [
  "/",
  "/about",
  "/projects",
  ...slugs.map((slug) => `/projects/${slug}`),
];
const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  [...new Set(urls)]
    .map(
      (path) => `  <url><loc>https://anand-bora.vercel.app${path}</loc></url>`,
    )
    .join("\n") +
  "\n</urlset>\n";
writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml);
