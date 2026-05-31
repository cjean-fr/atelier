/**
 * Concurrent renders — each withScope() is isolated, so the same context key
 * can hold different values in parallel calls without interference.
 *
 * Run: `bun examples/concurrent.tsx`
 */

import {
  context,
  setContext,
  useContext,
  withScope,
  renderToString,
} from "@cjean-fr/jsx-string";

const Locale = context<"en" | "fr">("examples:locale");

const messages = {
  en: "Hello, world!",
  fr: "Bonjour le monde !",
};

function Page() {
  const locale = useContext(Locale);
  return (
    <main lang={locale}>
      <h1>{messages[locale]}</h1>
    </main>
  );
}

const [enHtml, frHtml] = await Promise.all([
  withScope(async () => {
    setContext(Locale, "en");
    return renderToString(<Page />);
  }),
  withScope(async () => {
    setContext(Locale, "fr");
    return renderToString(<Page />);
  }),
]);

console.log("EN:", enHtml);
console.log("FR:", frHtml);
