import { Docs } from "../context.js";
import { CodeBlock } from "./CodeBlock.js";
import { readFile } from "node:fs/promises";
import path from "node:path";

export interface CodeExampleProps {
  src: string;
  language?: string;
}

export async function CodeExample({ src, language }: CodeExampleProps) {
  const { config } = Docs.get();
  const file = path.resolve(config.examples, src);
  const code = await readFile(file, "utf-8");
  return (
    <CodeBlock code={code} language={language ?? path.extname(src).slice(1)} />
  );
}
