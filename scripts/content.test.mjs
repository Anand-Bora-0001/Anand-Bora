import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { load, root } from "./load.mjs";

const { projects, projectGroups, featuredProjects, getProject } = load("src/content/projects.ts");

test("every project has a unique slug, a valid group, and the fields its page needs", () => {
  assert.equal(new Set(projects.map((p) => p.slug)).size, projects.length);
  for (const p of projects) {
    assert.match(p.slug, /^[a-z0-9-]+$/);
    assert.ok(projectGroups.includes(p.group), `${p.slug} group`);
    for (const field of ["title", "description", "longDescription", "problem", "approach", "challenges", "outcome"])
      assert.ok(p[field], `${p.slug} ${field}`);
    assert.ok(p.techStack.length, `${p.slug} techStack`);
    assert.equal(getProject(p.slug), p);
  }
  assert.equal(getProject("missing"), undefined);
});

test("project images and links point at real files and the right accounts", () => {
  for (const p of projects) {
    if (p.image) assert.ok(existsSync(resolve(root, "public", p.image.slice(1))), p.image);
    if (p.githubUrl) assert.match(p.githubUrl, /^https:\/\/github\.com\/Anand-Bora-0001\//);
  }
  // Every project shows an image: a real screenshot or a generated cover (npm run covers).
  assert.ok(projects.every((p) => p.image), "every project has an image");
  assert.ok(featuredProjects.length >= 6);
  assert.ok(featuredProjects.every((p) => p.githubUrl));
});

test("profile assets exist", () => {
  for (const file of ["Anand_Bora.pdf", "profile.jpg", "favicon.svg"])
    assert.ok(existsSync(resolve(root, "public", file)), file);
});

test("skills cover four distinct areas with no duplicate skills", () => {
  const { skillCategories } = load("src/content/skills.ts");
  assert.equal(skillCategories.map((c) => c.id).join(), "agents,systems,data,cloud");
  const all = skillCategories.flatMap((c) => c.skills);
  assert.equal(new Set(all).size, all.length);
});

test("case studies are complete, and private work has no links", () => {
  const { caseStudies, getCaseStudy } = load("src/content/work.ts");
  assert.equal(caseStudies.map((c) => c.slug).join(), "leapview,alloy-catalog");
  for (const c of caseStudies) {
    for (const field of ["name", "tagline", "summary", "role", "period", "status"]) assert.ok(c[field], `${c.slug} ${field}`);
    assert.ok(c.pipeline.length >= 3 && c.contributions.length >= 3 && c.shipped.length >= 3, c.slug);
    assert.equal(getCaseStudy(c.slug), c);
  }
  const catalog = getCaseStudy("alloy-catalog");
  assert.equal(catalog.links.length, 0);
  assert.ok(catalog.note);
  for (const file of ["work/leapview-dark.png", "work/leapview-light.png"])
    assert.ok(existsSync(resolve(root, "public", file)), file);
});

test("home sections, roles and about links are wired up", () => {
  const { sections, about } = load("src/content/site.ts");
  assert.equal(sections.map((s) => s.id).join(), "work,about,experience,projects,skills,contact");
  const { stats } = load("src/content/site.ts");
  assert.equal(stats.find((s) => s.label.includes("projects")).value, String(load("src/content/projects.ts").projects.length));
  const internal = about.flat().filter((p) => typeof p === "object" && p.href.startsWith("/"));
  for (const link of internal) assert.match(link.href, /^\/work\/(leapview|alloy-catalog)$/);
  const { roles } = load("src/content/experience.ts");
  assert.equal(roles.filter((r) => r.current).length, 1);
});

test("email drafts keep Unicode, newlines, and URL-sensitive characters", () => {
  const { createContactDraft } = load("src/lib/contact.ts");
  const draft = {
    name: "A & B",
    email: "hello+test@example.com",
    subject: "AI & data? #1",
    message: "Hello Anand!\nGo + DuckDB → tools & agents",
  };
  const url = new URL(createContactDraft(draft));
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "anandbora241@gmail.com");
  assert.equal(url.searchParams.get("subject"), "Portfolio: " + draft.subject);
  assert.ok(url.searchParams.get("body").includes(draft.message));
  assert.ok(url.searchParams.get("body").includes(draft.email));
});

test("the site points at anand-bora.vercel.app everywhere, with Vercel config", () => {
  const { site } = load("src/content/site.ts");
  assert.equal(site.url, "https://anand-bora.vercel.app");
  for (const file of ["index.html", "public/robots.txt"]) {
    const text = readFileSync(resolve(root, file), "utf8");
    assert.ok(!text.includes("anandbora.dev"), `${file} still mentions anandbora.dev`);
    assert.ok(text.includes("https://anand-bora.vercel.app"), `${file} uses anand-bora.vercel.app`);
  }
  assert.ok(!existsSync(resolve(root, "wrangler.toml")));
  const vercel = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8"));
  assert.equal(vercel.outputDirectory, "dist");
  // Client-side routes (/work/leapview, /projects/...) must fall back to index.html.
  assert.deepEqual(vercel.rewrites, [{ source: "/(.*)", destination: "/index.html" }]);
});

