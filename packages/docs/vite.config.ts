import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

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
        client: path.resolve(__dirname, "src/client.ts"),
        "mdx-components": path.resolve(__dirname, "src/mdx-components.ts"),
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
        "@cjean-fr/build-core",
        "@cjean-fr/build-core/cli",
        "@cjean-fr/build-core/vite",
        "@cjean-fr/build-core/search",
        "@cjean-fr/build-core/search/builtin/client",
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
    // Theme CSS ships as source (see package.json exports `./main.css` and
    // `./style.css`); the consumer's Tailwind compiles it. No copy needed.
  ],
});
