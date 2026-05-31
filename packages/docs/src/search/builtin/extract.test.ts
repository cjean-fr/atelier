import { describe, it, expect } from "bun:test";
import { indexEntry } from "./extract.js";

describe("indexEntry — text extraction", () => {
  it("indexes <main> content only when present", () => {
    const html = `
      <html><body>
        <nav>Home Guide API</nav>
        <aside>On this page</aside>
        <main><h1>Title</h1><p>Body content here.</p></main>
        <footer>edit on github</footer>
      </body></html>
    `;
    const entry = indexEntry("/page", html);
    expect(entry.text).toContain("Body content here");
    expect(entry.text).not.toContain("Home Guide API");
    expect(entry.text).not.toContain("On this page");
    expect(entry.text).not.toContain("edit on github");
  });

  it("falls back to full document when <main> is absent", () => {
    const html = `<html><body><h1>Hello</h1><p>Plain body.</p></body></html>`;
    const entry = indexEntry("/page", html);
    expect(entry.text).toContain("Hello");
    expect(entry.text).toContain("Plain body");
  });

  it("strips <nav> and <aside> even inside <main>", () => {
    const html = `
      <main>
        <nav>chrome</nav>
        <aside>toc</aside>
        <p>real content</p>
      </main>
    `;
    const entry = indexEntry("/page", html);
    expect(entry.text).toContain("real content");
    expect(entry.text).not.toContain("chrome");
    expect(entry.text).not.toContain("toc");
  });
});
