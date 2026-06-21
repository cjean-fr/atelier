import { compile } from "@mdx-js/mdx";
import grayMatter from "gray-matter";
import crypto from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import rehypeSlug from "rehype-slug";

export interface CompiledMdx {
  Component: (props: object) => import("@cjean-fr/jsx-string").JSXNode;
  meta: Record<string, unknown>;
}

export class MdxCache {
  #compiled = new Map<string, string>();
  #modules = new Map<string, CompiledMdx>();
  #pending = new Map<string, Promise<CompiledMdx>>();

  async load(file: string): Promise<CompiledMdx> {
    const raw = await readFile(file, "utf-8");
    const hash = this.#hash(raw);
    const key = `${file}:${hash}`;

    const existing = this.#modules.get(key);
    if (existing) return existing;

    const prev = this.#pending.get(key);
    if (prev) return prev;

    const promise = this.#compileAndLoad(file, raw, key);
    this.#pending.set(key, promise);
    try {
      return await promise;
    } finally {
      this.#pending.delete(key);
    }
  }

  async #compileAndLoad(
    file: string,
    raw: string,
    key: string,
  ): Promise<CompiledMdx> {
    const { data: frontmatter, content } = grayMatter(raw);
    const compiled = String(
      await compile(content, {
        jsxImportSource: "@cjean-fr/jsx-string",
        providerImportSource: pathToFileURL(
          path.resolve("docs-src/mdx-components.jsx"),
        ).href,
        rehypePlugins: [rehypeSlug],
      }),
    );

    this.#compiled.set(key, compiled);

    const mod = await this.#importModule(file, compiled);
    const Component = mod.default;
    if (typeof Component !== "function") {
      throw new Error(
        `[jsx-string-doc] Compiled MDX ${file} has no default export.`,
      );
    }

    const entry: CompiledMdx = {
      Component,
      meta: frontmatter as Record<string, unknown>,
    };
    this.#modules.set(key, entry);
    return entry;
  }

  async #importModule(
    file: string,
    code: string,
  ): Promise<{
    default: (props: object) => import("@cjean-fr/jsx-string").JSXNode;
  }> {
    const pagesDir = path.resolve("docs-src/pages");
    const rel = path.relative(pagesDir, file);
    const tmpFile = path.join(
      pagesDir,
      ".compiled",
      rel.replace(/\.mdx$/, ".tsx"),
    );
    const tmpDir = path.dirname(tmpFile);
    if (!existsSync(tmpDir)) {
      await mkdir(tmpDir, { recursive: true });
    }
    await writeFile(tmpFile, code, "utf-8");
    return import(pathToFileURL(tmpFile).href);
  }

  #hash(content: string): string {
    return crypto
      .createHash("sha256")
      .update(content)
      .digest("hex")
      .slice(0, 16);
  }

  invalidate(file: string): void {
    const prefix = file + ":";
    for (const key of this.#compiled.keys()) {
      if (key.startsWith(prefix)) {
        this.#compiled.delete(key);
        this.#modules.delete(key);
      }
    }
  }

  clear(): void {
    this.#compiled.clear();
    this.#modules.clear();
    this.#pending.clear();
  }
}

export const mdxCache = new MdxCache();
