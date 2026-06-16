# Refactor — `jsx-flow` → `@cjean-fr/jsx-document`

> Plan de refactor. Recentre le package sur l'**orchestration de document** (le besoin réel
> de `jsx-string-doc`) et redescend le streaming au rang d'add-on opt-in.
> Décisions actées dans la discussion de design — voir « Modèle » ci-dessous.

> **🧊 STATUT : GELÉ (2026-06-17).** Plan **non retenu pour l'instant** — Option A adoptée à la place :
> le besoin réel (`build.tsx`) est couvert par un helper local
> `apps/jsx-string-doc/docs-src/lib/render-document.ts` (`renderDocument` + `composeTransforms`),
> et **`jsx-flow` reste inchangé** (streaming `<Defer>`/`renderToHtmlStream` intact).
> Ne ressortir ce plan **que** si un vrai consommateur OOB (`Slot`/`Fill`) ou streaming apparaît.
> Raison du gel : redesign cassant sur-dimensionné pour une lib perso 0.2 à un seul consommateur,
> lui-même non représentatif (un site SSG n'a structurellement pas besoin de streaming).

## 0. Pourquoi

Le seul consommateur de prod (`apps/jsx-string-doc/docs-src/build.tsx`) n'utilise **aucune**
des features streaming (`<Defer>`, adapters, négociation). Il bricole en revanche head/TOC/assets
à la main, parce que la couche d'orchestration a été supprimée au profit de `<Defer>`. On inverse
la hiérarchie : **orchestration au centre, streaming en extension.**

Fil conducteur unique : _enregistrer pendant le rendu → placer après le rendu_.

- **`<Fill>`** place du contenu (sync, ou async qu'on **attend**) dans un slot — intra-rendu.
- **`<Defer>`** place du contenu **différé** (on flush le shell avant qu'il soit prêt) — inter-temps HTTP.
- Litmus : _« ai-je besoin de flusher le shell avant que ce contenu soit prêt ? »_ Oui → `Defer`. Non → `Fill`.

## 1. Modèle (vocabulaire Hotwire/web-components)

- **`<Slot name="x">défaut?</Slot>`** — trou **passif**, nommé. Ses enfants sont le contenu par
  défaut (ex-`fallback`). Ne décide rien sur la fusion.
- Le **contenu** déclare le « où » (`slot="x"`, attr web-components) et le « comment »
  (`swap`, vocabulaire HTMX/Turbo) :
  - **`<Fill slot="x" swap?>…</Fill>`** (cœur) — placement bloquant.
  - **`<Defer slot?="x" swap? fallback? timeout? onError?>…</Defer>`** (`/stream`) — placement différé.
- **`swap`** = `"replace"`(défaut)`| "append" | "prepend" | "before" | "after"` (ex-`merge`).
- **`<head>` n'est qu'un slot** : `<Slot name="head"/>` dans le layout, les pages poussent via
  `<Fill slot="head">`. Pas de composant `<Head>`. Le slot `head` porte une **politique de merge**
  (dédup `<title>`, `<meta>` par `name`/`property`) — défaut fourni, surchargeable.
- **`src` appartient au `<Slot>`** (style `<turbo-frame src loading="lazy">`) : un trou qui va
  chercher son propre contenu. Son rendu est **piloté par un adapter** passé à `renderDocument`
  (`{ adapter }`) — axe _SSG + adapter_, dont le streaming n'est qu'un consommateur. Sans adapter,
  `<Slot>` reste un simple trou. Le « fetcher » peut être le navigateur (Turbo/HTMX/Native) **ou le
  CDN** (ESI `<esi:include>`).

## 2. Layout du package cible

```
@cjean-fr/jsx-document                 (import par défaut — assemblage de document, zéro JS ; adapter optionnel, seulement pour <Slot src>)
  renderDocument(node, options?)        scope + slots + head + transforms → Promise<string>
  <Slot name [merge]>                    trou passif (+ contenu par défaut)
  <Fill slot [swap]>                     placement bloquant (sync ou async attendu)
  injectIntoHead / composeTransforms     briques de transform (TOC, assets…)
  types: Swap, Transform, SlotName

@cjean-fr/jsx-document/stream          (opt-in — livraison différée, bâtie sur le même scope)
  <Defer slot? [swap] [fallback] [timeout] [onError]>
  renderToReadableStream(node, opts?)    ReadableStream<Uint8Array>
  renderToResponse(req, page, opts?)     Response
  nativeAdapter                          défaut (zéro lib cliente, polyfill inline)
  + active <Slot src> (lazy-fetch)
  types: StreamEvent, FlowOptions, OnError, DeferContent

@cjean-fr/jsx-document/adapters        (opt-in — autres wire-formats)
  createAdapter, turboAdapter, htmxAdapter, webPlatformAdapter   (ESI reporté — voir §9)
  type: Adapter                          (pas de capabilities — voir « Contrat d'adapter »)

@cjean-fr/jsx-document/http            (opt-in — négociation, orthogonale au wire-format)
  negotiateHtmx, negotiateUnpoly
  types: Negotiate, Negotiation
```

### Arborescence `src/`

```
src/
  index.ts                 barrel cœur
  document.ts              renderDocument (ex-renderToStatic/renderPage, sans emitFragments)
  context.ts               Document context : collation slots/fills + register()
  types.ts                 Swap, Transform, SlotName (ex-events.ts, partie partagée)
  slotName.ts              assertSlotName (ex-fragmentId.ts)
  utils.ts                 injectIntoHead, composeTransforms (ex-composeShell)
  components/
    Slot.tsx
    Fill.tsx
  stream/
    index.ts               barrel /stream
    Defer.tsx              moitié différée de l'ex-Defer.tsx
    render.ts              renderToReadableStream, renderToFlowEvents (interne)
    streamFlow.ts          moteur de drain (quasi inchangé)
    context.ts             extension defer() du Document context
    events.ts              StreamEvent, FlowOptions, OnError, DeferContent
    http.ts                renderToResponse
  adapters/
    index.ts               createAdapter, turbo/htmx/webPlatform (ESI reporté)
  http/
    index.ts               negotiateHtmx, negotiateUnpoly
  *.test.tsx               tests cœur (Slot/Fill/renderDocument)
  stream/*.test.tsx        tests streaming
```

### Contrat d'adapter (cible)

```ts
type Adapter = {
  Slot(props: { name: string; src: string | null; children: JSXNode }): JSXNode; // le trou (wire)
  Fill(props: { slot: string; swap: Swap; children: JSXNode }): JSXNode; // le patch (throw si swap inexprimable)
  Frame?(props: { name: string; children: JSXNode }): JSXNode; // présence ⇒ supporte <Slot src>
  transformShell?(shell: string): string;
};
```

- `<Slot>` se rend via `adapter.Slot` ; `<Defer>`/`<Fill>` (sur le fil) via `adapter.Fill` — même mot des deux côtés.
- **Pas d'objet `capabilities`** : « ce que sait faire l'adapter » se lit dans sa forme —
  `Frame` présent ⇒ self-fetch ; swaps acceptés ⇒ ce que `Fill` ne throw pas ; streamable ⇒
  c'est un `Adapter` (ESI reporté ; un non-streamable futur sera brandé par type, pas par booléen).
- **Pas de `encode()`** : la sérialisation `StreamEvent`→string (shell/close en passthrough, patch
  via `Fill`) est interne à `/stream`. Couture gardée en interne pour ré-exposer un override si un
  vrai besoin apparaît (YAGNI assumé).

## 3. Table de migration des symboles

| Aujourd'hui (`jsx-flow`)                                    | Cible                                                                                  | Sous-chemin        |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------ |
| `Defer` (union 5 modes)                                     | `Slot` + `Fill`                                                                        | cœur               |
| `Defer` (cas différé)                                       | `Defer` (props `slot`/`swap`/`fallback`)                                               | `/stream`          |
| `<Head>`/`<Title>`/… (déjà supprimés)                       | `<Slot name="head">` + `<Fill slot="head">`                                            | cœur               |
| prop `merge` / `MergeType`                                  | `swap` / `Swap`                                                                        | cœur               |
| `renderToHtmlStream`                                        | `renderToReadableStream`                                                               | `/stream`          |
| `renderToFlowEvents`                                        | _(interne)_                                                                            | `/stream`          |
| `flowResponse`                                              | `renderToResponse`                                                                     | `/stream`          |
| `renderToStatic` + `StaticContext` + `emitFragments`        | **supprimés** → `renderDocument` (SSG-fragments : futur `renderToFragments` si besoin) | —                  |
| `FlowEvent`                                                 | `StreamEvent`                                                                          | `/stream`          |
| `Flow` (context)                                            | `Document` (context) + extension `/stream`                                             | cœur               |
| `PatchAdapter`                                              | `Adapter` (2 méthodes requises + 2 optionnelles)                                       | `/adapters`        |
| `StreamingAdapter`                                          | **supprimé** (tous les adapters streament)                                             | —                  |
| adapter `Placeholder(id, src, children)`                    | méthode `Slot({ name, src, children })`                                                | `/adapters`        |
| adapter `Patch(id, children, merge)`                        | méthode `Fill({ slot, swap, children })` (throw sur swap inexprimable)                 | `/adapters`        |
| adapter `Frame(id, children)`                               | méthode `Frame?({ name, children })` **optionnelle** (présence ⇒ `<Slot src>`)         | `/adapters`        |
| adapter `encode()`                                          | **supprimé** (sérialisation interne, dérivée de `Fill`)                                | `/stream`          |
| `capabilities` / `AdapterCapabilities`                      | **supprimés** (déduits : présence de `Frame`, `Fill` qui throw)                        | —                  |
| `NativeAdapter`                                             | `nativeAdapter`                                                                        | `/stream` (défaut) |
| `TurboAdapter`/`HtmxAdapter`/`WebPlatformAdapter`           | `turboAdapter`/`htmxAdapter`/`webPlatformAdapter`                                      | `/adapters`        |
| `EsiAdapter`                                                | **reporté** (réintroduit plus tard — cf §9)                                            | —                  |
| `createAdapter`                                             | inchangé (sans `capabilities`/`encode`)                                                | `/adapters`        |
| `composeShell`                                              | `composeTransforms`                                                                    | cœur               |
| `injectIntoHead`                                            | inchangé                                                                               | cœur               |
| `assertFragmentId`                                          | `assertSlotName`                                                                       | cœur               |
| `DeferContent`                                              | inchangé                                                                               | `/stream`          |
| `negotiateHtmx`/`negotiateUnpoly`/`Negotiate`/`Negotiation` | inchangés                                                                              | `/http`            |

## 4. Mapping fichier par fichier

| Fichier actuel             | Action                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/index.ts`             | Réécrit en barrel **cœur** (Slot, Fill, renderDocument, transforms, types). Tout le reste part en sous-chemins.                                                                                                                                                                                                                                                     |
| `src/render.ts`            | Scinder : `renderToStatic/renderPage` → `src/document.ts` (`renderDocument`, **sans** `emitFragments`) ; `renderToFlowEvents`/`renderToHtmlStream` → `src/stream/render.ts`.                                                                                                                                                                                        |
| `src/streamFlow.ts`        | → `src/stream/streamFlow.ts` (logique de drain inchangée).                                                                                                                                                                                                                                                                                                          |
| `src/events.ts`            | Scinder : `Swap`(ex-MergeType)/`Transform` → `src/types.ts` ; `StreamEvent`/`FlowOptions`/`OnError`/`DeferContent` → `src/stream/events.ts`.                                                                                                                                                                                                                        |
| `src/context.ts`           | Cœur : `Document` context = collation `slots`/`fills` + `register()`. `/stream` : `src/stream/context.ts` ajoute `defer()` + `deferred` map par-dessus. **La validation `merges.includes(swap)` disparaît** — c'est `Fill` qui throw sur un swap inexprimable.                                                                                                      |
| `src/http.ts`              | `renderToResponse` → `src/stream/http.ts` ; `negotiate*` → `src/http/index.ts`.                                                                                                                                                                                                                                                                                     |
| `src/adapters.tsx`         | → `src/adapters/index.ts` : `PatchAdapter`→`Adapter`, méthodes `Placeholder`→`Slot` / `Patch`→`Fill`, `Frame` optionnel, **`encode` et `capabilities` supprimés**, factories en camelCase, **ESI retiré**. `nativeAdapter` déménage en `src/stream/` (défaut) ; la sérialisation `StreamEvent`→string (dérivée de `Fill`) devient interne à `src/stream/render.ts`. |
| `src/utils.ts`             | Cœur. `composeShell`→`composeTransforms`. `injectIntoHead` inchangé.                                                                                                                                                                                                                                                                                                |
| `src/fragmentId.ts`        | → `src/slotName.ts`, `assertFragmentId`→`assertSlotName` (regex inchangée).                                                                                                                                                                                                                                                                                         |
| `src/components/Defer.tsx` | Éclater : `src/components/Slot.tsx` + `src/components/Fill.tsx` (cœur) + `src/stream/Defer.tsx` (différé). Supprimer le mode `<Head>` implicite.                                                                                                                                                                                                                    |
| `src/index.test.tsx`       | Scinder : cœur (`Slot`/`Fill`/`renderDocument`/head/transforms) en `src/*.test.tsx` ; streaming en `src/stream/*.test.tsx`.                                                                                                                                                                                                                                         |
| `src/dist-demo/**`         | Déplacer sous une démo `/stream` (ou supprimer si purement illustratif).                                                                                                                                                                                                                                                                                            |
| `package.json`             | Renommer `@cjean-fr/jsx-document` ; `exports` map (`.`, `./stream`, `./adapters`, `./http`) ; build `bunup` multi-entrées. Bump majeur (0.3 ou 1.0 vu l'API cassée).                                                                                                                                                                                                |
| `README.md`                | Réécrire autour de l'orchestration de document ; streaming en section dédiée ; framing Suspense **par analogie** (« streaming SSR à la Suspense, sans hydratation »).                                                                                                                                                                                               |

## 5. Signatures cœur (cible)

```ts
// @cjean-fr/jsx-document
export function renderDocument(
  node: () => JSXNode,
  options?: {
    adapter?: Adapter; // requis seulement si des <Slot src> sont rendus (ESI, lazy-fetch)
    transforms?: Transform[]; // (html: string) => string, ordonnés
    headMerge?: (fills: JSXNode[]) => JSXNode[]; // défaut: dedupeHead
  },
): Promise<string>;

export type Swap = "replace" | "append" | "prepend" | "before" | "after";
export type Transform = (html: string) => string;

// <Slot name="sidebar"><Spinner/></Slot>
export function Slot(props: {
  name: string;
  merge?: SlotMerge;
  children?: JSXNode;
}): JSXNode;
// <Fill slot="sidebar" swap="append"><Nav/></Fill>
export function Fill(props: {
  slot: string;
  swap?: Swap;
  children: JSXNode;
}): JSXNode;

export function injectIntoHead(html: string, content: string): string;
export function composeTransforms(
  ...t: Array<Transform | false | null | undefined>
): Transform;
```

Mécanisme : `renderDocument` ouvre le scope (`withScope` de `jsx-string`), `<Slot>`/`<Fill>`
enregistrent dans la collation du Document context et rendent un marqueur, `renderToString`
draine l'arbre une fois, puis une passe place le collecté (head dédupliqué d'abord, slots ensuite)
et applique `transforms` dans l'ordre. Un rendu + une passe. Zéro JS client.

## 6. Migration des consommateurs

**`apps/jsx-string-doc/docs-src/build.tsx`** — perd la dépendance streaming :

```tsx
// AVANT
import { renderToStatic } from "@cjean-fr/jsx-flow";
await renderToStatic(async (ctx) => {
  for (const page of allPages) {
    setDocs({...});
    const rendered = await ctx.renderPage(() => config.layout({ children: inner }));
    const html = injectToc(rendered, renderTocHtml);
    await writeFile(page.outPath, "<!DOCTYPE html>\n" + html);
  }
});

// APRÈS
import { renderDocument, composeTransforms } from "@cjean-fr/jsx-document";
import { injectViteAssets } from "@cjean-fr/jsx-vite"; // assets = un transform
for (const page of allPages) {
  setDocs({...});
  const html = await renderDocument(() => config.layout({ children: inner }), {
    transforms: [injectToc(renderTocHtml), injectViteAssets(manifest)],
  });
  await writeFile(page.outPath, "<!DOCTYPE html>\n" + html);
}
```

- le layout déclare `<head><Slot name="head"/></head>` ; les pages poussent leur `<title>`/meta
  via `<Fill slot="head">` (supprime le besoin de gérer le head à la main).

**Autres :**

- racine `package.json` catalog : `@cjean-fr/jsx-flow` → `@cjean-fr/jsx-document`.
- `apps/jsx-string-doc/package.json` : dépendance renommée.
- `docs-src/examples/jsx-flow/*` + `docs-src/pages/jsx-flow/*.mdx` : réécrire sur la nouvelle API,
  renommer le dossier `jsx-flow` → `jsx-document` ; mettre à jour `docs.config.ts` (`sidebar`).
- `bun.lock` régénéré par `bun install`.

## 7. Plan par phases (chaque phase = build + test verts)

1. **Cœur** — créer `types.ts`, `slotName.ts`, `context.ts` (Document), `document.ts`
   (`renderDocument`), `components/Slot.tsx` + `Fill.tsx`, `utils.ts`. Couvrir par tests.
2. **/stream** — déplacer `Defer`, `render`, `streamFlow`, `events`, `http(renderToResponse)`,
   `nativeAdapter` ; brancher l'extension `defer()` du context. Établir l'`exports` map.
3. **/adapters** + **/http** — extraire adapters (camelCase) et négociation.
4. **Rename** — `@cjean-fr/jsx-document`, catalog + dépendances consommateurs, bump majeur.
5. **build.tsx** — basculer sur `renderDocument`, head via `<Slot name="head">`.
6. **Docs/exemples** — réécrire + renommer dossier/MDX, `docs.config.ts`.
7. **Cleanup** — supprimer `renderToStatic`/`emitFragments`/mode `<Head>`/code mort ; README.

## 8. Tests

- **Cœur** : `Slot` rend son contenu par défaut tant que non rempli ; `Fill` place (sync + async
  attendu) ; ordre des `swap` (replace/append/prepend/before/after) ; head hoisté + dédup
  (`<title>` unique, meta par `name`) ; `transforms` appliqués dans l'ordre ; isolation entre
  appels concurrents à `renderDocument`.
- **/stream** : reprend l'essentiel de l'actuel `index.test.tsx` (tous adapters × swaps, fallback,
  `onError`, `timeout`, `AbortSignal` y compris pré-aborté, `AsyncIterable`) ; égalité shell
  streaming vs `renderDocument` pour une même entrée.

## 9. Micro-décisions encore ouvertes (à confirmer en implémentant)

- **`<Slot src>` — tranché** : rendu depuis `renderDocument(page, { adapter })`, sur l'axe _SSG +
  adapter_ (pas seulement via `/stream`). Le `src` est une livraison post-rendu dont le fetcher est
  soit le navigateur, soit le CDN (ESI). Le cœur reste sans adapter tant qu'aucun `<Slot src>` n'est
  rendu.
- **Slot `head`** : exiger `<Slot name="head"/>` explicite dans le layout, ou auto-injecter avant
  `</head>` s'il est absent ? Proposé : supporter les deux (auto si absent).
- **Politique de merge du head** : signature exacte de `headMerge` / `SlotMerge` et défauts de dédup.
- **Versioning** : 0.3.0 (early dev) vs 1.0.0 (API cassée assumée).
- **Renommer le package maintenant** (phase 4) vs garder `jsx-flow` et ne renommer qu'au moment de
  publier.
- **ESI — reporté mais accueilli** : ESI = `<Slot src>` dont le fetcher est le CDN (`<esi:include>`)
  - émission des fragments. Reviendra en **paquet additif `/esi`** : un `esiAdapter` (`Slot` →
    `<esi:include src>`, `Frame` → contenu brut, pas de `Fill`/streaming) + un helper `renderToFragments`
    (ex-`emitFragments`). `esiAdapter` n'est **pas** un `StreamingAdapter` → rejeté au type par
    `renderToReadableStream`/`renderToResponse`, accepté par `renderDocument` + `renderToFragments`.
    Aucun changement du cœur — purement additif.
- **Erreur « swap non supporté »** : passe de `defer()` (enregistrement) au drain (appel de `Fill`),
  donc potentiellement après l'envoi du shell en streaming. Acté : bug dev attrapé au premier rendu.
