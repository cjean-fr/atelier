import { build } from "vite";
import precompile from "@cjean-fr/vite-plugin-precompile";
import path from "path";

const entry = path.resolve(import.meta.dirname, "../src/realworld/precompile-src.tsx");
const outDir = path.resolve(import.meta.dirname, "../src/realworld");

await build({
  esbuild: { jsxImportSource: "@cjean-fr/jsx-string" },
  plugins: [precompile()],
  build: {
    outDir,
    emptyOutDir: false,
    lib: {
      entry,
      formats: ["es"],
      fileName: () => "precompile.js",
    },
    rollupOptions: {
      external: [/@cjean-fr/],
      output: {
        generatedCode: {
          constBindings: true,
          objectShorthand: true,
          preset: "es2015",
        },
      },
    },
    minify: false,
  },
});
