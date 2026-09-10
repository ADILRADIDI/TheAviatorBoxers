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

## Ordre recommandé

1. Socle partagé, authentification et autorisation.
2. Commandes, stock, livraison et espace admin.
3. Stabilisation du parcours client COD.
4. Tests automatisés et CI.
5. Docker Compose et déploiement.
6. Paiement en ligne, reporting et améliorations P1/P2.

## Definition of Done globale

- Le ticket est relié à une exigence ou identifié comme décision à confirmer.
- Les critères d'acceptation sont vérifiés sur données de test.
- Les droits d'accès et les erreurs sont traités.
- `npm run lint`, `npm run typecheck` et `npm run build` passent.
- La documentation et les variables d'environnement nécessaires sont à jour.
