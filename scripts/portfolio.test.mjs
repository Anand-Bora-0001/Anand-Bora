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
