import { processMarkdown } from "./markdown.js";
import { describe, it, expect } from "bun:test";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

async function withTempMd(
  content: string,
  fn: (file: string) => Promise<void>,
) {
  const dir = await mkdtemp(path.join(tmpdir(), "md-test-"));
  const file = path.join(dir, "page.md");
  await writeFile(file, content, "utf-8");
  try {
    await fn(file);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe("processMarkdown", () => {
  it("extracts YAML frontmatter into meta", async () => {
    await withTempMd(
      `---
title: Hello
draft: true
---

Body content.`,
      async (file) => {
        const { meta } = await processMarkdown(file);
        expect(meta["title"]).toBe("Hello");
        expect(meta["draft"]).toBe(true);
      },
    );
  });

  it("renders body to HTML", async () => {
    await withTempMd(
      `---
title: x
---

# Heading

A **bold** word.`,
      async (file) => {
        const { html } = await processMarkdown(file);
        expect(html).toContain("<h1>Heading</h1>");
        expect(html).toContain("<strong>bold</strong>");
      },
    );
  });

  it("accepts custom remark plugins via [plugin, opts] tuple", async () => {
    const remarkSetTitle =
      () =>
      (tree: { type: string; children: { type: string; value: string }[] }) => {
        tree.children.unshift({ type: "text", value: "PREFIX:" });
      };
    await withTempMd(
      `---
title: x
---

body`,
      async (file) => {
        const { html } = await processMarkdown(file, {
          remarkPlugins: [remarkSetTitle as never],
        });
        expect(html).toContain("PREFIX:");
      },
    );
  });

  it("allows raw HTML inline (allowDangerousHtml)", async () => {
    await withTempMd(
      `---
title: x
---

<div class="custom">raw</div>`,
      async (file) => {
        const { html } = await processMarkdown(file);
        expect(html).toContain('<div class="custom">raw</div>');
      },
    );
  });
});
