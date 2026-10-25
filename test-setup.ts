// Root `bun test` support: map workspace packages to their sources so tests
// never depend on a previous build (dist). Mirrors each package's `paths`.
import { plugin } from "bun";
import { resolve } from "node:path";

const sources: Record<string, string> = {
  "@cjean-fr/jsx-string": "packages/jsx-string/src/index.ts",
  "@cjean-fr/jsx-string/jsx-runtime": "packages/jsx-string/src/jsx-runtime.ts",
  "@cjean-fr/jsx-string/jsx-dev-runtime":
    "packages/jsx-string/src/jsx-dev-runtime.ts",
  "@cjean-fr/jsx-string/html": "packages/jsx-string/src/utils/html.ts",
  "@cjean-fr/precompile-core": "packages/precompile-core/src/index.ts",
  "@cjean-fr/i18n-tiny": "packages/i18n-tiny/src/index.ts",
};

console.log(
  "bun test (root): excludes jsonresume-theme-cjean (node:test) and static-site-bundle (PHP); `bun run test` runs everything.",
);

plugin({
  name: "workspace-sources",
  setup(build) {
    for (const [specifier, file] of Object.entries(sources)) {
      build.module(specifier, async () => ({
        exports: await import(resolve(import.meta.dir, file)),
        loader: "object",
      }));
    }
  },
});
