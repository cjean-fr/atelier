/**
 * Async component that loads a code example from disk and renders it via
 * `<CodeBlock>`. Examples live under `config.examples` (default `./examples`)
 * — the `src` prop is the path relative to that directory.
 *
 * Keeps page sources free of inline code blobs.
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { useDocs } from "../context.js";
import { CodeBlock } from "./CodeBlock.js";

export interface CodeExampleProps {
  /** Path relative to `config.examples` (e.g. `"guide/intro/hello.tsx"`). */
  src: string;
  /** Override the language label. Defaults to the file extension. */
  language?: string;
}

export async function CodeExample({ src, language }: CodeExampleProps) {
  const { config } = useDocs();
  const file = path.join(config.examples, src);
  const code = await readFile(file, "utf-8");
  return <CodeBlock code={code} language={language ?? path.extname(src).slice(1)} />;
}
