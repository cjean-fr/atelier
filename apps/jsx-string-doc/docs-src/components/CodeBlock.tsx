/** @jsxImportSource @cjean-fr/jsx-string */
import { raw } from "@cjean-fr/jsx-string";

export interface CodeBlockProps {
  code: string;
  language?: string;
  label?: string;
}

const DEFAULT_LIGHT_THEME = "github-light";
const DEFAULT_DARK_THEME = "github-dark";

type CodeToHtml = (code: string, options: object) => Promise<string>;

let shikiPromise: Promise<unknown> | null = null;

async function getCodeToHtml(): Promise<CodeToHtml | null> {
  if (shikiPromise === null) {
    shikiPromise = import("shiki").catch(() => null);
  }
  const mod = (await shikiPromise) as { codeToHtml?: CodeToHtml } | null;
  return mod?.codeToHtml ?? null;
}

export async function CodeBlock({
  code,
  language = "text",
  label,
}: CodeBlockProps) {
  const cleaned = code.trim();
  const codeToHtml = await getCodeToHtml();

  let body: string;
  if (codeToHtml) {
    try {
      body = await codeToHtml(cleaned, {
        lang: language,
        themes: { light: DEFAULT_LIGHT_THEME, dark: DEFAULT_DARK_THEME },
        defaultColor: false,
      });
    } catch {
      body = renderPlain(cleaned);
    }
  } else {
    body = renderPlain(cleaned);
  }

  return (
    <div class="docs-code-block relative my-4">
      {(label ?? language) !== "text" && (
        <span class="docs-code-lang absolute top-2 right-3 font-mono text-xs text-gray-500 select-none dark:text-gray-400">
          {label ?? language}
        </span>
      )}
      {raw(body)}
    </div>
  );
}

function renderPlain(code: string): string {
  return `<pre class="docs-code-pre overflow-x-auto rounded-lg bg-gray-950 dark:bg-gray-900 border border-gray-800 p-4 text-sm font-mono leading-relaxed text-gray-100"><code>${escapeHtml(code)}</code></pre>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
