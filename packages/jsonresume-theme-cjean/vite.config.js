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
        index: "src/index.tsx",
      },
      formats: ["es", "cjs"],
      fileName: "index",
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
