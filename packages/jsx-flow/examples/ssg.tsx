// @jsxImportSource @cjean-fr/jsx-string
/**
 * Demo: static site generation (SSG) with TurboAdapter
 *
 * Run: bun examples/ssg.tsx
 *
 * Writes dist/index.html (shell) and dist/fragments/*.html (islands).
 * The shell uses <turbo-frame src="..."> placeholders; Turbo lazy-loads
 * each fragment on page load and replaces the frame with its content.
 *
 * Fragment files are <turbo-frame id="id">content</turbo-frame> — the
 * format Turbo frame lazy-loading expects (distinct from the inline
 * <turbo-stream> format used in streaming SSR).
 */
import { Island, renderToStatic, TurboAdapter } from "../src/index.js";
import { renderToString, type JSXNode } from "@cjean-fr/jsx-string";
import { mkdir, writeFile } from "node:fs/promises";

// Simulated data

const stats = { users: 1_234, online: 56 };
const feed = [
  "Article published — 2 min ago",
  "New signup — 5 min ago",
  "Deploy succeeded — 12 min ago",
];

// Components

function Stats() {
  return (
    <div class="stats">
      <strong>{stats.users}</strong> users · <strong>{stats.online}</strong> online
    </div>
  );
}

function Feed() {
  return (
    <ul>
      {feed.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
  );
}

// Shell — <Island> in static mode auto-generates src via generatePath

function Shell() {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>jsx-flow · SSG demo</title>
        {/* Turbo handles <turbo-frame src="..."> lazy-loading */}
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/@hotwired/turbo@8/dist/turbo.es2017.esm.js"
        />
        <style>{`
          body { font-family: sans-serif; max-width: 640px; margin: 2rem auto; padding: 0 1rem; }
          .placeholder { color: #aaa; font-style: italic; }
          .stats, ul { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; }
        `}</style>
      </head>
      <body>
        <h1>Dashboard</h1>

        <h2>Stats</h2>
        <Island name="stats" fallback={<p class="placeholder">Loading stats…</p>}>
          {() => <Stats />}
        </Island>

        <h2>Activity feed</h2>
        <Island name="feed" fallback={<p class="placeholder">Loading feed…</p>}>
          {() => <Feed />}
        </Island>
      </body>
    </html>
  );
}

// Build

const generatePath = (id: string) => `/fragments/${id}.html`;

const { pages, fragments } = await renderToStatic(
  async (ctx) => {
    // renderPage applies head channel + adapter transforms automatically,
    // symmetric with renderToReadableStream's behaviour in streaming mode.
    const html = await ctx.renderPage(() => <Shell />);

    // Generate fragment files via adapter.Frame — the SSG lazy-load format.
    // TurboAdapter.Frame produces <turbo-frame id="id"> which Turbo fetches and
    // replaces the placeholder frame with. Distinct from Patch's <turbo-stream>.
    const fragments = new Map<string, string>();
    for (const [id, { factory }] of ctx.channels.fragment) {
      const content = await renderToString(
        TurboAdapter.Frame({ id, children: factory() as JSXNode }),
      );
      fragments.set(generatePath(id), content);
    }

    return { pages: new Map([["/index.html", html]]), fragments };
  },
  TurboAdapter,
  generatePath,
);

// Write output

await mkdir("dist/fragments", { recursive: true });

for (const [path, html] of pages) {
  const file = `dist${path}`;
  await writeFile(file, `<!DOCTYPE html>${html}`);
  console.log(`wrote ${file}`);
}

for (const [path, html] of fragments) {
  const file = `dist${path}`;
  await writeFile(file, html);
  console.log(`wrote ${file}`);
}

console.log("\nDone. Serve dist/ with any static file server.");
