# Spec — /avis (Reviews) Redesign

Page: `src/pages/Reviews.jsx` — testimonials page, brand "alive" upgrade.
Bernard: keep existing structure, data flow, and SEO hooks. Change content, rhythm, and animation only.

## Scope
- Rework ReviewSummary (score header + criteria rows)
- NEW FilterChips component (page-local)
- NEW shared ReviewCard (compact, unified with home)
- Stagger/entrance animation system (from DESIGN.md)
- States: loading / empty / error / empty-filter (reuse FALLBACK behind all data paths)
- ReviewForm box (unchanged behavior, new heading)

## Data flow (UNCHANGED)
- `useAsync(() => fetchFeaturedReviews(6))` → `{ data, loading, error, refetch }` (src/lib/useAsync.js)
- `fetchFeaturedReviews` = GET `/api/reviews` → `items.slice(0, 6)` (src/lib/store.js line 108)
- FALLBACK in Reviews.jsx = source of truth for empty/fallback rendering
- POST `/api/reviews` for the form (src/components/storefront/ReviewForm.jsx)

## Page structure (top → bottom)
1. `PageHeader` — UNCHANGED (dark navy, eyebrow "Avis clients", serif/navy stat aside, CTA "Laisser un avis" → scroll to form)
2. `ReviewSummary` — reworked (below)
3. `FilterChips` — NEW (below)
4. Review grid — unified compact cards (below)
5. CTA/form box — heading "Partagez votre expérience" (was "Vous avez testé nos boxers ?"), everything else unchanged

`container-edge py-12 lg:py-16` outer wrapper unchanged.

## ReviewSummary (rework)
Keep the existing summary box anatomy; change content rhythm + one visual hook.

- Box: `max-w-4xl border bg-secondary p-8` (unchanged)
- Score number: `font-display text-6xl tabular-nums` count-up, `1.2s` ease-out, starts on inView (Reveal variant `scale`, `whileInView` once)
- Under the score: 2px lime accent bar `h-0.5 w-16 bg-accent` — brand alive hook
- `RatingCircles size={32}` under score (unchanged)
- Criteria grid (Tissu / Service / Livraison / Qualité générale) — `grid-cols-1 sm:grid-cols-2 gap-4`, each row: label + `RatingCircles size={20}`, entrance stagger `i * 0.06` (delay only; no per-row motion)
- Total rating text: `text-sm text-muted-foreground` (unchanged)

Loading: existing skeleton (6 × `h-56 animate-pulse bg-muted`, grid `md:2 lg:3`).
Empty/error: shared card states, see ReviewCard section.

## FilterChips (NEW, page-local)
Purpose: quickest path to the "5-star" reviews users actually read (was dead whitespace, now one tap).

- Buttons row: `flex flex-wrap gap-2`, above the grid, aligned with grid width
- Chips: `pill` — `rounded-full border px-4 py-2 text-sm font-medium transition-colors`, inactive `border-border text-muted-foreground hover:border-primary/40 hover:text-primary`, active `border-primary bg-primary text-primary-foreground`
- Options: **Tous** (default) · Tissu · Service · Livraison · Qualité — filter key = CRITERIA keys (`tissu, service, livraison, qualite`)
- Filter rule: `Number(review[key]) === 5`
- A11y: wrapper `role="group" aria-label="Filtrer les avis"`, each button `aria-pressed={active}`
- Empty-filter state: same copy pattern as home empty state (`font-display` headline + muted sub + CTA link to the form). Ponytail: "Aucun avis 5★ sur ce critère" is enough.

## ReviewCard (NEW, shared with home)
One card component, both surfaces. File suggestion: `src/components/reviews/ReviewCard.jsx`.

```jsx
<figure class="card-compact">           // cn("group relative overflow-hidden rounded-sm border bg-card p-6", hover-rise)
  <Quote class="h-6 w-6 text-accent" /> // lucide Quote, lime
  <blockquote>
    <p class="line-clamp-3 font-display text-lg italic leading-snug">{review.comment}</p>
  </blockquote>
  <div class="flex items-center justify-between">
    <StarRating value={review.rating} size={14} />
    {review.verified && <BadgeCheck class="h-5 w-5 text-accent" aria-label="Avis vérifié" />}
  </div>
  <figcaption class="mt-4 border-t pt-3">
    <p class="font-semibold">{review.name}</p>
    <p class="text-sm text-muted-foreground">{review.city}</p>
  </figcaption>
</figure>
```

- Hover: `hover:-translate-y-1` + lime corner sweep (existing pattern from home section: 2-span corner line animated on group-hover) — both wrapped in the reduced-motion guard (no transform/transition when `prefers-reduced-motion`)
- Shadow on hover: `shadow-[0_24px_50px_-24px_rgba(0,0,0,0.25)]` (existing inline value, promoted to the shared card)
- Initials avatar DROPPED (one mental model both surfaces)
- `<figure>` = semantic win over the old `article` wrapper
- Entrance: Reveal variant `fade`, stagger delay `(i % 3) * 0.12` (mobile 1-col: `Math.floor(i/… )` stays ≤ 3 groups so delay never feels dead on small screens — use `(i % 3) * 0.12` everywhere; grid wraps, pauses are fine)

Grid: `grid gap-6 md:grid-cols-2 lg:grid-cols-3` (same as current).

## States
- Loading: skeleton `h-56 animate-pulse bg-muted` × 6
- Empty (no reviews at all): FALLBACK copy — existing pattern (headline + sub + CTA), reused
- Error (useAsync error set): brand-safe box — `border border-dashed border-border p-8 text-center` with message + `Retry` button → `refetch()`. FALLBACK still renders behind it (data recovery when API is down is a feature, not a bug). Ponytail: one Retry button, not a whole error page.
- Empty-filter: see FilterChips

## Responsive, SEO, Motion
- Responsive: chips wrap (`flex-wrap`), grid 1→2→3 cols, summary criteria 1→2 cols
- SEO: UNCHANGED — keep `usePageMeta`, `useJsonLd`, `breadcrumbJsonDl`, `SITE_URL` exactly as-is
- Motion: all entrances go through `Reveal` (width inView once, `fade`/`scale` variants, `margin: "-60px"`, `duration 0.7`, ease `[0.16,1,0.3,1]`); stagger via `transition={{ delay }}` on variants; count-up is the only timer (1.2s); hover transforms guarded by reduced-motion CSS in index.css

## Accessibility (from DESIGN.md)
- Confirm contrast on active chip (primary-foreground on navy = AA)
- Focus rings: `ring-2 ring-ring ring-offset-2` on chips, cards remain static (whole-card click NOT added — keep it simple, quote cards don't navigate)
- Reduced motion: all entrance + hover motion disabled; content stays readable
- Semantic order: summary → filters → grid → form