# THE AVIATOR — redesign to approved mockups

Brand: THE AVIATOR, Moroccan men's boxers. Site language: French only.
Source of truth: /design-reference/. Each image has "Version now" (top) and "What I want from you" (bottom). ALWAYS build the BOTTOM/target version.

HARD RULES
1. Keep the existing stack, routing, cart, checkout, orders, reviews and admin logic. Change presentation and only the behaviors I list. Ask before adding any library.
2. Pixel-close fidelity: layout, spacing, type hierarchy, colors, icons, borders, radii, image crops, gradients, section order. "Close enough" = failure.
3. Copy must match the target images character for character (accents, ’ apostrophes, spaces before : ? !). Keep all copy in ONE content file. If a word is unreadable, log it in NEEDS_CONFIRMATION.md. Never silently invent copy.
4. Images: use ONLY files in /design-reference/assets/. Never regenerate, redraw or use stock photos. Missing asset → neutral PLACEHOLDER-<name> + log it.
5. Design tokens: sample exact values from the images (do not eyeball). Approx: navy ≈ #061A3A, lime ≈ #C8E01E, off-white paper ≈ #F5F4EF with subtle grain, navy text on light sections.
6. Typography: high-contrast serif for headlines (compare Playfair Display / DM Serif Display / Libre Caslon), Inter for body, condensed sans for big numbers (Bebas Neue / Barlow Condensed), handwritten script for "More than just boxers", "Merci pour votre confiance !", "Toujours à votre écoute !". Pick the closest by comparing crops.
7. Section pattern: small uppercase letter-spaced eyebrow + short lime underline, serif title with ONE lime keyword, grey subtitle.
8. Icons: one thin-line set (stroke ~1.5), matching the target; lime on dark backgrounds.
9. Responsive: desktop matches mockups at 1440px. Mobile (390px) must be excellent — most customers are on phones. Stack columns, horizontal scroll for card rows, full-width CTAs. Same copy on mobile.
10. Accessibility: contrast ≥ 4.5:1, visible focus, French alt text, tap targets ≥ 44px, respect prefers-reduced-motion.
11. Business facts live in ONE config file, never hardcoded elsewhere:
   - Pack of 2 boxers = 99 DH · 95% coton / 5% élasthanne
   - 5 colors: Noir, Bleu marine, Bleu royal, Blanc, Gris chiné
   - Sizes: M, L, XL, XXL — chosen PER BOXER (each boxer has its own color AND size)
   - Livraison partout au Maroc, gratuite à Casablanca, délai = DELIVERY_DELAY constant (24–48h)
   - Paiement à la livraison (espèces) only
   - Hours: lundi–vendredi 9h–18h · email social@theaviatorboxer.com · WhatsApp number from the current site config
   - Tagline: "Confort · Style · Au quotidien" · "Made by us in Morocco" / "Conçu au Maroc"
12. Ratings, review count and "Achat vérifié" badges must come from real approved-review data. Do NOT hardcode 4.8 / +100 / 120. Mockup reviews go only in a clearly marked reviews.seed file.
13. Remove everything not in the targets: GRS/GOTS claims, "5 paires pour 3", 149 DH, 388 DH, "7 jours", pack ×4/×6, polo/T-shirt/jacket photos.
14. Work in small steps. After each section: run the app, screenshot, compare, fix, commit.