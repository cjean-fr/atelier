import { parseSync } from "oxc-parser";
import type {
  Expression,
  JSXAttribute,
  JSXAttributeItem,
  JSXChild,
  JSXElement,
  JSXFragment,
  JSXIdentifier,
  Program,
} from "@oxc-project/types";
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

export interface PluginConfig {
  runtimeSource?: string;
  /**
   * When `true`, static attributes are sanitized at build time by running them
   * through the runtime's own attribute serializer (`renderAttr`) instead of
   * being inlined verbatim. This mirrors what the runtime does for dynamic
   * values (URL-scheme blocking, unsafe-CSS dropping, name remapping). The
   * default (`false`) matches Deno's precompile: static attributes are trusted
   * and inlined, keeping them fully static. The Vite plugin wires `renderAttr`
   * up automatically from `runtimeSource`.
   */
  secure?: boolean;
}

/**
 * Build-time attribute serializer — the runtime's `jsxAttr`. Injected by the
 * Vite plugin (loaded from `runtimeSource`) when `secure` is on, so the
 * transformer itself stays dependency-free and synchronous. For a static
 * string/boolean value `jsxAttr` always returns synchronously.
 */
export type RenderAttr = (name: string, value: unknown) => string | Promise<string>;

export interface TransformResult {
  code: string;
  map?: null;
}

/**
 * Per-file transform state shared by every emit helper.
 *
 * `source` is the original module text (used for span slicing); `used`
 * accumulates the set of runtime helpers the rewritten code references so the
 * matching import can be injected once at the end.
 */
interface Ctx {
  source: string;
  used: Set<string>;
  /** Present only in secure mode; sanitizes static attributes at build time. */
  renderAttr: RenderAttr | null;
}

/** Minimal structural view of an oxc AST node for generic traversal. */
interface AnyNode {
  type: string;
  start: number;
  end: number;
  [key: string]: unknown;
}

interface Replacement {
  start: number;
  end: number;
  text: string;
}

export default function precompileTransform(
  code: string,
  id: string,
  config?: PluginConfig,
  renderAttr?: RenderAttr,
): TransformResult | null {
  const rtSource = config?.runtimeSource ?? RUNTIME_SOURCE;
  const lang = id.endsWith(".tsx") ? "tsx" : "jsx";

  const result = parseSync(id, code, {
    lang,
    sourceType: "unambiguous",
    range: true,
    preserveParens: false,
  });

  if (result.errors.length > 0) {
    const isCritical = result.errors.some(
      (e: { severity: string }) => e.severity === "Error",
    );
    if (isCritical) return null;
  }

  const program = result.program as Program;
  const ctx: Ctx = {
    source: code,
    used: new Set<string>(),
    renderAttr: config?.secure ? renderAttr ?? null : null,
  };
  const replacements: Replacement[] = [];

  for (const stmt of program.body) {
    collectNode(stmt as unknown as AnyNode, ctx, replacements);
  }

  if (replacements.length === 0) return null;

  let outCode = code;
  for (let i = replacements.length - 1; i >= 0; i--) {
    const r = replacements[i];
    if (!r) continue;
    outCode = outCode.slice(0, r.start) + r.text + outCode.slice(r.end);
  }

  outCode = ensureRuntimeImport(outCode, rtSource, [...ctx.used]);

  if (outCode === code) return null;
  return { code: outCode };
}

/**
 * Walk the tree looking for top-level precompilable JSX. When an eligible
 * element/fragment is found it is replaced wholesale (children are inlined by
 * `transformElement`/`transformFragment`), so we do NOT descend into it — that
 * would produce overlapping replacements. Anything else is traversed so nested
 * host elements (e.g. inside a component) are still picked up.
 */
function collectNode(
  node: AnyNode,
  ctx: Ctx,
  replacements: Replacement[],
): void {
  if (node.type === "JSXElement") {
    const el = node as unknown as JSXElement;
    if (isEligibleElement(el)) {
      replacements.push({
        start: el.start,
        end: el.end,
        text: transformElement(el, ctx),
      });
      return;
    }
  } else if (node.type === "JSXFragment") {
    const frag = node as unknown as JSXFragment;
    replacements.push({
      start: frag.start,
      end: frag.end,
      text: transformFragment(frag, ctx),
    });
    return;
  }

  for (const key of VISITOR_KEYS[node.type] ?? []) {
    const val = node[key];
    if (Array.isArray(val)) {
      for (const item of val) {
        if (item && typeof item === "object" && "type" in item) {
          collectNode(item as AnyNode, ctx, replacements);
        }
      }
    } else if (val && typeof val === "object" && "type" in val) {
      collectNode(val as AnyNode, ctx, replacements);
    }
  }
}

