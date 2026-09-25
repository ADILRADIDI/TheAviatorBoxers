# Implementation Summary — BrandStory (FE-001)

## What changed
- `src/components/home/BrandStory.jsx` — rewritten copy/structure to match approved target:
  - Badge: `MADE BY US IN MOROCCO`
  - New bottom-left overlay: `DES DÉTAILS DERRIÈRE VOTRE CONFORT`
  - New H2: `Tout est parti d'un besoin simple :` + lime `<em>` `être vraiment à l'aise.`
  - 3 new paragraphs (leader-confirmed verbatim copy)
  - Stats (95% / 5% / 100%) labels reused, no edit
  - `Image`/`IMAGES` registry NOT used — plain `<img src="">` per delegation (no design-reference/ assets dir exists)
  - Imports reduced to `motion`/`useReducedMotion` + `useLanguage`
- `src/lib/translations.js` — 7 new French→Darija keys added (Darija values are ASSISTANT DRAFTS, not source-verified; French fallback is safe at render).

## File paths
- `src/components/home/BrandStory.jsx`
- `src/lib/translations.js`
- `specs/implementation-summary.md` (this file)

## State handling
- None needed — static section, no data fetching. `useReducedMotion` respected for the reveal animation.

## Verification
- `pnpm typecheck` → PASS (tsc -p ./jsconfig.json)
- `pnpm build` → PASS (vite build, 2705 modules)
- Status: **verified**

## Notes for designer QA
- Img is intentionally empty `src=""` (no asset available in repo) — visual check will show the navy gradient overlay as background.
- Darija strings flagged as drafts — confirm/translate before shipping AR locale.
- Out of scope: `src/pages/About.jsx`, styles, libraries, `IMAGES` registry.