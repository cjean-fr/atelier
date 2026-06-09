import { build } from "bun";
import { $ } from "bun";

await build({
  entrypoints: ["./src/index.ts", "./src/transformer.ts"],
  outdir: "./dist",
  target: "node",
  format: "esm",
  external: ["typescript", "vite"],
});

await $`bun x tsc -p tsconfig.build.json`;
