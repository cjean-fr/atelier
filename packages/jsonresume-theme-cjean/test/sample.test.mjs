import { render } from "../dist/index.js";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import assert from "node:assert/strict";
import test from "node:test";

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
