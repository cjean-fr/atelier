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
      name: "jsonresume-theme-cjean",
      entry: "src/index.ts",
      formats: ["es", "cjs"],
      fileName: "index",
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