function isEligibleElement(node: JSXElement): boolean {
  const name = node.openingElement.name;
  if (name.type !== "JSXIdentifier") return false;
  if (!isLowercaseTag(name.name)) return false;
  return !hasSpreadOrInnerHTML(
    node.openingElement.attributes.map((a) => {
      if (a.type === "JSXSpreadAttribute") return { kind: "spread" as const };
      return { kind: "attribute" as const, name: attrName(a) };
    }),
  );
}

function attrName(attr: JSXAttribute): string {
  if (attr.name.type === "JSXIdentifier") return attr.name.name;
  return `${attr.name.namespace.name}:${attr.name.name}`;
}

function transformElement(node: JSXElement, ctx: Ctx): string {
  ctx.used.add("jsxTemplate");
  const tag = (node.openingElement.name as JSXIdentifier).name;
  const parts: string[] = [""];
  const exprs: string[] = [];

  emitOpening(tag, node.openingElement.attributes, parts, exprs, ctx);
  if (!isVoidElement(tag)) {
    emitChildren(node.children, parts, exprs, ctx);
    appendStatic(parts, `</${tag}>`);
  }

  return buildTaggedTemplate(parts, exprs);
}

function transformFragment(node: JSXFragment, ctx: Ctx): string {
  ctx.used.add("jsxTemplate");
  const parts: string[] = [""];
  const exprs: string[] = [];
  emitChildren(node.children, parts, exprs, ctx);
  return buildTaggedTemplate(parts, exprs);
}

function emitOpening(
  tag: string,
  attrs: JSXAttributeItem[],
  parts: string[],
  exprs: string[],
  ctx: Ctx,
  closingBracket = ">",
): void {
  appendStatic(parts, `<${tag}`);

  for (const attr of attrs) {
    if (attr.type === "JSXAttribute") {
      emitAttribute(attr, parts, exprs, ctx);
    } else {
      ctx.used.add("jsxAttr");
      const exprWithJsx = processExpressionForJsx(attr.argument, ctx);
      addDynamic(parts, exprs, `jsxAttr("...spread", ${exprWithJsx})`);
    }
  }

  appendStatic(parts, closingBracket);
}

function emitAttribute(
  attr: JSXAttribute,
  parts: string[],
  exprs: string[],
  ctx: Ctx,
): void {
  const rawName = attrName(attr);
  const init = attr.value;

  // Boolean attribute (no value): <input disabled />, <input readOnly />.
  if (init === null) {
    emitStaticAttr(rawName, true, parts, ctx);
    return;
  }

  // Static string literal: class="x", title="hi".
  if (init.type === "Literal") {
    emitStaticAttr(rawName, init.value, parts, ctx);
    return;
  }

  // Dynamic value: always handled by the runtime, which does its own name
  // remapping, sanitization, and drop-if-unsafe logic.
  if (init.type === "JSXExpressionContainer") {
    const expr = init.expression;
    if (expr.type !== "JSXEmptyExpression") {
      ctx.used.add("jsxAttr");
      const exprText = processExpressionForJsx(expr, ctx);
      addDynamic(parts, exprs, `jsxAttr(${JSON.stringify(rawName)}, ${exprText})`);
      return;
    }
    appendStatic(parts, ` ${remapAttrName(rawName)}=""`);
  }
}

/**
 * Emit a statically-known attribute (a boolean flag or a string literal).
 *
 * Default (Deno-aligned): static attributes are trusted and inlined. The name
 * is remapped to its HTML form (`className` → `class`, `tabIndex` →
 * `tabindex`), event-handler names are lowercased (`onClick` → `onclick`), and
 * the value is HTML-escaped. No value sanitization is applied — that is the
 * runtime's job for *dynamic* values, which always go through `jsxAttr`.
 *
 * Secure mode (`ctx.renderAttr`): the value is run through the runtime's own
 * `jsxAttr` at build time and the serialized result is inlined, so the same
 * URL/CSS/name handling the runtime applies to dynamic values also applies to
 * static ones (`href="javascript:…"` → `href="#blocked"`, unsafe `style`
 * dropped, …) — while the output stays fully static.
 */
