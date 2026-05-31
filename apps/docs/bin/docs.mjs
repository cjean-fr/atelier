#!/usr/bin/env node

// Silence DEP0205 emitted by @tailwindcss/node (still uses
// `module.register()`). Drop only this specific code so genuine warnings
// from elsewhere keep surfacing.
const originalEmit = process.emit;
process.emit = function (name, data, ...rest) {
  if (name === "warning" && data && data.code === "DEP0205") return false;
  return originalEmit.call(this, name, data, ...rest);
};

const { run } = await import("../dist/cli/index.js");

run(process.argv.slice(2)).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
