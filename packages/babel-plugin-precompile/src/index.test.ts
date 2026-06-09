import { describe, it, expect } from "bun:test";
import babel from "@babel/core";
import { jsxAttr } from "@cjean-fr/jsx-string/jsx-runtime";
import plugin from "./index.js";

const RUNTIME = "@cjean-fr/jsx-string/jsx-runtime";

function transform(source: string): string {
  const result = babel.transformSync(source, {
    plugins: [plugin, "@babel/plugin-syntax-jsx"],
    filename: "test.tsx",
    configFile: false,
    babelrc: false,
  });
  return result?.code ?? "";
}

function transformSecure(source: string): string {
  const result = babel.transformSync(source, {
    plugins: [[plugin, { secure: true, renderAttr: jsxAttr }], "@babel/plugin-syntax-jsx"],
    filename: "test.tsx",
    configFile: false,
    babelrc: false,
  });
  return result?.code ?? "";
}

function expectOutput(source: string, expected: string): void {
  const actual = transform(source);
  const normalize = (s: string) =>
    s.replace(/\s+/g, " ").trim();
  expect(normalize(actual)).toBe(normalize(expected));
}

describe("babel-plugin-precompile", () => {
  it("transforms a simple div with static text", () => {
    expectOutput(
      `const x = <div>hello</div>;`,
      `import { jsxTemplate } from "${RUNTIME}"; const x = jsxTemplate\`<div>hello</div>\`;`,
    );
  });

  it("handles static attributes", () => {
    expectOutput(
      `const x = <div class="foo">text</div>;`,
      `import { jsxTemplate } from "${RUNTIME}"; const x = jsxTemplate\`<div class="foo">text</div>\`;`,
    );
  });

  it("handles dynamic children with jsxEscape", () => {
    expectOutput(
      `const x = <div>{name}</div>;`,
      `import { jsxTemplate, jsxEscape } from "${RUNTIME}"; const x = jsxTemplate\`<div>\${jsxEscape(name)}</div>\`;`,
    );
  });

  it("handles dynamic attributes with jsxAttr", () => {
    expectOutput(
      `const x = <div id={x}>text</div>;`,
      `import { jsxTemplate, jsxAttr } from "${RUNTIME}"; const x = jsxTemplate\`<div\${jsxAttr("id", x)}>text</div>\`;`,
    );
  });

  it("handles mixed static and dynamic attributes", () => {
    expectOutput(
      `const x = <div class="foo" id={x}>text</div>;`,
      `import { jsxTemplate, jsxAttr } from "${RUNTIME}"; const x = jsxTemplate\`<div class="foo"\${jsxAttr("id", x)}>text</div>\`;`,
    );
  });

  it("handles expressions containing JSX", () => {
    expectOutput(
      `const x = <div>{flag && <span>nested</span>}</div>;`,
      `import { jsxTemplate } from "${RUNTIME}"; const x = jsxTemplate\`<div>\${flag && jsxTemplate\`<span>nested</span>\`}</div>\`;`,
    );
  });

  it("does not transform components (uppercase)", () => {
    const source = `const x = <MyComponent foo={bar}>text</MyComponent>;`;
    const result = transform(source);
    expect(result).toContain("MyComponent");
    expect(result).not.toContain("jsxTemplate");
  });

  it("does not add duplicate imports", () => {
    const source = `import { jsxTemplate } from "${RUNTIME}"; const x = <div>hello</div>;`;
    const result = transform(source);
    const matches = result.match(/from\s+"@cjean-fr\/jsx-string\/jsx-runtime"/g);
    expect(matches).toHaveLength(1);
  });

  it("handles multiple elements in one file", () => {
    expectOutput(
      `const a = <div>first</div>; const b = <span>second</span>;`,
      `import { jsxTemplate } from "${RUNTIME}"; const a = jsxTemplate\`<div>first</div>\`; const b = jsxTemplate\`<span>second</span>\`;`,
    );
  });

  it("handles multiple dynamic attributes", () => {
    expectOutput(
      `const x = <div id={a} class={b}>text</div>;`,
      `import { jsxTemplate, jsxAttr } from "${RUNTIME}"; const x = jsxTemplate\`<div\${jsxAttr("id", a)}\${jsxAttr("class", b)}>text</div>\`;`,
    );
  });

  it("handles ternary with JSX in both branches", () => {
    expectOutput(
      `const x = <div>{cond ? <span>yes</span> : <span>no</span>}</div>;`,
      `import { jsxTemplate } from "${RUNTIME}"; const x = jsxTemplate\`<div>\${cond ? jsxTemplate\`<span>yes</span>\` : jsxTemplate\`<span>no</span>\`}</div>\`;`,
    );
  });

  it("handles array.map with JSX", () => {
    expectOutput(
      `const x = <ul>{items.map(i => <li>{i}</li>)}</ul>;`,
      `import { jsxTemplate, jsxEscape } from "${RUNTIME}"; const x = jsxTemplate\`<ul>\${items.map(i => jsxTemplate\`<li>\${jsxEscape(i)}</li>\`)}</ul>\`;`,
    );
  });

  it("handles mixed static/dynamic children", () => {
    expectOutput(
      `const x = <div>hello {name} world</div>;`,
      `import { jsxTemplate, jsxEscape } from "${RUNTIME}"; const x = jsxTemplate\`<div>hello \${jsxEscape(name)} world</div>\`;`,
    );
  });

  it("handles static style object", () => {
    expectOutput(
      `const x = <div style={{ color: 'red', fontSize: '14px' }}>text</div>;`,
      `import { jsxTemplate, jsxAttr } from "${RUNTIME}"; const x = jsxTemplate\`<div\${jsxAttr("style", { color: 'red', fontSize: '14px' })}>text</div>\`;`,
    );
  });

  it("handles textarea with default text", () => {
    expectOutput(
      `const x = <textarea>default text here</textarea>;`,
      `import { jsxTemplate } from "${RUNTIME}"; const x = jsxTemplate\`<textarea>default text here</textarea>\`;`,
    );
  });

  // -- Flattening (Deno-aligned: static children inline into the parent) --

  it("flattens a native-only fragment into one template", () => {
    expectOutput(
      `const x = <><div>a</div><span>b</span></>;`,
      `import { jsxTemplate } from "${RUNTIME}"; const x = jsxTemplate\`<div>a</div><span>b</span>\`;`,
    );
  });

  it("flattens a fragment with a dynamic child", () => {
    expectOutput(
      `const x = <><div>{name}</div></>;`,
      `import { jsxTemplate, jsxEscape } from "${RUNTIME}"; const x = jsxTemplate\`<div>\${jsxEscape(name)}</div>\`;`,
    );
  });

  it("flattens an empty fragment", () => {
    expectOutput(
      `const x = <></>;`,
      `import { jsxTemplate } from "${RUNTIME}"; const x = jsxTemplate\`\`;`,
    );
  });

  it("flattens a fragment with multiple sibling elements", () => {
    expectOutput(
      `const x = <><div>a</div><div>b</div></>;`,
      `import { jsxTemplate } from "${RUNTIME}"; const x = jsxTemplate\`<div>a</div><div>b</div>\`;`,
    );
  });

  it("flattens nested elements 3 levels deep into one template", () => {
    expectOutput(
      `const x = <div><ul><li>item</li></ul></div>;`,
      `import { jsxTemplate } from "${RUNTIME}"; const x = jsxTemplate\`<div><ul><li>item</li></ul></div>\`;`,
    );
  });

  it("flattens SVG with a self-closing non-void child", () => {
    expectOutput(
      `const x = <svg viewBox="0 0 100 100"><path d="M1 2" /></svg>;`,
      `import { jsxTemplate } from "${RUNTIME}"; const x = jsxTemplate\`<svg viewBox="0 0 100 100"><path d="M1 2"></path></svg>\`;`,
    );
  });

  it("leaves an ineligible child element as a JSX hole", () => {
    const out = transform(`const x = <div><Foo x={1} /></div>;`);
    expect(out).toContain("jsxTemplate`<div>");
    expect(out).toContain("<Foo x={1} />");
  });

  // -- Void elements (no closing tag, no self-closing slash) --

  it("emits no closing tag and no slash for a void element", () => {
    expectOutput(
      `const x = <br />;`,
      `import { jsxTemplate } from "${RUNTIME}"; const x = jsxTemplate\`<br>\`;`,
    );
  });

  it("emits void boolean attributes without a closing tag", () => {
    expectOutput(
      `const x = <input disabled />;`,
      `import { jsxTemplate } from "${RUNTIME}"; const x = jsxTemplate\`<input disabled>\`;`,
    );
  });

  it("emits void elements with multiple boolean attributes", () => {
    expectOutput(
      `const x = <input type="checkbox" checked disabled />;`,
      `import { jsxTemplate } from "${RUNTIME}"; const x = jsxTemplate\`<input type="checkbox" checked disabled>\`;`,
    );
  });

  it("emits a proper closing tag for a self-closing non-void element", () => {
    expectOutput(
      `const x = <div><span /></div>;`,
      `import { jsxTemplate } from "${RUNTIME}"; const x = jsxTemplate\`<div><span></span></div>\`;`,
    );
  });

  // -- Default-mode static attribute handling (Deno-aligned, inline) --

  it("inlines static attributes by default (no jsxAttr)", () => {
    const out = transform(`const x = <div class="x" id="y">z</div>;`);
    expect(out).toContain('<div class="x" id="y">');
    expect(out).not.toContain("jsxAttr");
  });

  it("remaps camelCase attribute names to HTML at compile time (inlined)", () => {
    expect(transform(`const x = <div className="box">y</div>;`)).toContain(
      '<div class="box">y</div>',
    );
    expect(transform(`const x = <label htmlFor="id">y</label>;`)).toContain(
      '<label for="id">y</label>',
    );
    expect(transform(`const x = <div tabIndex="0">y</div>;`)).toContain(
      '<div tabindex="0">y</div>',
    );
    expect(transform(`const x = <div className="box">y</div>;`)).not.toContain(
      "jsxAttr",
    );
  });

  it("remaps camelCase boolean attribute names too", () => {
    expect(transform(`const x = <input readOnly />;`)).toContain(
      "jsxTemplate`<input readonly>`",
    );
  });

  it("lowercases event-handler names and inlines them", () => {
    expect(transform(`const x = <button onClick="go()">y</button>;`)).toContain(
      '<button onclick="go()">y</button>',
    );
  });

  it("escapes static literal attribute values", () => {
    expect(transform(`const x = <div title='a"b'>y</div>;`)).toContain(
      'title="a&quot;b"',
    );
    expect(transform(`const x = <div data-x="a&b<c">y</div>;`)).toContain(
      'data-x="a&amp;b&lt;c"',
    );
  });

  it("inlines URL and style attributes verbatim by default (trusted)", () => {
    expect(transform(`const x = <a href="javascript:alert(1)">y</a>;`)).toContain(
      '<a href="javascript:alert(1)">y</a>',
    );
    expect(transform(`const x = <div style="color:red">y</div>;`)).toContain(
      '<div style="color:red">y</div>',
    );
    expect(transform(`const x = <img srcSet="a.png 1x" />;`)).toContain(
      '<img srcset="a.png 1x">',
    );
  });

  // -- Whitespace collapse (standard JSX rules) --

  it("collapses JSX whitespace between elements", () => {
    const out = transform(
      `const x = (\n  <ul>\n    <li>one</li>\n    <li>two</li>\n  </ul>\n);`,
    );
    expect(out).toContain("jsxTemplate`<ul><li>one</li><li>two</li></ul>`");
  });

  it("preserves significant inline whitespace", () => {
    const out = transform(`const x = <p>hello <b>world</b></p>;`);
    expect(out).toContain("jsxTemplate`<p>hello <b>world</b></p>`");
  });

  // -- Eligibility guards --

  it("skips precompile for element with spread attributes", () => {
    const source = `const x = <div {...props}>text</div>;`;
    const result = transform(source);
    expect(result).not.toContain("jsxTemplate");
    expect(result).toContain("...props");
  });

  it("skips precompile for element with dangerouslySetInnerHTML", () => {
    const source = `const x = <div dangerouslySetInnerHTML={{ __html: "<b>raw</b>" }} />;`;
    const result = transform(source);
    expect(result).not.toContain("jsxTemplate");
    expect(result).toContain("dangerouslySetInnerHTML");
  });

  it("handles form elements", () => {
    const source = `<form action="/submit" method="post"><button type="submit">Send</button></form>;`;
    const result = transform(`const x = ${source}`);
    expect(result).toContain('action="/submit"');
    expect(result).toContain('method="post"');
    expect(result).toContain('type="submit"');
    expect(result).toContain("jsxTemplate");
  });

  // -- Secure mode (sanitize static attributes at build time via runtime jsxAttr) --

  describe("secure mode", () => {
    it("sanitizes static URL attributes at build time (output stays static)", () => {
      const out = transformSecure(`const x = <a href="javascript:alert(1)">y</a>;`);
      expect(out).toContain('<a href="#blocked">y</a>');
      expect(out).not.toContain("jsxAttr");
      expect(out).not.toContain("javascript:");
    });

    it("keeps safe URLs intact and still remaps names", () => {
      const out = transformSecure(`const x = <a href="/path" className="link">y</a>;`);
      expect(out).toContain('<a href="/path" class="link">y</a>');
    });

    it("drops unsafe CSS via the runtime's style handling", () => {
      const out = transformSecure(
        `const x = <div style="background:url(javascript:alert(1))">y</div>;`,
      );
      expect(out).not.toContain("javascript:");
    });

    it("escapes static values through the runtime", () => {
      const out = transformSecure(`const x = <div title='a"b'>y</div>;`);
      expect(out).toContain("a&quot;b");
    });
  });
});
