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
        "cli/index": path.resolve(__dirname, "src/cli/index.ts"),
        "search/index": path.resolve(__dirname, "src/search/index.ts"),
        "search/builtin/client": path.resolve(
          __dirname,
          "src/search/builtin/client.ts",
        ),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "@cjean-fr/jsx-string",
        "@cjean-fr/jsx-string/jsx-runtime",
        "@cjean-fr/jsx-flow",
        "@cjean-fr/jsx-vite",
        "vite",
        "gray-matter",
        "unified",
        "remark-parse",
        "remark-rehype",
        "rehype-stringify",
        /^node:/,
      ],
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "shared/[name]-[hash].js",
      },
    },
  },
  plugins: [
    dts({
      include: ["src/**/*"],
      entryRoot: "src",
    }),
  ],
});
