import { render } from "../dist/index.js";
import assert from "node:assert/strict";
import test from "node:test";

/**
 * The Iconify API only serves `/{prefix}/{name}.svg`; the legacy
 * `{prefix}:{name}.svg` form answers 404. The fetch stubs that keep these
 * tests hermetic would also hide a wrong URL shape, so assert the requested
 * URLs explicitly.
 */
test("icon requests use the Iconify slash form", async (t) => {
  const urls = [];
  t.mock.method(globalThis, "fetch", async (input) => {
    urls.push(String(input));
    return new Response('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
  });

  await render({
    basics: {
      name: "Test",
      phone: "+1 555 555 0100",
      email: "test@example.com",
    },
    work: [],
  });

  const iconify = urls.filter((url) => url.includes("api.iconify.design"));
  assert.ok(iconify.length > 0, "expected icon requests");
  for (const url of iconify) {
    assert.match(
      url,
      /^https:\/\/api\.iconify\.design\/[^:]+\.svg/,
      `colon form 404s on the Iconify API: ${url}`,
    );
  }
  assert.ok(
    iconify.some((url) => url.includes("/tabler/phone.svg")),
    "the contact phone icon is requested",
  );
});
