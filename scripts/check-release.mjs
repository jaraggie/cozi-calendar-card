import { readFile, access, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import assert from "node:assert/strict";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (name) => readFile(path.join(root, name), "utf8");
const pkg = JSON.parse(await read("package.json"));
const hacs = JSON.parse(await read("hacs.json"));
const source = await read("cozi-calendar-card.js");

assert.equal(pkg.name, "cozi-calendar-card");
assert.match(pkg.version, /^\d+\.\d+\.\d+(?:-[\da-z.-]+)?$/iu);
assert.equal(pkg.license, "MIT");
assert.equal(hacs.name, "Cozi Family Calendar Card");
assert.equal(hacs.filename, "cozi-calendar-card.js");
assert.equal(hacs.render_readme, true);
assert.equal(hacs.zip_release, undefined, "Dashboard cards install the JS, not a ZIP");
assert.equal(source.match(/export const VERSION = ["']([^"']+)["'];/u)?.[1], pkg.version, "Card version must match package.json");
if (process.env.RELEASE_TAG) assert.equal(process.env.RELEASE_TAG, `v${pkg.version}`);

const required = ["LICENSE", "README.md", "CHANGELOG.md", "CONTRIBUTING.md", "VALIDATION.md", "example.yaml", "dashboard.yaml", ".github/workflows/validate.yaml", ".github/workflows/release.yaml"];
await Promise.all(required.map((name) => access(path.join(root, name))));
assert.ok((await read("CHANGELOG.md")).includes(pkg.version), "Changelog must describe the candidate version");
assert.ok((await read("LICENSE")).startsWith("MIT License"));
const readme = await read("README.md");
const images = [...readme.matchAll(/!\[[^\]]*\]\(([^)]+)\)/gu)].map((m) => m[1]);
assert.ok(images.length > 0, "Public README needs screenshots");
for (const image of images) {
  assert.ok(!/^(?:https?:|data:)/iu.test(image), "Keep release screenshots in the repository");
  assert.ok(!image.includes(".."), "Screenshot path must stay within repository");
  await access(path.join(root, image));
}

// This is a bounded release hygiene check, not a replacement for a human privacy review.
const excluded = new Set([".git", "node_modules", "release", ".local"]);
const textExtensions = new Set([".js", ".mjs", ".md", ".json", ".yaml", ".yml", ".html", ".py"]);
const forbidden = [
  [/\b(?:\d{1,3}\.){3}\d{1,3}\b/gu, "IPv4 address other than the documented loopback preview", (m) => m === "127.0.0.1"],
  [/\/Users\/[\w.-]+\//gu, "personal filesystem path"],
  [/https?:\/\/[^\s"'<>]*[?&](?:token|access_token|api_key)=/giu, "credential-bearing URL"],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/gu, "private key"],
];
let scanned = 0;
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name) || entry.name.endsWith(".zip")) continue;
    const full = path.join(directory, entry.name);
    assert.ok(!entry.isSymbolicLink(), `Release tree must not contain symlinks: ${path.relative(root, full)}`);
    if (entry.isDirectory()) { await scan(full); continue; }
    if (!textExtensions.has(path.extname(entry.name))) continue;
    const text = await readFile(full, "utf8");
    for (const [pattern, label, allowed] of forbidden) {
      for (const match of text.matchAll(pattern)) assert.ok(allowed?.(match[0]), `${label} in ${path.relative(root, full)}`);
    }
    scanned += 1;
  }
}
await scan(root);
console.log(`Release structure, version ${pkg.version}, screenshots, and bounded privacy checks pass (${scanned} text files).`);
