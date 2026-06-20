import { initBuild, rebuildAll } from "../docs-src/lib/build-engine.js";
import { renderDocument } from "../docs-src/lib/render-document.js";
import { describe, it, expect, beforeAll } from "bun:test";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

beforeAll(async () => {
  await initBuild();
  await rebuildAll();
});

describe("SSG build", () => {
  it("produces index.html", async () => {
    const html = await readFile("dist/index.html", "utf-8");
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("</html>");
  });

  it("produces robots.txt", async () => {
    const robots = await readFile("dist/robots.txt", "utf-8");
    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
  });

  it("produces 404.html", async () => {
    const html = await readFile("dist/404.html", "utf-8");
    expect(html).toContain("Page Not Found");
    expect(html).toContain("404");
  });

  it("produces search-index.json (array of entries)", async () => {
    const index = await readFile("dist/search-index.json", "utf-8");
    const data = JSON.parse(index);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("url");
    expect(data[0]).toHaveProperty("title");
  });

  it("builds all page files", async () => {
    const pages = [
      "index.html",
      "guide/installation.html",
      "guide/quick-start.html",
      "api/context.html",
      "jsx-flow/overview.html",
    ];
    for (const page of pages) {
      expect(existsSync(`dist/${page}`)).toBe(true);
    }
  });

  it("injects Vite assets in pages", async () => {
    const html = await readFile("dist/index.html", "utf-8");
    expect(html).toMatch(
      /<script.*?type="module".*?src="\/assets\/client-.*?\.js".*?>/,
    );
    expect(html).toMatch(
      /<link.*?rel="stylesheet".*?href="\/assets\/client-.*?\.css".*?>/,
    );
  });

  it("no canonical link when config.site is unset", async () => {
    const html = await readFile("dist/index.html", "utf-8");
    expect(html).not.toContain('rel="canonical"');
  });
});

describe("renderDocument", () => {
  it("renders simple JSX to HTML string", async () => {
    const html = await renderDocument(() => <h1>Hello Test</h1>);
    expect(html).toContain("<h1>");
    expect(html).toContain("Hello Test");
    expect(html).toContain("</h1>");
  });

  it("renders nested elements", async () => {
    const html = await renderDocument(() => (
      <div class="test">
        <span>nested</span>
      </div>
    ));
    expect(html).toContain('<div class="test">');
    expect(html).toContain("<span>nested</span>");
  });

  it("escapes text content", async () => {
    const html = await renderDocument(() => (
      <div>{"<script>alert(1)</script>"}</div>
    ));
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });
});
