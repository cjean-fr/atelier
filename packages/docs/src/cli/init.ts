import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

interface InitOptions {
  withTailwind: boolean;
  force: boolean;
}

interface FileSpec {
  path: string;
  content: string;
}

/**
 * Scaffold a starter docs project in `cwd`.
 *
 * Minimal by default: docs.config, vite.config, client, sample page, plain
 * CSS. `--with-tailwind` adds Tailwind 4 + dark-mode setup + tokens/shiki.
 * Refuses to overwrite existing files unless `--force` is passed.
 */
export async function runInit(
  cwd: string,
  options: InitOptions,
): Promise<void> {
  const files = buildFiles(options);

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

  printNextSteps(options);
}

function buildFiles(options: InitOptions): FileSpec[] {
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

  const viteConfig = options.withTailwind
    ? `import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// The @cjean-fr/docs plugin is registered by the CLI ('docs dev' / 'docs build').
// Only project-specific plugins live here.
export default defineConfig({
  plugins: [tailwindcss()],
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
`
    : `import { defineConfig } from "vite";

// The @cjean-fr/docs plugin is registered by the CLI ('docs dev' / 'docs build').
// Only project-specific plugins live here.
export default defineConfig({
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

  const page = `import type { PageMeta } from "@cjean-fr/docs";

export const meta: PageMeta = {
  title: "Home",
};

export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <p>Edit <code>src/pages/index.tsx</code> to get started.</p>
    </div>
  );
}
`;

  const mainCss = options.withTailwind
    ? `@import "tailwindcss";
@import "@cjean-fr/docs/tailwind.css";

/* Add your own styles below. */
`
    : `@import "@cjean-fr/docs/style.css";

/* Add your own styles below. */
`;

  return [
    { path: "docs.config.ts", content: docsConfig },
    { path: "vite.config.ts", content: viteConfig },
    { path: "src/client.ts", content: client },
    { path: "src/pages/index.tsx", content: page },
    { path: "src/styles/main.css", content: mainCss },
  ];
}

function printNextSteps(options: InitOptions): void {
  const lines: string[] = ["", "Next steps:"];
  if (options.withTailwind) {
    lines.push("  1. bun add -D @tailwindcss/vite tailwindcss vite");
  } else {
    lines.push("  1. bun add -D vite");
  }
  lines.push(
    "  1b. bun add @cjean-fr/docs @cjean-fr/jsx-string @cjean-fr/jsx-flow @cjean-fr/jsx-vite",
  );
  lines.push("  2. Add to package.json scripts:");
  lines.push(`       "dev": "docs dev",`);
  lines.push(`       "build": "docs build"`);
  lines.push("  3. bun run dev");
  lines.push("");
  process.stdout.write(lines.join("\n"));
}
