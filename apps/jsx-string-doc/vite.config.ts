import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  plugins: [
    mdx({
      jsxImportSource: '@cjean-fr/jsx-string',
      providerImportSource: './docs-src/mdx-components.jsx',
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
