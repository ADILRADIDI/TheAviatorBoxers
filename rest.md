# REST - A faire au prochain passage

Date : 12 septembre 2026. Suite de l'audit du 11/09 (`left.md`) et des tickets `admin.md` / `client.md`.

## Statut deja verifie (ne pas refaire)

- [x] Exports admin (POINT VERIFIE 12/09) : `orders.csv`, `products.csv`, `customers.csv`, `inventory.csv`, `sales.csv` + `sales.xlsx` -> HTTP 200 sur l'API locale, CSV JSON encode, XLSX binaire reel. Boutons Exporter CSV ajoutes pour Clients, Inventaire et Produits; Commandes l'a deja.
- [x] Pack e2e fiable : course de `Products` corrigee + `VARIANT_STOCK_UNAVAILABLE` (500->400 via `DomainErrorFilter`), stock variantes rehausse a >= 25.
- [x] Design overhaul (12/09) : admin (sidebar noire, palettes #C7D400/#00285E, nouveau dashboard/ORDERS/CUSTOMERS/INVENTORY), pages Packs et Contact animees (framer-motion).
- [x] Lint, typecheck, build frontend verts apres overhaul.

## Reste a faire

### ADM-009 - Utilisateurs & roles (P0, TODO/BLOQUE)
- Pas d'entite utilisateurs/roles distincte (clients invites uniquement).
- Decision necessaire : creer une entite `users`/`roles` ou cloisonner sur les admins existants.
- Critere : seul un admin autorise modifie un role; derniere protection admin non supprimable; actions sensibles auditees.

### ADM-003 - Produits (P0, DOING)
- Champs manquants dans le formulaire : `matiere`, `coupe`, `badge`, `ordre`, tailles selectionnables (actuellement forcees S-XXL), slug unique valide cote serveur.
- Archivage/reactivation d'un produit (le storefront filtre deja `archived`, verifier l'endpoint).

### ADM-004 - Variantes & stock (P0, DOING)
- **Restaurant du stock lors d'une annulation/retour valide : "reste a finaliser"** (doc officielle) - a verifier dans la transaction d'annulation.
- Refuser une commande si un article est indisponible (non-testable actuellement, stock rehausse).

### ADM-013 - Categories (P0, DOING)
- Arborescence imbriquee des categories.
- Protection de suppression d'une categorie utilisee par des produits.

### ADM-006 - Zones de livraison (P0, DOING)
- Ecran admin de gestion des zones (ajout/edition/desactivation). Seed + calcul checkout OK.
- Zone inactive non selectionnable + erreur explicite si aucune zone active.

### ADM-007 - Coupons (P1, DOING)
- Cote serveur OK (minimum, pack-only, expiration, limite atomique, plafond, total non negatif).
- Ecran admin : creer/editer un coupon (pourcentage / montant fixe / livraison gratuite) — actuellement liste + toggle seulement.

### ADM-010 - Exports & reporting (P2)
- Quasi termine (endpoints + boutons verifies). Reste : exports qui respectent les filtres appliques dans l'UI + mention date de generation dans le fichier.

### ADM-011 - Promotions configurables (P0, DOING)
- Schema `Promotion` + rendu storefront + toggle OK.
- **CRUD complet dans le dashboard admin** a implementer (creer/editer/planifier/supprimer, previsualisation bilingue FR/Darija, televersement image).

### CLI-009 / P1-02 - Retours & remboursements (P1, IN_PROGRESS)
- Cote client OK (demande liee a commande livree, anti-dup).
- Cote admin : traitement des demandes (accepter/refuser, restauration du stock, flux de remboursement) — panneau `Returns` existant a completer/verifier.

### CLI-010 - Accessibilite & responsive (P0, IN_PROGRESS)
- Recette clavier sur catalogue, panier, checkout (+ focus visible, labels, contrastes).
- Recette mobile 320px etendue aux pages pack, avis, suivi et admin.

### Traductions restantes
- Relecture humaine finale des pages FR/Darija (les selecteurs sont RTL, 393 cles, 0 manquante).
- URLs stables `/fr` et `/darija` avec hreflang si SEO requis (metadata/canonical fonts deja en place).

### Packs multi-tailles
- Pack de 2, 4 et 6 pieces (actuellement 2 fixe) + stock deduit par variante (deja transactionnel).

### Exploitation (Q/A/Prod)
- CI : lint, typecheck, tests, build sur pull request.
- Headers de securite, CORS durci, logs centralises, sauvegarde PostgreSQL et procedure de rollback documentees.
- Google Analytics + Search Console (prevus dans `Documents/`).
- Re-documenter les URLs locales (frontend 8080, API 3001) apres changement de ports eventuel.

## Verification a relancer si changement backend
```bash
pnpm run lint
pnpm run typecheck
pnpm run build
pnpm --filter @aviator/api build
pnpm --filter @aviator/api test
pnpm --filter @aviator/db seed
pnpm exec playwright test      # suite e2e (17 specs attendus)
```

## Donnees de test
- Admin : `admin@theaviator.local` / `Aviator-Admin2026!` (seed par défaut via `ADMIN_EMAIL` / `ADMIN_PASSWORD`, rôle `SUPER_ADMIN`, endpoint `/api/admin/login`, token `x-admin-token`).
- Coupons : `TEST10` (10%), `PACK10` (packs 10%), `PACK_SIGNATURE`.
- Casablanca : livraison gratuite.
- Produits : Aviator Essential Navy/Noir 149 DH, Pack Signature 2 pieces 269 DH (variantes stock >= 25).