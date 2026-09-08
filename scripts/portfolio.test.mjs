import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import assert from "node:assert/strict";
import ts from "typescript";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cache = new Map();
function load(relative) {
  const filename = resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename);
  const source = readFileSync(filename, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const exports = {};
  const require = (specifier) => {
    if (specifier.startsWith("@/assets/")) {
      assert.ok(existsSync(resolve(root, "src", specifier.slice(2))));
      return specifier;
    }
    if (specifier.startsWith("@/"))
      return load("src/" + specifier.slice(2) + ".ts");
    throw new Error("Unexpected import: " + specifier);
  };
  vm.runInNewContext(outputText, { exports, require }, { filename });
  cache.set(filename, exports);
  return exports;
}
const { projects, getProjectBySlug, getFeaturedProjects } = load(
  "src/data/projects.ts",
);
test("every project has a unique usable route and resolves to its own detail record", () => {
  const slugs = projects.map((project) => project.slug);
  assert.equal(new Set(slugs).size, projects.length);
  for (const project of projects) {
    assert.match(project.slug, /^[a-z0-9-]+$/);
    assert.equal(getProjectBySlug(project.slug), project);
    assert.ok(project.title && project.description && project.techStack.length);
  }
  assert.equal(getProjectBySlug("unknown-project"), undefined);
});
test("featured cards have valid source links and available local preview assets", () => {
  for (const project of getFeaturedProjects()) {
    assert.match(project.githubUrl, /^https:\/\/github.com\/Anand-Bora-0001\//);
    if (project.image?.startsWith("/"))
      assert.ok(existsSync(resolve(root, "public", project.image.slice(1))));
  }
  assert.ok(
    getFeaturedProjects().some((project) => project.slug === "amex-pulse"),
  );
  assert.ok(
    getFeaturedProjects().some((project) => project.slug === "resumeiq-ai"),
  );
});
test("email drafts preserve Unicode, newlines, and URL-sensitive message characters", () => {
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
test("sitemap covers every project and points only to the real portfolio domain", () => {
  const xml = readFileSync(resolve(root, "public/sitemap.xml"), "utf8");
  for (const project of projects)
    assert.ok(
      xml.includes(
        "https://anand-bora.vercel.app/projects/" + project.slug + "</loc>",
      ),
    );
  assert.equal((xml.match(/<loc>/g) || []).length, projects.length + 3);
});

test("atlas domains link to real project records and keep fallback content meaningful", () => {
  const { atlasDomains, getAtlasDomain } = load("src/data/atlas.ts");
  assert.equal(
    new Set(atlasDomains.map((domain) => domain.id)).size,
    atlasDomains.length,
  );
  for (const domain of atlasDomains) {
    assert.ok(getProjectBySlug(domain.project));
    assert.ok(domain.title && domain.description && domain.tools.length);
    assert.equal(domain.position.length, 3);
    assert.equal(getAtlasDomain(domain.id), domain);
  }
});
test("3D motion stops when paused, hidden, offscreen, reduced, or unavailable", () => {
  const { getAtlasRenderPolicy } = load("src/data/atlas.ts");
  const active = {
    want3D: true,
    ready: true,
    failed: false,
    paused: false,
    reducedMotion: false,
    inView: true,
    pageVisible: true,
  };
  assert.equal(getAtlasRenderPolicy(active).animate, true);
  for (const patch of [
    { paused: true },
    { reducedMotion: true },
    { inView: false },
    { pageVisible: false },
    { failed: true },
    { ready: false },
    { want3D: false },
  ])
    assert.equal(getAtlasRenderPolicy({ ...active, ...patch }).animate, false);
  assert.equal(getAtlasRenderPolicy({ ...active, failed: true }).show3D, false);
  assert.equal(
    getAtlasRenderPolicy({ ...active, reducedMotion: true }).show3D,
    true,
  );
});
test("pointer lighting and tilt remain bounded outside the card and on zero-size elements", () => {
  const { getTilt } = load("src/data/atlas.ts");
  const center = getTilt(50, 50, 100, 100);
  assert.equal(center.rotateY, 0);
  assert.equal(center.lightX, 50);
  for (const args of [
    [0, 0, 100, 100],
    [200, -20, 100, 100],
    [10, 10, 0, 0],
  ]) {
    const tilt = getTilt(...args);
    assert.ok(Number.isFinite(tilt.rotateX));
    assert.ok(Math.abs(tilt.rotateX) <= 3);
    assert.ok(Math.abs(tilt.rotateY) <= 4);
    assert.ok(tilt.lightX >= 0 && tilt.lightX <= 100);
    assert.ok(tilt.lightY >= 0 && tilt.lightY <= 100);
  }
});
