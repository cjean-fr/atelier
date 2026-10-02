import { compile, optimize } from "@tailwindcss/node";
import { Scanner } from "@tailwindcss/oxide";
import { readFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const base = dirname(fileURLToPath(import.meta.url));
const entities: Record<string, string> = {
  "&amp;": "&",
  "&quot;": '"',
  "&lt;": "<",
};

export async function compileStyles(html: string): Promise<string> {
  // Decode Vincle's attribute escaping for arbitrary variants such as [&_a].
  // This copy is only scanned; the document we return stays escaped.
  const classAttributes = [...html.matchAll(/\bclass="([^"]*)"/g)]
    .map((match) => match[1])
    .join(" ");
  const content = classAttributes.replace(
    /&(amp|quot|lt);/g,
    (entity) => entities[entity]!,
  );
  const candidates = new Scanner({}).scanFiles([
    { content, extension: "html" },
  ]);

  // Both Scanner and build() accumulate candidates. Keep them per-render so
  // a previous CV's optional sections cannot leak utilities into the next one.
  const source = await readFile(
    new URL("./tailwind.input.css", import.meta.url),
    "utf-8",
  );
  const compiler = await compile(source, {
    base,
    onDependency() {},
  });

  return optimize(compiler.build(candidates), { minify: true }).code;
}
