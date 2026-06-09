import {
  collapseJsxWhitespace,
  escapeAttr,
  hasSpreadOrInnerHTML,
  isEventHandlerName,
  isLowercaseTag,
  isVoidElement,
  remapAttrName,
  RUNTIME_SOURCE,
} from "@cjean-fr/precompile-core";
import type { PluginObj, PluginPass, Visitor } from "@babel/core";
import type {
  JSXAttribute,
  JSXElement,
  JSXFragment,
  Node,
  Expression,
  Statement,
} from "@babel/types";
import type * as BabelTypes from "@babel/types";

interface PluginState extends PluginPass {
  used: Set<string>;
}

/** Build-time attribute renderer (the runtime's own `jsxAttr`), used by secure mode. */
export type RenderAttr = (name: string, value: unknown) => string | Promise<string>;

export interface BabelPluginConfig {
  runtimeSource?: string;
  /**
   * Deno-aligned by default: static attributes are TRUSTED and inlined verbatim
   * (only name remap + event-name lowercasing + HTML escaping). With
   * `secure: true` AND a `renderAttr` (the runtime's `jsxAttr`), static
   * attributes are sanitized at BUILD time so output stays fully static yet
   * `href="javascript:…"` becomes `href="#blocked"`, unsafe CSS is dropped, etc.
   * `renderAttr` must be supplied programmatically — it cannot travel through a
   * serialized babel config.
   */
  secure?: boolean;
  renderAttr?: RenderAttr;
}

function attrNameToStr(name: JSXAttribute["name"]): string {
  if (name.type === "JSXNamespacedName") return `${name.namespace.name}:${name.name.name}`;
  return name.name;
}

