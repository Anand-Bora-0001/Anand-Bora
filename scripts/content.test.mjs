import { existsSync, readFileSync } from "node:fs";
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
    for (const src of [p.image, ...(p.gallery ?? []).map((g) => g.src)].filter(Boolean))
      assert.ok(existsSync(resolve(root, "public", src.slice(1))), src);
    if (p.githubUrl) assert.match(p.githubUrl, /^https:\/\/github\.com\/Anand-Bora-0001\//);
  }
  // Images are real screenshots of the running app only; a project without one shows none.
  assert.ok(!existsSync(resolve(root, "public/projects/covers")), "no generated mockups");
  assert.ok(featuredProjects.length >= 6);
  // The home page features projects that have a screenshot, each a different one.
  const shown = featuredProjects.slice(0, 6).map((p) => p.image);
  assert.ok(shown.every(Boolean), "featured projects have screenshots");
  assert.equal(new Set(shown).size, shown.length);
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
  assert.equal(sections.map((s) => s.id).join(), "about,work,experience,projects,skills,contact");
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

test("every theme meets WCAG AA for every text and background pair", () => {
  const css = readFileSync(resolve(root, "src/styles/tokens.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const declarations = (text) =>
    Object.fromEntries([...text.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  const themes = Object.fromEntries(
    [...css.matchAll(/\[data-theme="([\w-]+)"\]\s*\{([^}]*)\}/g)].map((m) => [m[1], declarations(m[2])]),
  );
  // The theme picker (src/lib/themes.ts) and the no-flash script (index.html) list the same themes.
  const listed = [...readFileSync(resolve(root, "src/lib/themes.ts"), "utf8").matchAll(/\{ id: "([\w-]+)"/g)].map((m) => m[1]);
  assert.ok(listed.length >= 8, `${listed.length} themes listed`);
  assert.deepEqual(Object.keys(themes).sort(), [...listed].sort());
  const head = readFileSync(resolve(root, "index.html"), "utf8");
  for (const id of listed) assert.match(head, new RegExp(`"?${id}"?: "#[0-9a-f]{6}"`), `index.html knows ${id}`);
  const hex = (vars, name) => {
    const value = vars[name];
    assert.match(value ?? "", /^#[0-9a-f]{6}$/i, `${name} is a hex color`);
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