function emitStaticAttr(
  rawName: string,
  value: string | true,
  parts: string[],
  ctx: Ctx,
): void {
  if (ctx.renderAttr) {
    const rendered = ctx.renderAttr(rawName, value);
    if (typeof rendered === "string") {
      if (rendered) appendStatic(parts, ` ${rendered}`);
      return;
    }
    // A Promise should never occur for a static string/boolean value; fall
    // through to the default inline path defensively.
  }

  let name = remapAttrName(rawName);
  if (isEventHandlerName(name)) name = name.toLowerCase();

  if (value === true) {
    appendStatic(parts, ` ${name}`);
  } else {
    appendStatic(parts, ` ${name}="${escapeAttr(value)}"`);
  }
}

function emitChildren(
  children: JSXChild[],
  parts: string[],
  exprs: string[],
  ctx: Ctx,
): void {
  for (const child of children) {
    if (child.type === "JSXText") {
      appendStatic(parts, collapseJsxWhitespace(child.value));
    } else if (child.type === "JSXExpressionContainer") {
      if (child.expression.type !== "JSXEmptyExpression") {
        const inner = child.expression;
        const exprText = processExpressionForJsx(inner, ctx);

        if (hasJsxNode(inner as unknown as AnyNode)) {
          addDynamic(parts, exprs, exprText);
        } else {
          ctx.used.add("jsxEscape");
          addDynamic(parts, exprs, `jsxEscape(${exprText})`);
        }
      }
    } else if (child.type === "JSXElement") {
      if (isEligibleElement(child)) {
        const tag = (child.openingElement.name as JSXIdentifier).name;
        emitOpening(tag, child.openingElement.attributes, parts, exprs, ctx);
        if (!isVoidElement(tag)) {
          emitChildren(child.children, parts, exprs, ctx);
          appendStatic(parts, `</${tag}>`);
        }
      } else {
        const replaced = processExpressionForJsx(
          child as unknown as Expression,
          ctx,
        );
        addDynamic(parts, exprs, replaced);
      }
    } else if (child.type === "JSXFragment") {
      emitChildren(child.children, parts, exprs, ctx);
    } else if (child.type === "JSXSpreadChild") {
      ctx.used.add("jsxEscape");
      const exprText = ctx.source.slice(
        child.expression.start,
        child.expression.end,
      );
      addDynamic(parts, exprs, `jsxEscape(${exprText})`);
    }
  }
}

function processExpressionForJsx(expr: Expression, ctx: Ctx): string {
  const text = ctx.source.slice(expr.start, expr.end);
  return replaceNestedJsx(expr, text, ctx);
}

function replaceNestedJsx(node: Expression, text: string, ctx: Ctx): string {
  const nested: Replacement[] = [];
  findNestedJsx(node as unknown as AnyNode, nested, ctx);
  if (nested.length === 0) return text;

  let result = text;
  for (let i = nested.length - 1; i >= 0; i--) {
    const n = nested[i];
    if (!n) continue;
    const localStart = n.start - node.start;
    const localEnd = n.end - node.start;
    result = result.slice(0, localStart) + n.text + result.slice(localEnd);
  }
  return result;
}

function findNestedJsx(
  node: AnyNode,
  out: Replacement[],
  ctx: Ctx,
): void {
  if (node.type === "JSXElement") {
    const el = node as unknown as JSXElement;
    if (isEligibleElement(el)) {
      out.push({
        start: el.start,
        end: el.end,
        text: transformElement(el, ctx),
      });
      return;
    }
  } else if (node.type === "JSXFragment") {
    const frag = node as unknown as JSXFragment;
    out.push({
      start: frag.start,
      end: frag.end,
      text: transformFragment(frag, ctx),
    });
    return;
  }

  for (const key of VISITOR_KEYS[node.type] ?? []) {
    const val = node[key];
    if (Array.isArray(val)) {
      for (const item of val) {
        if (item && typeof item === "object" && "type" in item) {
          findNestedJsx(item as AnyNode, out, ctx);
        }
      }
    } else if (val && typeof val === "object" && "type" in val) {
      findNestedJsx(val as AnyNode, out, ctx);
    }
  }
}

function hasJsxNode(node: AnyNode): boolean {
  if (
    node.type === "JSXElement" ||
    node.type === "JSXFragment" ||
    node.type === "JSXSpreadChild"
  ) {
    return true;
  }

  for (const key of VISITOR_KEYS[node.type] ?? []) {
    const val = node[key];
    if (Array.isArray(val)) {
      for (const item of val) {
        if (
          item &&
          typeof item === "object" &&
          "type" in item &&
          hasJsxNode(item as AnyNode)
        ) {
          return true;
        }
      }
    } else if (val && typeof val === "object" && "type" in val) {
      if (hasJsxNode(val as AnyNode)) return true;
    }
  }
  return false;
}

