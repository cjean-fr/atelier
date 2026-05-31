import { defineDocs } from '@cjean-fr/docs';

export default defineDocs({
  title: 'jsx-string',
  tagline: 'Documentation',
  description: 'The small, safe way to render JSX into HTML strings.',

  pages: 'docs-src/pages',
  examples: 'docs-src/examples',
  clientEntry: 'docs-src/client.ts',
  out: 'dist',
  base: '/assets/',
  viteManifest: 'dist/assets/.vite/manifest.json',

  sidebar: ['Guide', 'API'],
});
