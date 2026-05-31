/**
 * Default client entry for `@cjean-fr/docs`. Add `import "@cjean-fr/docs/client"`
 * to your project's client bundle (e.g. inside `client.ts`) and all default
 * client-side enhancements get wired automatically:
 *
 *   - builtin search adapter runtime
 *   - TOC scroll-spy
 *
 * When other adapters ship, the search import becomes adapter-aware via
 * virtual module rewrite by the Vite plugin.
 */
import "./nav/client.js";
import "./tabs/client.js";
import "./theme/client.js";
import "./toc/client.js";
import "@cjean-fr/build-core/search/builtin/client";
