import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// The `@cjean-fr/docs` plugin is registered by the CLI (`docs dev` /
// `docs build`). Only project-specific plugins live here.
export default defineConfig({
  plugins: [tailwindcss()],
  appType: 'custom',
  publicDir: 'public',
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: '@cjean-fr/jsx-string',
  },
  build: {
    outDir: 'dist/assets',
    assetsDir: '',
    manifest: true,
    rollupOptions: {
      input: 'docs-src/client.ts',
      output: {
        entryFileNames: '[name]-[hash].js',
        assetFileNames: '[name]-[hash][extname]',
      },
    },
  },
});
