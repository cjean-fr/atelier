import { readFile, writeFile } from "node:fs/promises";
import { render } from "../dist/index.js";

/**
 * Renders the demo CV (sample.json + the Michael Scott portrait) as a
 * self-contained sample.html: the portrait is inlined as a data URI so the
 * file renders identically everywhere, including the website snapshot at
 * cjean.fr/projets/theme-demo.html, which is a copy of this output.
 */
const sample = JSON.parse(
  await readFile(new URL("../sample.json", import.meta.url), "utf8"),
);
const portrait = await readFile(
  new URL("../assets/michael-scott.jpg", import.meta.url),
);
sample.basics.image = `data:image/jpeg;base64,${portrait.toString("base64")}`;
await writeFile(new URL("../sample.html", import.meta.url), await render(sample));
console.log("Wrote sample.html");
