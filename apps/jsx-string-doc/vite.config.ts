import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';

// The `@cjean-fr/docs` plugin is registered by the CLI (`docs dev` /
// `docs build`). Only project-specific plugins live here.
export default defineConfig({
  plugins: [
    // `.mdx` pages compile to jsx-string components — frontmatter is exposed
    // as the `meta` export the page loader reads.
    mdx({
      jsxImportSource: '@cjean-fr/jsx-string',
      // Built-in docs components are auto-provided — pages use <CodeExample>,
      // <Tabs>, etc. without importing them.
      providerImportSource: '@cjean-fr/docs/mdx-components',
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: 'meta' }],
        remarkGfm,
      ],
    }),
    tailwindcss(),
  ],
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