test("sitemap lists every page on the real domain", () => {
  const xml = readFileSync(resolve(root, "public/sitemap.xml"), "utf8");
  for (const p of projects)
    assert.ok(xml.includes(`https://anand-bora.vercel.app/projects/${p.slug}</loc>`));
  assert.ok(xml.includes("https://anand-bora.vercel.app/work/leapview</loc>"));
  assert.ok(xml.includes("https://anand-bora.vercel.app/work/alloy-catalog</loc>"));
  assert.equal((xml.match(/<loc>/g) || []).length, projects.length + 4);
});

test("theme tokens meet WCAG AA for every text and background pair, in both themes", () => {
  const css = readFileSync(resolve(root, "src/styles/tokens.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const block = (selector) => {
    const start = css.indexOf(selector);
    assert.ok(start >= 0, `missing ${selector}`);
    const open = css.indexOf("{", start);
    return css.slice(open + 1, css.indexOf("}", open));
  };
  const declarations = (text) =>
    Object.fromEntries([...text.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  const primitives = declarations(block(":root {"));
  const hex = (vars, name) => {
    let value = vars[name] ?? primitives[name];
    while (value?.startsWith("var(")) {
      const ref = value.slice(4, -1);
      value = vars[ref] ?? primitives[ref];
    }
    assert.match(value ?? "", /^#[0-9a-f]{6}$/i, `${name} resolves to a hex color`);
    return value;
  };
  const luminance = (color) =>
    [1, 3, 5]
      .map((i) => parseInt(color.slice(i, i + 2), 16) / 255)
      .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
      .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
  const contrast = (a, b) => {
    const [dark, light] = [luminance(a), luminance(b)].sort((x, y) => x - y);
    return (light + 0.05) / (dark + 0.05);
  };
  const themes = {
    dark: declarations(block(':root[data-theme="dark"]')),
    light: declarations(block(':root[data-theme="light"]')),
  };
  const texts = [
    "--color-text",
    "--color-text-muted",
    "--color-text-faint",
    "--color-accent",
    "--color-accent-2",
    "--tone-agents",
    "--tone-systems",
    "--tone-data",
    "--tone-cloud",
  ];
  const backgrounds = ["--color-bg", "--color-bg-raised", "--color-surface", "--color-surface-2"];
  // Headings and body copy must clear AAA on the page background.
  for (const [name, vars] of Object.entries(themes))
    for (const text of ["--color-heading", "--color-text"]) {
      const ratio = contrast(hex(vars, text), hex(vars, "--color-bg"));
      assert.ok(ratio >= 7, `${name}: ${text} on --color-bg is ${ratio.toFixed(2)}:1`);
    }
  for (const [name, vars] of Object.entries(themes)) {
    for (const text of texts)
      for (const bg of backgrounds) {
        const ratio = contrast(hex(vars, text), hex(vars, bg));
        assert.ok(ratio >= 4.5, `${name}: ${text} on ${bg} is ${ratio.toFixed(2)}:1`);
      }
    const onAccent = contrast(hex(vars, "--color-on-accent"), hex(vars, "--color-accent"));
    assert.ok(onAccent >= 4.5, `${name}: button text on accent is ${onAccent.toFixed(2)}:1`);
  }
});

test("cover specs are well-formed and safe to publish", () => {
  const dir = resolve(root, "scripts/cover-specs");
  const covered = new Set(projects.filter((p) => p.image?.startsWith("/projects/covers/")).map((p) => p.slug));
  for (const file of readdirSync(dir)) {
    const raw = readFileSync(resolve(dir, file), "utf8");
    const spec = JSON.parse(raw);
    assert.equal(file, `${spec.slug}.json`);
    assert.ok(covered.has(spec.slug), `${spec.slug} is a project with a generated cover`);
    assert.match(spec.repo, /^Anand-Bora-0001\//);
    if (spec.kind === "terminal") {
      assert.ok(spec.terminal.title && spec.terminal.lines.length >= 6 && spec.terminal.lines.length <= 22, spec.slug);
    } else {
      assert.equal(spec.kind, "dashboard", spec.slug);
      assert.equal(spec.nav.length, 5, `${spec.slug} nav`);
      assert.equal(spec.kpis.length, 4, `${spec.slug} kpis`);
      assert.ok(["area", "bars", "lines"].includes(spec.chart.type), `${spec.slug} chart`);
      assert.ok(spec.table.columns.length >= 3 && spec.table.columns.length <= 4, `${spec.slug} columns`);
      assert.equal(spec.table.rows.length, 5, `${spec.slug} rows`);
    }
    // These images are public: no contact details or credentials, even from private repos.
    assert.doesNotMatch(raw, /[\w.+-]+@[\w-]+\.[\w.]+/, `${spec.slug} contains an email address`);
    assert.doesNotMatch(raw, /\+?\d[\d -]{9,}\d/, `${spec.slug} contains a phone-like number`);
    assert.doesNotMatch(raw, /(sk-|ghp_|AKIA|api[_-]?key\s*[:=]\s*[^\s",]|password\s*[:=]\s*[^\s",])/i, `${spec.slug} contains a credential`);
  }
});
