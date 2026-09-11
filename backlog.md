# The Aviator - Backlog de livraison

## Sources

- `Documents/DOC1.pdf` - cahier des charges disponible.
- `Documents/PV_Reunion_Aviator_10-09-2026 (1).pdf` - décisions de réunion disponibles.
- Code frontend et entités Base44 existants.
- Aucun troisième document n'est disponible.

## Priorités

- `P0` : indispensable pour vendre, administrer et sécuriser la mise en production.
- `P1` : nécessaire pour une version complète et exploitable.
- `P2` : amélioration ou extension après le lancement.

## Documents

| Fichier | Périmètre |
| --- | --- |
| [admin.md](admin.md) | Administration, produits, commandes, stock, coupons, avis et utilisateurs |
| [client.md](client.md) | Parcours client, catalogue, panier, checkout, compte et support |
| [qa-devops.md](qa-devops.md) | Tests, qualité, CI, Docker Compose, sécurité et déploiement |
| [content.md](content.md) | Contenus storefront, données commerciales, légal et recette éditoriale |
| [seo.md](seo.md) | SEO technique, marché marocain, français, darija, sitemap et mesure |

## Ordre recommandé

1. Socle partagé, authentification et autorisation.
2. Commandes, stock, livraison et espace admin.
3. Stabilisation du parcours client COD.
4. Tests automatisés et CI.
5. Docker Compose et déploiement.
6. SEO technique, sitemap, langues et performance.
7. Paiement en ligne, reporting et améliorations P1/P2.

## Definition of Done globale

- Le ticket est relié à une exigence ou identifié comme décision à confirmer.
- Les critères d'acceptation sont vérifiés sur données de test.
- Les droits d'accès et les erreurs sont traités.
- `npm run lint`, `npm run typecheck` et `npm run build` passent.
- La documentation et les variables d'environnement nécessaires sont à jour.

## État d'implémentation

- [x] `QA-007` - PostgreSQL et Redis sont disponibles dans Docker Compose.
- [x] Backend slice initial - API NestJS/Fastify `/health`, package Drizzle/PostgreSQL et worker BullMQ créés; build, test et migration validés.
- [ ] `QA-001` - Stabilisation complète du socle et validation TypeScript.
- [ ] `QA-002` - Tests unitaires métier.
- [x] `QA-006` - Image Docker frontend Vite avec Nginx, fallback SPA et healthcheck.

### Vérifications du premier lot

- [x] `pnpm --filter @aviator/api build`
- [x] `pnpm --filter @aviator/worker build`
- [x] `pnpm --filter @aviator/api test`
- [x] `pnpm --filter @aviator/db migrate`
- [x] Smoke test HTTP `GET /health`
- [x] `pnpm run lint`
- [x] `pnpm run build`
- [x] `docker compose config` et healthchecks PostgreSQL/Redis
- [x] Image frontend Docker, healthcheck Compose et fallback SPA (`/` et `/collection` validés)
- [ ] `pnpm run typecheck` - plusieurs erreurs JSX existantes dans le storefront JavaScript restent à corriger.

## État client au 2026-09-11

- [x] Catalogue, disponibilité stock, panier borné et checkout COD validés par lint/build.
- [x] Confirmation, suivi par numéro + téléphone, compte client et avis pending ajoutés.
- [x] Contact WhatsApp prérempli avec honeypot anti-spam.
- [ ] Coupons côté serveur : nécessite un endpoint de validation transactionnel et le compteur d'utilisation.
- [ ] Paiement en ligne : fournisseur et backend webhook/idempotence non configurés.
- [ ] Retours/remboursements : entité, règles métier et workflow admin non disponibles.
- [ ] Accessibilité/responsive : nécessite une recette clavier, lecteur d'écran et viewport 320px/desktop.
- [ ] TypeScript global : erreurs de typage dans les composants JSX JavaScript historiques; lint et build passent.
 