function appendStatic(parts: string[], str: string): void {
  parts[parts.length - 1] = (parts[parts.length - 1] ?? "") + str;
}

function addDynamic(parts: string[], exprs: string[], expr: string): void {
  exprs.push(expr);
  parts.push("");
}

function buildTaggedTemplate(parts: string[], exprs: string[]): string {
  if (exprs.length === 0) {
    return `jsxTemplate\`${parts[0] ?? ""}\``;
  }

  let result = `jsxTemplate\`${parts[0] ?? ""}`;
  for (let i = 0; i < exprs.length; i++) {
    result += `\${${exprs[i] ?? ""}}${parts[i + 1] ?? ""}`;
  }
  result += "`";
  return result;
}

function ensureRuntimeImport(
  code: string,
  rtSource: string,
  helpers: string[],
): string {
  if (helpers.length === 0) return code;

  const importRegex = new RegExp(
    `import\\s*\\{[^}]*\\}\\s*from\\s*["']${escapeRegex(rtSource)}["'];?`,
  );

  const existingMatch = code.match(importRegex);
  if (existingMatch) {
    const importLine = existingMatch[0];
    const existingHelpers = new Set<string>();
    const specifierRegex = /(\w+)(?:\s+as\s+\w+)?(?:\s*,\s*|\s*})/g;
    let m: RegExpExecArray | null;
    while ((m = specifierRegex.exec(importLine)) !== null) {
      if (m[1] !== undefined) existingHelpers.add(m[1]);
    }

    const missing = helpers.filter((h) => !existingHelpers.has(h));
    if (missing.length === 0) return code;

    const newImportLine = importLine.replace(/\{([^}]*)\}/, (_, inner: string) => {
      const existing = inner
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
      const all = [...new Set([...existing, ...missing])];
      return `{ ${all.join(", ")} }`;
    });

    return code.replace(importLine, newImportLine);
  }

  const importLine = `import { ${helpers.join(", ")} } from "${rtSource}";\n`;
  const lines = code.split("\n");
  const firstRealIndex = lines.findIndex(
    (l) =>
      l.trim() !== "" &&
      !l.trim().startsWith("//") &&
      !l.trim().startsWith("/*"),
  );
  if (firstRealIndex >= 0) {
    lines.splice(firstRealIndex, 0, importLine);
  } else {
    lines.unshift(importLine);
  }
  return lines.join("\n");
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const VISITOR_KEYS: Record<string, string[]> = {
  Program: ["body"],
  ExpressionStatement: ["expression"],
  VariableDeclaration: ["declarations"],
  VariableDeclarator: ["id", "init"],
  FunctionDeclaration: ["id", "params", "body"],
  FunctionExpression: ["id", "params", "body"],
  ArrowFunctionExpression: ["params", "body"],
  CallExpression: ["callee", "arguments"],
  ReturnStatement: ["argument"],
  BlockStatement: ["body"],
  IfStatement: ["test", "consequent", "alternate"],
  ConditionalExpression: ["test", "consequent", "alternate"],
  LogicalExpression: ["left", "right"],
  BinaryExpression: ["left", "right"],
  UnaryExpression: ["argument"],
  MemberExpression: ["object", "property"],
  Identifier: [],
  IdentifierReference: [],
  BindingIdentifier: [],
  LabelIdentifier: [],
  StringLiteral: [],
  NumericLiteral: [],
  BooleanLiteral: [],
  NullLiteral: [],
  TemplateLiteral: ["expressions", "quasis"],
  TaggedTemplateExpression: ["tag", "quasi"],
  TemplateElement: [],
  ArrayExpression: ["elements"],
  ObjectExpression: ["properties"],
  ObjectProperty: ["key", "value"],
  PropertyDefinition: ["key", "value"],
  MethodDefinition: ["key", "value"],
  ArrowFunction: ["params", "body"],
  JSXElement: ["openingElement", "children", "closingElement"],
  JSXOpeningElement: ["name", "attributes"],
  JSXClosingElement: ["name"],
  JSXFragment: ["openingFragment", "children", "closingFragment"],
  JSXText: [],
  JSXExpressionContainer: ["expression"],
  JSXSpreadChild: ["expression"],
  JSXAttribute: ["name", "value"],
  JSXSpreadAttribute: ["argument"],
  JSXIdentifier: [],
  JSXNamespacedName: ["namespace", "name"],
  JSXMemberExpression: ["object", "property"],
  JSXEmptyExpression: [],
  ExportDefaultDeclaration: ["declaration"],
  ExportNamedDeclaration: ["declaration", "specifiers", "source"],
  ImportDeclaration: ["specifiers", "source"],
  ImportSpecifier: ["imported", "local"],
  ImportDefaultSpecifier: ["local"],
  ImportNamespaceSpecifier: ["local"],
  ClassDeclaration: ["id", "body"],
  ClassExpression: ["id", "body"],
  ClassBody: ["body"],
  SpreadElement: ["argument"],
  YieldExpression: ["argument"],
  AwaitExpression: ["argument"],
  SequenceExpression: ["expressions"],
  NewExpression: ["callee", "arguments"],
  AssignmentExpression: ["left", "right"],
  AssignmentPattern: ["left", "right"],
  ChainExpression: ["expression"],
  ParenthesizedExpression: ["expression"],
  ImportExpression: ["source", "arguments"],
  MetaProperty: ["meta", "property"],
  ThisExpression: [],
  Super: [],
  ForStatement: ["init", "test", "update", "body"],
  ForInStatement: ["left", "right", "body"],
  ForOfStatement: ["left", "right", "body"],
  WhileStatement: ["test", "body"],
  DoWhileStatement: ["test", "body"],
  SwitchStatement: ["discriminant", "cases"],
  SwitchCase: ["test", "consequent"],
  TryStatement: ["block", "handler", "finalizer"],
  CatchClause: ["param", "body"],
  ThrowStatement: ["argument"],
  LabeledStatement: ["label", "body"],
  BreakStatement: ["label"],
  ContinueStatement: ["label"],
  DebuggerStatement: [],
  EmptyStatement: [],
  WithStatement: ["object", "body"],
  TSAsExpression: ["expression", "typeAnnotation"],
  TSSatisfiesExpression: ["expression", "typeAnnotation"],
  TSTypeAssertion: ["expression", "typeAnnotation"],
  TSNonNullExpression: ["expression"],
  TSInstantiationExpression: ["expression", "typeArguments"],
  TSImportType: ["parameter", "qualifier", "typeArguments"],
  TSModuleDeclaration: ["id", "body"],
  TSModuleBlock: ["body"],
  TSTypeAliasDeclaration: ["id", "typeAnnotation"],
  TSInterfaceDeclaration: ["id", "body"],
  TSInterfaceBody: ["body"],
  TSEnumDeclaration: ["id", "members"],
  TSEnumMember: ["id", "initializer"],
  TSTypeReference: ["typeName", "typeArguments"],
  TSFunctionType: ["params", "returnType"],
  TSTypeParameterInstantiation: ["params"],
  TSTypeParameter: ["name", "constraint", "default"],
  TSTypeParameterDeclaration: ["params"],
  TSUnionType: ["types"],
  TSIntersectionType: ["types"],
  TSArrayType: ["elementType"],
  TSTupleType: ["elementTypes"],
  TSLiteralType: ["literal"],
  TSMappedType: ["typeParameter", "nameType", "typeAnnotation"],
  TSConditionalType: ["checkType", "extendsType", "trueType", "falseType"],
  TSIndexedAccessType: ["objectType", "indexType"],
  TSInferType: ["typeParameter"],
  TSQualifiedName: ["left", "right"],
  TSTypeAnnotation: ["typeAnnotation"],
  TSTypePredicate: ["parameterName", "typeAnnotation"],
  TSTypeQuery: ["exprName"],
  TSTypeOperator: ["typeAnnotation"],
  TSRestType: ["typeAnnotation"],
  TSOptionalType: ["typeAnnotation"],
  TSNamedTupleMember: ["label", "elementType"],
  TSExportAssignment: ["expression"],
  TSNamespaceExportDeclaration: ["id"],
  TSExternalModuleReference: ["expression"],
  TSIndexSignature: ["parameters", "typeAnnotation"],
  TSPropertySignature: ["key", "typeAnnotation"],
  TSMethodSignature: ["key", "params", "returnType"],
  TSCallSignatureDeclaration: ["params", "returnType"],
  TSConstructSignatureDeclaration: ["params", "returnType"],
  TSClassImplements: ["expression", "typeArguments"],
  TSHeritageClause: ["types"],
  TSAbstractPropertyDefinition: ["key", "value", "typeAnnotation"],
  TSAbstractMethodDefinition: ["key", "value"],
  TSParameterProperty: ["parameter"],
  Decorator: ["expression"],
  Property: ["key", "value"],
  RestElement: ["argument"],
  StaticBlock: ["body"],
  V8IntrinsicExpression: ["arguments"],
  JSDocUnknownType: [],
  JSDocNonNullableType: ["typeAnnotation"],
  JSDocNullableType: ["typeAnnotation"],
};
