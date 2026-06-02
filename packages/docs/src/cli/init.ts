import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

interface InitOptions {
  force: boolean;
}

interface FileSpec {
  path: string;
  content: string;
}

/**
 * Scaffold a starter docs project in `cwd`.
 *
 * Tailwind 4 is the theming layer: the scaffold wires `@tailwindcss/vite`,
 * MDX (`.mdx` pages), dark-mode, and the docs preset stylesheet. Refuses to
 * overwrite existing files unless `--force` is passed.
 */
export async function runInit(
  cwd: string,
  options: InitOptions,
): Promise<void> {
  const files = buildFiles();

  if (!options.force) {
    const conflicts: string[] = [];
    for (const f of files) {
      try {
        await access(path.join(cwd, f.path));
        conflicts.push(f.path);
      } catch {
        /* missing — good */
      }
    }
    if (conflicts.length > 0) {
      process.stderr.write(
        `[@cjean-fr/docs] These files already exist:\n${conflicts.map((p) => `  - ${p}`).join("\n")}\nRe-run with --force to overwrite.\n`,
      );
      process.exitCode = 1;
      return;
    }
  }

  for (const f of files) {
    const full = path.join(cwd, f.path);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, f.content, "utf-8");
    console.log(`  created ${f.path}`);
  }

  printNextSteps();
}

function buildFiles(): FileSpec[] {
  const docsConfig = `import { defineConfig } from "@cjean-fr/docs";

export default defineConfig({
  title: "My Docs",
  description: "Documentation built with @cjean-fr/docs.",

  pages: "src/pages",
  clientEntry: "src/client.ts",
  out: "dist",
  base: "/assets/",
  viteManifest: "dist/assets/.vite/manifest.json",
});
`;

  const viteConfig = `import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm";

// The @cjean-fr/docs plugin is registered by the CLI ('docs dev' / 'docs build').
// Only project-specific plugins live here.
export default defineConfig({
  plugins: [
    // \`.mdx\` pages compile to jsx-string components; the frontmatter becomes
    // the \`meta\` export the page loader reads.
    mdx({
      jsxImportSource: "@cjean-fr/jsx-string",
      // Built-in docs components (<CodeBlock>, <Tabs>, <Aside>, …) are
      // auto-provided — no need to import them in every page.
      providerImportSource: "@cjean-fr/docs/mdx-components",
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: "meta" }],
        remarkGfm,
      ],
    }),
    tailwindcss(),
  ],
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@cjean-fr/jsx-string",
  },
  build: {
    outDir: "dist/assets",
    assetsDir: "",
    manifest: true,
    rollupOptions: {
      input: "src/client.ts",
      output: {
        entryFileNames: "[name]-[hash].js",
        assetFileNames: "[name]-[hash][extname]",
      },
    },
  },
});
`;

  const client = `import "./styles/main.css";
import "@cjean-fr/docs/client";
`;

  const page = `---
title: Home
---

# Welcome

Edit \`src/pages/index.mdx\` to get started.

Pages are Markdown — the built-in components (\`CodeBlock\`, \`Tabs\`, \`Aside\`,
…) are available out of the box; just use them inline. Need your own? Add an
\`import\` at the top.
`;

  const mainCss = `@import "tailwindcss";
@import "@cjean-fr/docs/main.css";

/* Add your own styles below. */
`;

  return [
    { path: "docs.config.ts", content: docsConfig },
    { path: "vite.config.ts", content: viteConfig },
    { path: "src/client.ts", content: client },
    { path: "src/pages/index.mdx", content: page },
    { path: "src/styles/main.css", content: mainCss },
  ];
}

function printNextSteps(): void {
  const mdxDeps =
    "@mdx-js/rollup remark-frontmatter remark-mdx-frontmatter remark-gfm";
  const lines: string[] = [
    "",
    "Next steps:",
    `  1. bun add -D @tailwindcss/vite tailwindcss vite ${mdxDeps}`,
    "  1b. bun add @cjean-fr/docs @cjean-fr/jsx-string @cjean-fr/jsx-flow @cjean-fr/jsx-vite",
    "  2. Add to package.json scripts:",
    `       "dev": "docs dev",`,
    `       "build": "docs build"`,
    "  3. bun run dev",
    "",
  ];
  process.stdout.write(lines.join("\n"));
}
