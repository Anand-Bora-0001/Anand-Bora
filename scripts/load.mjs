// Loads a src/ TypeScript module in Node (no bundler) so tests and scripts can read content.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cache = new Map();

export function load(relative) {
  const filename = resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename);
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  const require = (specifier) => {
    if (specifier.startsWith("@/")) return load(`src/${specifier.slice(2)}.ts`);
    throw new Error(`Unexpected import: ${specifier}`);
  };
  vm.runInNewContext(outputText, { exports, require }, { filename });
  cache.set(filename, exports);
  return exports;
}
