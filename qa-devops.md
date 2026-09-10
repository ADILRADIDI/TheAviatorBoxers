# Tickets QA, DevOps et Docker - The Aviator

## QA-001 - Corriger le socle existant

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : aucune
- Description : corriger les diagnostics ESLint/TypeScript et vérifier `AuthContext`, `Checkout` et les imports de pages.
- Critères d'acceptation : `npm run lint`, `npm run typecheck` et `npm run build` passent sans nouvelle erreur.

## QA-002 - Tests unitaires métier

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `QA-001`
- Description : ajouter Vitest pour panier, `lineKey`, quantités, sous-total, remises, coupons, livraison et téléphone marocain.
- Critères d'acceptation : cas nominal, limites, données invalides et régression sont couverts; les tests sont reproductibles sans backend réel.

## QA-003 - Tests API et intégration

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `QA-002`, `ADM-003`, `ADM-005`
- Description : tester les adaptateurs Product, Order, Coupon, Review et ShippingZone avec fixtures isolées.
- Critères d'acceptation : permissions, erreurs réseau, idempotence de commande et rollback stock sont vérifiés.

## QA-004 - Tests E2E Playwright

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `CLI-004`, `ADM-001`, `QA-003`
- Description : automatiser les parcours client et admin sur desktop et mobile.
- Critères d'acceptation : accueil -> collection -> produit -> panier -> checkout COD -> confirmation; accès admin; refus non-admin; erreur checkout.

## QA-005 - CI et release checks

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `QA-001`, `QA-002`, `QA-004`
- Description : ajouter les scripts de tests et une pipeline install, lint, typecheck, tests et build.
- Critères d'acceptation : la CI bloque une régression; les rapports de tests sont conservés; aucun secret n'est loggé.

## QA-006 - Docker frontend

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `QA-001`
- Description : créer un Dockerfile multi-stage pour construire Vite puis servir `dist` avec fallback SPA.
- Critères d'acceptation : image légère, build reproductible, port configurable, healthcheck et routes React fonctionnelles après refresh.

## QA-007 - Docker Compose

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `QA-006`
- Description : créer `docker-compose.yml`, `.dockerignore` et `.env.example`.
- Critères d'acceptation : `docker compose config` passe; `docker compose up --build` démarre le frontend; les variables sont documentées et aucun secret réel n'est versionné.

## QA-008 - Stratégie backend Compose

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `QA-007`
- Description : confirmer si Base44 peut être lancé dans Compose. Si non, documenter Base44 comme API externe et ne pas simuler un backend de production.
- Critères d'acceptation : le README précise les limites de `base44 dev`, `npm run dev` et Compose; l'architecture validée est testée sur un environnement propre.

## QA-009 - Sécurité et exploitation

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `QA-007`, `ADM-001`
- Description : configurer CORS, headers, logs, monitoring, rotation des secrets, sauvegarde et rollback.
- Critères d'acceptation : aucune clé privée côté client; erreurs sans données sensibles; procédure de rollback testée.

## QA-010 - Recette finale

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : tous les tickets `P0`
- Description : exécuter une recette client, admin, support et technique sur desktop/mobile.
- Critères d'acceptation : chaque exigence du cahier des charges et du PV est reliée à un résultat; les écarts sont documentés avant release.
