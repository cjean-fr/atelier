import { render } from "../dist/index.js";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import test from "node:test";

const minimal = {
  basics: { name: "Example" },
  meta: { lastModified: "2026-09-29" },
};

function stylesheet(html) {
  const match = html.match(/<style id="resume-styles">([\s\S]*?)<\/style>/);
  assert.ok(match?.[1], "Generated stylesheet must be inserted into the head");
  return match[1];
}

test("only generates optional CTA utilities when the CTA is rendered", async (t) => {
  const fetch = t.mock.method(
    globalThis,
    "fetch",
    async () => new Response('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
  );
  const before = stylesheet(await render(minimal));
  const withCta = stylesheet(
    await render({
      ...minimal,
      meta: {
        ...minimal.meta,
        themeConfig: {
          ui: { cta: { text: "Contact", url: "https://example.com" } },
        },
      },
    }),
  );
  const after = stylesheet(await render(minimal));

  assert.ok(!before.includes(".fab-open\\:pr-6"));
  assert.ok(withCta.includes(".fab-open\\:pr-6"));
  assert.ok(withCta.includes(".fab--extended"));
  assert.ok(withCta.includes(".group-fab-open\\:opacity-100"));
  assert.ok(withCta.length > before.length);
  assert.equal(after, before, "Candidates must not accumulate between resumes");
  assert.equal(
    fetch.mock.callCount(),
    1,
    "Body components must only render once",
  );
});

test("preserves escaped arbitrary selectors and print utilities in a light-only document", async () => {
  const html = await render(minimal);
  const css = stylesheet(html);
  assert.ok(html.includes("[&amp;_a]:underline"));
  assert.ok(css.includes(".\\[\\&_a\\]\\:underline a"));
  assert.ok(!css.includes("amp;"));
  assert.ok(!css.includes(".dark"));
  assert.ok(html.includes('name="color-scheme" content="light"'));
  assert.ok(!html.includes("resume-theme"));
  assert.ok(!html.includes("prefers-color-scheme"));
  assert.ok(css.includes(".print\\:hidden"));
  assert.ok(css.includes("@media print"));
  assert.doesNotMatch(css, /@(?:import|apply|utility|theme)\b/);
});

test("CommonJS resolves Tailwind from the installed package, not the current directory", async () => {
  const originalDirectory = process.cwd();
  try {
    process.chdir(tmpdir());
    const { render } = createRequire(import.meta.url)("../dist/index.cjs");
    assert.ok(stylesheet(await render(minimal)).includes(".print\\:hidden"));
  } finally {
    process.chdir(originalDirectory);
  }
});

test("composes one document with CSS in the head and escaped body content", async () => {
  const summary = '<em title="example">A & B</em>';
  const html = await render({
    ...minimal,
    basics: { name: "Example", summary },
  });
  for (const tag of ["html", "head", "body"]) {
    assert.equal(
      (html.match(new RegExp(`<${tag}(?: |>)`, "g")) ?? []).length,
      1,
    );
    assert.equal((html.match(new RegExp(`</${tag}>`, "g")) ?? []).length, 1);
  }
  assert.ok(html.startsWith("<!doctype html>"));
  assert.ok(
    html.indexOf('<style id="resume-styles">') < html.indexOf("</head>"),
  );
  assert.ok(html.indexOf("</head>") < html.indexOf("<body "));
  const body = html.slice(html.indexOf("<body "), html.indexOf("</main>"));
  assert.ok(body.includes("&lt;em"));
  assert.ok(body.includes("A &amp; B"));
  assert.ok(
    !body.includes("&amp;lt;em"),
    "Rendered body must not be escaped twice",
  );
  assert.ok(!body.includes("<em"), "Resume text must remain escaped");
  stylesheet(html);
});

test("shares one SVG background between header and footer", async () => {
  const html = await render(minimal);
  assert.equal((html.match(/data:image\/svg\+xml,/g) ?? []).length, 1);
  assert.equal((html.match(/class="resume-tiles /g) ?? []).length, 2);
  assert.ok(
    html.includes('--theme-background-tiles: url("data:image/svg+xml,'),
  );
  assert.ok(
    stylesheet(html).includes("background-image:var(--theme-background-tiles)"),
  );
});

test("JSON-LD preserves the public professional profile without personal contact details", async () => {
  const html = await render({
    ...minimal,
    basics: {
      name: "Private Person",
      label: "Private role",
      summary: "Private biography",
      birthDate: "1980-01-02",
      email: "private@example.com",
      phone: "+33123456789",
      image: "https://example.com/private-portrait.png",
      url: "https://example.com/private-profile",
      profiles: [{ network: "GitHub", url: "https://github.com/example" }],
      location: {
        city: "Private city",
        postalCode: "12345",
        countryCode: "FR",
      },
    },
    work: [
      {
        name: "Private employer",
        position: "Private position",
        startDate: "2020-01-01",
      },
    ],
    education: [{ institution: "Private school", startDate: "2000-01-01" }],
    skills: [{ name: "Private skill", keywords: ["Private keyword"] }],
    meta: {
      ...minimal.meta,
      themeConfig: { ui: { showLogos: false, links: [] } },
    },
  });
  const scripts = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];
  assert.equal(scripts.length, 1);
  const json = JSON.parse(scripts[0][1]);
  assert.equal(json["@type"], "ProfilePage");
  assert.equal(json.mainEntity["@type"], "Person");
  assert.equal(json.mainEntity.name, "Private Person");
  assert.equal(json.mainEntity.jobTitle, "Private role");
  assert.equal(json.mainEntity.description, "Private biography");
  assert.equal(
    json.mainEntity.image,
    "https://example.com/private-portrait.png",
  );
  assert.equal(json.mainEntity.url, "https://example.com/private-profile");
  assert.deepEqual(json.mainEntity.sameAs, ["https://github.com/example"]);
  assert.equal(json.mainEntity.worksFor.name, "Private employer");
  assert.equal(json.mainEntity.alumniOf[0].name, "Private school");
  assert.deepEqual(json.mainEntity.knowsAbout, ["Private keyword"]);
  for (const key of ["email", "telephone", "birthDate", "address"]) {
    assert.ok(!(key in json.mainEntity), `${key} must not be published`);
  }
  assert.ok(
    html.includes("Private Person"),
    "Visible resume content is preserved",
  );
});

test("resume text does not generate unrelated CSS utilities", async () => {
  const withText = stylesheet(
    await render({
      ...minimal,
      basics: { name: "Example", summary: "bg-red-500 p-96 rotate-180" },
    }),
  );
  assert.ok(!withText.includes(".bg-red-500"));
  assert.ok(!withText.includes(".p-96"));
  assert.ok(!withText.includes(".rotate-180"));
});
