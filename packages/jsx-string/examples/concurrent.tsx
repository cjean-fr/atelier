/**
 * Concurrent renders — each render's bindings are isolated, so the same
 * context token can hold different values in parallel calls without
 * interference.
 *
 * Run: `bun examples/concurrent.tsx`
 */
import { context, renderToString } from "@cjean-fr/jsx-string";

const Locale = context<"en" | "fr">("examples:locale");

const messages = {
  en: "Hello, world!",
  fr: "Bonjour le monde !",
};

function Page() {
  const locale = Locale.get();
  return (
    <main lang={locale}>
      <h1>{messages[locale]}</h1>
    </main>
  );
}

const [enHtml, frHtml] = await Promise.all([
  renderToString(() => <Page />, { context: [Locale.with("en")] }),
  renderToString(() => <Page />, { context: [Locale.with("fr")] }),
]);

console.log("EN:", enHtml);
console.log("FR:", frHtml);
