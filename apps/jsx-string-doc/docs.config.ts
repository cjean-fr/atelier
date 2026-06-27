import { defineConfig } from "./docs-src/config.js";
import { MdxHandler } from "./docs-src/handlers/mdx.js";

export default defineConfig({
  title: "jsx-string",
  tagline: "Documentation",
  description: "The small, safe way to render JSX into HTML strings.",

  site: "https://vincle.netlify.app",
  image: "https://vincle.netlify.app/favicon.svg",

  pages: "docs-src/pages",
  examples: "docs-src/examples",
  clientEntry: "docs-src/client.ts",
  out: "dist",
  base: "/assets/",
  viteManifest: "dist/assets/.vite/manifest.json",

  sidebar: ["Guide", "API", "jsx-flow"],

  editUrl: "https://github.com/cjean-fr/atelier/edit/main/apps/jsx-string-doc",

  handlers: {
    ".mdx": { handler: MdxHandler, prose: true },
  },
});
