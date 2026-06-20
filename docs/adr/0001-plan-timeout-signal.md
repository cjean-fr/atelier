# ADR 0001 — planTimeoutSignal : le pur testable contre l'inline

**Date :** 2026-06-19
**Contexte :** `packages/jsx-flow/src/fragment-runner.ts`

## Résumé

`planTimeoutSignal` est une fonction pure extraite de `runFragment` pour être testable en isolation. Elle est testée exhaustivement (11 cas) mais n'est jamais appelée par le code de production — `runFragment` duplique son calcul inline (12 lignes). 199 lignes (fonction + types + tests) pour abstraire 12 lignes à un seul call site. Deux issues :

- **Risque de drift** : une modification de `planTimeoutSignal` passe tous les tests mais n'affecte pas la prod, et inversement.
- **Module shallow** : l'interface (`TimeoutSignalPlan`) est presque aussi complexe que l'implémentation.

## Options envisagées

### Option A — Promouvoir planTimeoutSignal en autorité unique
`runFragment` appelle `planTimeoutSignal`, utilise le `TimeoutSignalPlan` retourné pour construire les side-effects (AbortController, setTimeout). Supprime le inline duplicate.

Conséquences :
- +~5 lignes dans `runFragment` (l'appel + le dispatch)
- `description` dans `TimeoutSignalPlan` devient du code mort si on ne le loggue pas
- Les 11 tests protègent désormais le vrai chemin

### Option B — Supprimer planTimeoutSignal et ses tests
Les 12 lignes inline dans `runFragment` sont gardées telles quelles. `planTimeoutSignal`, `TimeoutSignalConfig`, `TimeoutSignalPlan`, et `fragment-runner.test.ts` sont supprimés.

Conséquences :
- −199 lignes (30 + 2 types + 157 tests)
- Perte de la granularité des 11 cas unitaires — les tests intégration couvrent déjà les chemins timeout
- Locality gagnée : toute la logique timeout dans `runFragment`

## Décision

**Option B retenue.** `planTimeoutSignal` est supprimé.

Justification : 12 lignes d'abstraction avec 199 lignes de soutien pour un unique call site, c'est un module trop shallow pour son coût. Les tests intégration dans `index.test.tsx` couvrent déjà les chemins timeout, abort, et defaultTimeout. La perte de granularité est un risque acceptable.

## Status

Accepted.

## Conséquences

1. `fragment-runner.test.ts` est supprimé.
2. `runFragment` garde ses lignes 148-159 telles quelles, sans les passer par `planTimeoutSignal`.
3. `planTimeoutSignal`, `TimeoutSignalConfig`, `TimeoutSignalPlan` ne font plus partie de l'export surface du module.
4. Si la logique de timeout devient plus complexe à l'avenir (ex. jitter, retry, backoff), on pourra réintroduire une fonction pure — en s'assurant qu'elle a un call site en production.