export default function (
  { types: t }: { types: typeof import("@babel/types") },
  options: BabelPluginConfig = {},
): PluginObj<PluginState> {
  const rtSource = options.runtimeSource ?? RUNTIME_SOURCE;
  // Secure mode delegates static-attribute serialization to the runtime's own
  // jsxAttr at build time. Babel transforms are synchronous, so the renderer
  // must be passed in (the vite plugin loads it via dynamic import); a
  // serialized babel config cannot carry a function.
  const renderAttr: RenderAttr | null = options.secure
    ? options.renderAttr ?? null
    : null;

  if (options.secure && !options.renderAttr) {
    console.warn(
      "[babel-plugin-precompile] secure mode requires a `renderAttr` " +
        "(the runtime's jsxAttr); static attributes will be inlined without " +
        "sanitization.",
    );
  }

  function addUsed(state: PluginState, name: string): void {
    state.used.add(name);
  }

  function isTagEligible(name: Node): boolean {
    if (name.type === "JSXIdentifier") return isLowercaseTag(name.name);
    return false;
  }

  function areAttrsEligible(attrs: JSXElement["openingElement"]["attributes"]): boolean {
    return !hasSpreadOrInnerHTML(
      attrs.map((a) => {
        if (a.type === "JSXSpreadAttribute") return { kind: "spread" as const };
        return { kind: "attribute" as const, name: attrNameToStr(a.name) };
      }),
    );
  }

  function isEligibleElement(el: JSXElement): boolean {
    return (
      isTagEligible(el.openingElement.name) &&
      areAttrsEligible(el.openingElement.attributes)
    );
  }

  function templateLiteral(strings: string[], exprs: Expression[]): BabelTypes.TemplateLiteral {
    const quasis = strings.map((str, i) =>
      t.templateElement(
        { raw: str, cooked: str },
        i === strings.length - 1,
      ),
    );
    return t.templateLiteral(quasis, exprs);
  }

  function jsxTemplate(parts: string[], exprs: Expression[]): Expression {
    return t.taggedTemplateExpression(
      t.identifier("jsxTemplate"),
      templateLiteral(parts, exprs),
    );
  }

  function appendStatic(strings: string[], text: string): void {
    const i = strings.length - 1;
    strings[i] = (strings[i] ?? "") + text;
  }

  function addDynamic(strings: string[], exprs: Expression[], expr: Expression): void {
    exprs.push(expr);
    strings.push("");
  }

  // -- Attribute emission --

  /**
   * Emit a static attribute. Default mode inlines it Deno-aligned (name remap,
   * event-name lowercasing, value escaping). Secure mode runs the name+value
   * through the runtime's jsxAttr at build time so the same sanitization the
   * runtime would apply happens now, keeping the output static.
   */
  function emitStaticAttr(rawName: string, value: string | true, strings: string[]): void {
    if (renderAttr) {
      const rendered = renderAttr(rawName, value);
      if (typeof rendered === "string") {
        if (rendered) appendStatic(strings, ` ${rendered}`);
        return;
      }
      // Async runtime returned a Promise; fall through to the inline path.
    }
    let name = remapAttrName(rawName);
    if (isEventHandlerName(name)) name = name.toLowerCase();
    if (value === true) {
      appendStatic(strings, ` ${name}`);
    } else {
      appendStatic(strings, ` ${name}="${escapeAttr(value)}"`);
    }
  }

  function emitOpening(
    tag: string,
    attrs: JSXElement["openingElement"]["attributes"],
    strings: string[],
    exprs: Expression[],
    state: PluginState,
  ): void {
    appendStatic(strings, `<${tag}`);

    for (const attr of attrs) {
      // Spread / dangerouslySetInnerHTML make an element ineligible, so the
      // attrs reaching here are plain JSXAttribute nodes.
      if (attr.type !== "JSXAttribute") continue;
      const name = attrNameToStr(attr.name);
      const val = attr.value;

      if (val === null || val === undefined) {
        emitStaticAttr(name, true, strings);
      } else if (val.type === "StringLiteral") {
        emitStaticAttr(name, val.value, strings);
      } else if (val.type === "JSXExpressionContainer" && val.expression.type !== "JSXEmptyExpression") {
        addUsed(state, "jsxAttr");
        addDynamic(strings, exprs, t.callExpression(
          t.identifier("jsxAttr"),
          [t.stringLiteral(name), val.expression as Expression],
        ));
      }
    }

    appendStatic(strings, ">");
  }

  // -- Children --

  function hasJsxChild(node: Node): boolean {
    if (
      node.type === "JSXElement" ||
      node.type === "JSXFragment" ||
      node.type === "JSXText"
    ) return true;
    if (node.type === "ConditionalExpression") {
      return hasJsxChild(node.test) || hasJsxChild(node.consequent) || hasJsxChild(node.alternate);
    }
    if (node.type === "LogicalExpression") {
      return hasJsxChild(node.left) || hasJsxChild(node.right);
    }
    if (node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression") {
      return hasJsxChild(node.body);
    }
    if (node.type === "CallExpression") {
      return node.arguments.some((a) => hasJsxChild(a));
    }
    return false;
  }

  /** Flatten an eligible element's HTML directly into the current template. */
  function emitElementInline(
    el: JSXElement,
    strings: string[],
    exprs: Expression[],
    state: PluginState,
  ): void {
    const tag = (el.openingElement.name as BabelTypes.JSXIdentifier).name;
    emitOpening(tag, el.openingElement.attributes, strings, exprs, state);
    // Void elements have no children and no closing tag — and no self-closing
    // slash, matching the runtime renderer.
    if (!isVoidElement(tag)) {
      emitChildren(el.children, strings, exprs, state);
      appendStatic(strings, `</${tag}>`);
    }
  }

  function emitChildren(
    children: JSXElement["children"],
    strings: string[],
    exprs: Expression[],
    state: PluginState,
  ): void {
    for (const child of children) {
      if (child.type === "JSXText") {
        appendStatic(strings, collapseJsxWhitespace(child.value));
      } else if (child.type === "JSXExpressionContainer") {
        const inner = child.expression;
        if (inner.type === "JSXEmptyExpression") continue; // {/* comment */}
        if (hasJsxChild(inner)) {
          addDynamic(strings, exprs, deepVisitJsx(inner, state));
        } else {
          addUsed(state, "jsxEscape");
          addDynamic(strings, exprs, t.callExpression(
            t.identifier("jsxEscape"),
            [inner as Expression],
          ));
        }
      } else if (child.type === "JSXElement" && isEligibleElement(child)) {
        // Static child element: flatten into this template (Deno-aligned).
        emitElementInline(child, strings, exprs, state);
      } else if (child.type === "JSXElement") {
        // Component / spread / innerHTML child: leave it as a JSX hole for the
        // downstream JSX transform.
        addDynamic(strings, exprs, child as Expression);
      } else if (child.type === "JSXFragment") {
        emitChildren([...child.children], strings, exprs, state);
      }
    }
  }

  // -- Transforms --

  function transformElement(el: JSXElement, state: PluginState): Expression {
    addUsed(state, "jsxTemplate");
    const strings: string[] = [""];
    const exprs: Expression[] = [];
    emitElementInline(el, strings, exprs, state);
    return jsxTemplate(strings, exprs);
  }

  function transformFragment(frag: JSXFragment, state: PluginState): Expression {
    addUsed(state, "jsxTemplate");
    const strings: string[] = [""];
    const exprs: Expression[] = [];
    emitChildren([...frag.children], strings, exprs, state);
    return jsxTemplate(strings, exprs);
  }

  function deepVisitJsx(node: Node, state: PluginState): Expression {
    if (node.type === "JSXFragment") {
      return transformFragment(node, state);
    }
    if (node.type === "JSXElement" && isEligibleElement(node)) {
      return transformElement(node, state);
    }
    if (node.type === "ConditionalExpression") {
      return t.conditionalExpression(
        node.test,
        deepVisitJsx(node.consequent, state),
        deepVisitJsx(node.alternate, state),
      );
    }
    if (node.type === "LogicalExpression") {
      return t.logicalExpression(
        node.operator,
        deepVisitJsx(node.left, state),
        deepVisitJsx(node.right, state),
      );
    }
    if (node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression") {
      return t.arrowFunctionExpression(
        node.params,
        deepVisitJsx(node.body, state),
      );
    }
    if (node.type === "CallExpression") {
      return t.callExpression(
        deepVisitJsx(node.callee, state),
        node.arguments.map((a) => deepVisitJsx(a, state)),
      );
    }
    return node as Expression;
  }

  // -- Import management --

  function ensureImport(path: any, state: PluginState): void {
    const body = path.node.body as Statement[];
    if (state.used.size === 0) return;
    const helpers = [...state.used];

    const existingIdx = body.findIndex(
      (s) =>
        s.type === "ImportDeclaration" &&
        (s as BabelTypes.ImportDeclaration).source.value === rtSource,
    );

    if (existingIdx !== -1) {
      const decl = body[existingIdx] as BabelTypes.ImportDeclaration;
      const existing = new Set(
        decl.specifiers.map((s) => {
          if (s.type === "ImportSpecifier") {
            return s.imported.type === "Identifier" ? s.imported.name : null;
          }
          return null;
        }).filter(Boolean),
      );
      const missing = helpers.filter((h) => !existing.has(h));
      if (missing.length === 0) return;

      decl.specifiers.push(
        ...missing.map((name) =>
          t.importSpecifier(t.identifier(name), t.identifier(name)),
        ),
      );
    } else {
      body.unshift(
        t.importDeclaration(
          helpers.map((name) =>
            t.importSpecifier(t.identifier(name), t.identifier(name)),
          ),
          t.stringLiteral(rtSource),
        ),
      );
    }
  }

  const visitor: Visitor<PluginState> = {
    Program: {
      enter(_path, state) {
        state.used = new Set<string>();
      },
      exit(path, state) {
        ensureImport(path, state);
      },
    },

    JSXElement(path, state) {
      const node = path.node;
      if (isEligibleElement(node)) {
        path.replaceWith(transformElement(node, state));
      }
    },

    JSXFragment(path, state) {
      path.replaceWith(transformFragment(path.node, state));
    },
  };

  return { visitor };
}
