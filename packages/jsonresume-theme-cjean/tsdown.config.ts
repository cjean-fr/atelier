import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm", "cjs"],
  platform: "node",
  target: "node22",
  dts: true,
  clean: true,
  minify: true,
  deps: {
    onlyBundle: ["@vincle/core", "@cjean-fr/i18n-tiny", "zod"],
  },
  outExtensions: ({ format }) => ({
    js: format === "cjs" ? ".cjs" : ".js",
    dts: format === "cjs" ? ".d.cts" : ".d.ts",
  }),
  copy: { from: "src/styles/tailwind.input.css", to: "dist" },
});
