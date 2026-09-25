# DESIGN.md — TheAviatorBoxers · Testimonials Redesign

Status: Phase 1 (design) — handoff artifact. Consumed by @frontend via specs/avis-redesign.md + specs/home-avis-section.md.
Stack: Vite + React 18 + Tailwind + framer-motion. **No new dependencies.**

## 1. Direction

Keep the brand (navy + lime + paper editorial studio). Make testimonials feel **ALIVE**: a bolder score summary, denser cards, and one coherent motion vocabulary instead of ad-hoc effects. One compact review card reused on both `/avis` and the home section so the two surfaces feel like one system. Fewest clicks to reach feedbacks (chips + CTA + inline form, no dead whitespace).

## 2. Tokens (reuse, extend — never replace)

Existing HSL variables from `src/index.css`, used via Tailwind utilities already present in the codebase:

| Token | Value | Utility |
|---|---|---|
| `--background` | `40 22% 97%` (paper) | `bg-background` / `bg-paper` |
| `--primary` | `216 72% 14%` (navy) | `bg-navy`, `text-white` |
| `--accent` | `64 100% 42%` (lime) | `text-accent-lime`, `bg-[hsl(64_100%_42%)]` |
| `--secondary` | (exists) | `bg-secondary` |
| `--muted` | `40 18% 92%` | `bg-muted` |
| `--border` | `42 16% 86%` | `border-border` |
| `--input` / `--ring` / `--radius` | existing | forms, focus rings |
| `--muted-foreground` | `216 16% 42%` | `text-muted-foreground` |

- Fonts: `--font-display` Barlow Condensed (headings, `leading-[0.95]`), `--font-body` Inter.
- Existing primitives to reuse: `container-edge`, `label-eyebrow`, `btn-store btn-store--navy/--ghost`, `btn-sheen`, `font-display`, `tabular-nums`, `Reveal`, `SectionHeading`, `PageHeader`, `StarRating`, `RatingCircles`, `RatingInput` (inside `ReviewForm`).

New tokens (add to `:root` only if cleaner than inline): none required — the card hover shadow `shadow-[0_24px_50px_-24px_rgba(0,0,0,0.25)]` and lime `hsl(64 100% 42%)` are already used inline in the codebase.

## 3. Type scale (display-first)

| Use | Spec |
|---|---|
| H1 page header | `font-display text-5xl sm:text-6xl lg:text-[4.5rem] leading-[0.95]` (PageHeader default) |
| H2 section | `font-display text-3xl sm:text-4xl lg:text-5xl leading-[0.95]` (SectionHeading default) |
| Score number | `font-display text-6xl font-bold tabular-nums` |
| Card quote | `font-display italic text-lg leading-snug text-ink/90` |
| Body / labels | `text-sm`; meta `text-xs text-muted-foreground`; eyebrow `label-eyebrow` |

## 4. Spacing / rhythm

- Section: `py-20 lg:py-28` (home) · page body: `container-edge py-12 lg:py-16`
- Card grid: `grid gap-6 md:grid-cols-2 lg:grid-cols-3` (home: `md:grid-cols-3`)
- Compact card padding: `p-6`
- Summary box: `p-8 lg:p-10`, max-w-4xl, `lg:gap-12`
- Form box: `max-w-2xl mx-auto mt-14 p-6 sm:p-8`

## 5. Animation system ("merge animations")

One small vocabulary. Every motion is entrance- or action-triggered; **all respect `prefers-reduced-motion`**.

| Name | Mechanism | Spec |
|---|---|---|
| Entrance | `Reveal` (variants `fade`/`mask`/`scale`) | existing: `whileInView` once, margin `-60px`, duration 0.7s (mask 0.9s), ease `[0.16,1,0.3,1]`, y=24; reduced-motion → plain div |
| Stagger | per-sibling `delay` | grid: `delay={(i % 3) * 0.12}` (`/avis`), `delay={i * 0.1}` (home); chips 0.15, criteria rows `i*0.06`, summary 0 |
| Live number | `useCountUp` (existing hook in Reviews.jsx) | 1.2s, ease `[0.16,1,0.3,1]`, in-view once; reduced-motion → instant final |
| Hover card | CSS transition + two lime corner spans | `hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.25)]`; spans: `w-0→full` / `h-0→full`, 500ms (home pattern) |
| Micro | icon shift / sheen | `ArrowUpRight` `group-hover:-translate-y-0.5 group-hover:translate-x-0.5` 300ms; `btn-sheen` |

Reduced-motion enforcement: rely on `Reveal`'s built-in handling; for hover transforms add `@media (prefers-reduced-motion: reduce) { .review-card:hover { transform:none; box-shadow:none } }` (or Tailwind `motion-reduce:` variants) — **no infinite loops, no autoplay** beyond the single entrance pass.

## 6. Component map

| Component | Status | Owner |
|---|---|---|
| `ReviewCard` (compact, shared /avis + home) | NEW | spec §compact |
| `FilterChips` (criterion filter, /avis only) | NEW | spec §chips |
| `ReviewSummary` (score + criteria) | Rework inline in Reviews.jsx | spec §summary |
| `ReviewForm` | UNCHANGED (API + behavior) | existing |
| `PageHeader`, `SectionHeading`, `Reveal`, `StarRating`, `RatingCircles` | UNCHANGED | existing |

API contract: **no change** — reuse `fetchFeaturedReviews(limit)` from `src/lib/store.js` (GET `/api/reviews`, slice), `useAsync` (`{ data, loading, error, refetch }`), and the `FALLBACK` array in Reviews.jsx (SEO + empty fallback).

## 7. Accessibility (WCAG 2.1 AA)

- Contrast: existing tokens pass; `text-muted-foreground` on paper ≥ 4.5:1; lime used for decor/icons only, never as sole text color at small size.
- Focus: `focus-visible` ring-2 on chips, CTA buttons, links (RatingInput pattern).
- Reduced motion: see §5 — everything has a static path.
- Semantics: h1 (PageHeader) → h2 (SectionHeading) → figure/figcaption cards → form fields (existing labels). Chips: `role="group" aria-label="Filtrer les avis"`, each chip `aria-pressed`.
- Cards are not click targets (decor only on hover); all actions sit in real buttons/links.