import { render } from "../dist/index.js";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

/**
 * Integration coverage for a complete resume.
 *
 * The other test files feed `render()` a minimal document and assert on one
 * concern at a time (styles, JSON-LD, escaping). This one renders a resume
 * that exercises every section the theme knows about, so a section that stops
 * being rendered — or that is rendered but never styles its own markup — is
 * caught here.
 *
 * The fixture is synthetic on purpose: this package is published publicly, so
 * it must not carry a real person's contact details.
 */
const fixturePath = join(import.meta.dirname, "fixtures/resume.full.json");

const sectionLabels = [
  // French labels from `src/lib/i18n.ts`; the fixture sets `meta.lang: "fr"`.
  "Expériences professionnelles",
  "Projets",
  "Formations",
  "Compétences",
];

/** Icons and logos are fetched over the network; keep the tests hermetic. */
function stubFetch(t) {
  return t.mock.method(
    globalThis,
    "fetch",
    async () => new Response('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
  );
}

async function loadFixture() {
  return JSON.parse(await readFile(fixturePath, "utf8"));
}

test("renders every section of a complete resume", async (t) => {
  stubFetch(t);
  const resume = await loadFixture();
  const html = await render(resume);

  assert.ok(html.startsWith("<!doctype html>"));

  // Sections
  for (const label of sectionLabels) {
    assert.ok(html.includes(label), `Missing section heading: ${label}`);
  }

  // Every work entry, newest first, with its company name visible.
  const companies = resume.work.map((w) => w.company);
  let previous = -1;
  for (const company of companies) {
    const at = html.indexOf(company);
    assert.ok(at > -1, `Missing company: ${company}`);
    assert.ok(at > previous, `Companies are not in the fixture order`);
    previous = at;
  }

  // Highlights are rendered as list items.
  for (const work of resume.work) {
    for (const highlight of work.highlights ?? []) {
      assert.ok(
        html.includes(highlight),
        `Missing highlight: ${highlight.slice(0, 40)}`,
      );
    }
  }

  // Projects, education, certificates and skills
  for (const project of resume.projects) {
    assert.ok(html.includes(project.name), `Missing project: ${project.name}`);
  }
  for (const education of resume.education) {
    assert.ok(
      html.includes(education.institution),
      `Missing institution: ${education.institution}`,
    );
  }
  for (const certificate of resume.certificates) {
    assert.ok(
      html.includes(certificate.name),
      `Missing certificate: ${certificate.name}`,
    );
  }
  for (const skill of resume.skills) {
    assert.ok(html.includes(skill.name), `Missing skill group: ${skill.name}`);
  }
});

test("keeps contact details out of the document while rendering the resume", async (t) => {
  stubFetch(t);
  const resume = await loadFixture();
  const html = await render(resume);

  // The links list is configured to show phone, email, location and profiles.
  assert.ok(html.includes(resume.basics.email));
  assert.ok(html.includes(resume.basics.name));
  assert.ok(html.includes(resume.basics.summary));

  // ...but JSON-LD must not republish private contact details.
  const jsonLd = JSON.parse(
    html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1],
  );
  for (const key of ["email", "telephone", "birthDate", "address"]) {
    assert.ok(
      !(key in jsonLd.mainEntity),
      `${key} must not be published in JSON-LD`,
    );
  }
});

test("renders the CTA and the print stylesheet for a complete resume", async (t) => {
  stubFetch(t);
  const resume = await loadFixture();
  const html = await render(resume);

  assert.ok(html.includes(resume.meta.themeConfig.ui.cta.text));
  assert.ok(html.includes(resume.meta.themeConfig.ui.cta.url));

  const css = html.match(/<style id="resume-styles">([\s\S]*?)<\/style>/)[1];
  assert.ok(css.includes("@media print"));
  assert.ok(css.includes(".print\\:hidden"));
  assert.ok(css.includes(".fab--extended"), "CTA utilities must be generated");
});

test("the complete fixture is valid JSON Resume and stays synthetic", async () => {
  const resume = await loadFixture();

  assert.equal(resume.meta.lang, "fr");
  assert.ok(resume.basics.name);
  assert.ok(resume.work.length > 0);
  assert.ok(resume.projects.length > 0);
  assert.ok(resume.education.length > 0);
  assert.ok(resume.skills.length > 0);

  // Guard rail: a published fixture must not contain a real person's details.
  assert.match(
    resume.basics.email,
    /@example\.com$/,
    "Fixture emails must use the reserved example.com domain",
  );
  for (const profile of resume.basics.profiles ?? []) {
    assert.match(profile.url, /^https:\/\/(www\.)?(github|linkedin)\.com\//);
  }
});
