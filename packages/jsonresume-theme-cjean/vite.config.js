import dts from 'vite-plugin-dts';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  publicDir: false,
  plugins: [
    tailwindcss(),
    dts({ rollupTypes: true })
  ],
  build: {
    lib: {
      entry: {
        index: "src/index.ts",
        bin: "src/bin.ts",
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["node:fs/promises", "node:path", "node:util", "node:crypto"],
      output: {
        banner: (chunk) => {
          if (chunk.name === "bin") {
            return "#!/usr/bin/env node\n";
          }
          return "";
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
