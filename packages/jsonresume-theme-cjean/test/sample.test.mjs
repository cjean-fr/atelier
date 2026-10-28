import { render } from "../dist/index.js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import assert from "node:assert/strict";
import test from "node:test";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/** The shipped sample resume must always parse and render. */
test("sample.json renders", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async () => new Response('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
  );
  const sample = JSON.parse(
    await readFile(join(import.meta.dirname, "../sample.json"), "utf8"),
  );
  const html = await render(sample);
  assert.ok(html.startsWith("<!doctype html>"));
  assert.ok(html.includes(sample.basics.name));
});

test("the sample.json export is shipped in the published tarball", async () => {
  // 1.4.2 declared the export but omitted the file from the tarball.
  const pkg = JSON.parse(
    await readFile(join(import.meta.dirname, "../package.json"), "utf8"),
  );
  assert.ok(pkg.exports?.["./sample.json"], "exports must map ./sample.json");
  const { stdout } = await execFileAsync(
    "npm",
    ["pack", "--dry-run", "--json"],
    { cwd: join(import.meta.dirname, "..") },
  );
  const [{ files }] = JSON.parse(stdout.slice(stdout.indexOf("[")));
  const names = files.map((f) => f.path);
  assert.ok(names.includes("sample.json"), `tarball must ship sample.json, got: ${names}`);
});

test("the portrait displays on the right of the summary", async (t) => {
  t.mock.method(
    globalThis,
    "fetch",
    async () => new Response('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
  );
  const sample = JSON.parse(
    await readFile(join(import.meta.dirname, "../sample.json"), "utf8"),
  );
  // flex-row-reverse keeps the DOM order (accessibility) and flips the
  // visual order only, so assert the class, not element positions.
  const html = await render(sample);
  assert.match(html, /resume-about[^"]*sm:flex-row-reverse/);
});

