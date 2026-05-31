import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@cjean-fr/jsx-string",
  },
  build: {
    target: "esnext",
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, "src/index.ts"),
        vite: path.resolve(__dirname, "src/vite.ts"),
        "search/index": path.resolve(__dirname, "src/search/index.ts"),
        client: path.resolve(__dirname, "src/client.ts"),
        "cli/index": path.resolve(__dirname, "src/cli/index.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "@cjean-fr/jsx-string",
        "@cjean-fr/jsx-string/jsx-runtime",
        "@cjean-fr/jsx-flow",
        "@cjean-fr/jsx-vite",
        "shiki",
        "vite",
        /^node:/,
      ],
      output: {
        // Mirror the source structure under dist/ so subpath exports work.
        entryFileNames: "[name].js",
        chunkFileNames: "shared/[name]-[hash].js",
      },
    },
  },
  plugins: [
    dts({
      include: ["src/**/*"],
      // Keep declaration files alongside JS for subpath exports.
      entryRoot: "src",
    }),
    // Static copy of CSS files — they're entry points users import directly
    // via package.json exports, not bundled JS-side.
    {
      name: "copy-css",
      async writeBundle() {
        const { mkdir, copyFile } = await import("node:fs/promises");
        const dest = path.resolve(__dirname, "dist/theme");
        await mkdir(dest, { recursive: true });
        for (const name of ["tokens.css", "shiki.css", "style.css"]) {
          await copyFile(
            path.resolve(__dirname, "src/theme", name),
            path.resolve(dest, name),
          );
        }
      },
    },
  ],
});
