# Spec — Home "Avis" Section (ReviewsSection)

Section: `src/components/home/ReviewsSection.jsx` — 3-featured-reviews block + modal.
Bernard: keep the section's role, data, CTAs, and modal behavior. Make the cards the new shared compact `ReviewCard` (already spec'd in `specs/avis-redesign.md`).

## Keep (UNCHANGED)
- `fetchFeaturedReviews(3)`
- `SectionHeading` eyebrow "Avis publiés", title "Le confort, raconté par ceux qui le portent."
- Ghost link "Tous les avis" → `/avis`
- Navy sheen CTA "Laisser un avis" → opens modal
- Modal: `@radix-ui/react-dialog` (max-w-2xl, bg-paper, X close, `ReviewForm` + `onSubmitted` close). NOT retrofitting focus trap / scroll lock in this pass — existing behavior.
- Empty state when no reviews
- Skeleton block

## Change
1. Card markup → shared `ReviewCard` component (`src/components/reviews/ReviewCard.jsx` from `/avis` spec).
   - Same `figure.card-compact` anatomy, lime Quote, `line-clamp-3 font-display italic`, StarRating 14, verified BadgeCheck, `border-t` name/city figcaption
   - Drops the old `p-8` + initials-avatar card (one mental model both surfaces)
   - Grid stays `grid gap-6 md:grid-cols-3` (3 cards, 3 cols)
2. Skeleton: `h-64 animate-pulse bg-muted` × 3 (was `h-64`-ish; keep the existing count + pulse pattern)
3. NEW error state (was missing): if `useAsync.error`, render the same brand-safe dashed box as `/avis` — message + `Retry` → `refetch()`. Reveal `fade` entrance like the cards. FALLBACK stays behind it.
4. Entrance: cards stagger `(i % 3) * 0.12` via Reveal `fade` (existing `whileInView once, margin -60px`).

## Layout rhythm (from DESIGN.md)
- Section: `py-20 lg:py-28` (unchanged outer)
- Heading block unchanged; cards below get a tighter intro gap than the old `p-8` version allowed — grid `gap-6`

## States
- Loading: 3 × skeleton
- Empty: existing copy (unchanged)
- Error: new dashed box + Retry
- (No filters on home — that's /avis territory)

## Responsive / Motion / A11y
- 1 col mobile → 3 cols `md:` (unchanged)
- All motion via Reveal + reduced-motion guard (index.css, in DESIGN.md)
- Cards stay cards: no whole-card navigation, no hidden links; accessibility unchanged from current section

## File impact
- `src/components/home/ReviewsSection.jsx` — slim: replace card JSX with `<ReviewCard review={r} />`
- `src/components/reviews/ReviewCard.jsx` — NEW shared card (see /avis spec)
- No store / API / SEO changes