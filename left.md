# The Aviator - Reste a terminer avant livraison finale

Date de l'audit : 11 septembre 2026

Ce document est base sur `Documents/DOC1.pdf`, `Documents/PV_Reunion_Aviator_10-09-2026 (1).pdf` et le code actuel. Aucun troisieme document n'existe dans `Documents/`.

## Etat verifie

- [x] Catalogue public connecte a l'API PostgreSQL locale.
- [x] Produits seedes en base : Essential Navy, Essential Noir, Pack Signature 2 pieces.
- [x] Stock, zones de livraison, coupons et promotion seedes en base.
- [x] Casablanca gratuite; autres villes avec frais par zone.
- [x] Commande invite COD avec nom, adresse, telephone et enregistrement PostgreSQL.
- [x] Suivi de commande par reference + telephone.
- [x] Avis invite soumis en `pending`.
- [x] Section avis accueil sans faux avis fallback.
- [x] Navigation sans compte client obligatoire.
- [x] Selecteur francais / darija et direction RTL darija.
- [x] Schema Promotion avec textes, couleurs, image, dates, CTA et coupon.
- [x] API locale repond sur `http://localhost:3001`.
- [x] Frontend de test repond sur `http://localhost:8080`.
- [x] `pnpm run lint` passe.
- [x] `pnpm run build` passe.
## Blocage corrige pendant la derniere recette

- [x] Crash frontend `Cannot read properties of undefined (reading 'icon')` dans `AnnouncementBar`.

- Route `/admin`.
- Authentification admin et role `admin`.
- Liste des commandes PostgreSQL.
- Filtres par statut, date, ville et source.
- Detail client et articles.
- Images, prix, SKU, categories, tailles et couleurs.
- Stock par combinaison taille/couleur, pas seulement par produit.
- Alertes stock faible.
- Restoration lors d'une annulation/retour valide.
- Refuser une commande si un article est indisponible.

### P0-05 - Coupons cote serveur

- Valider `TEST10`, `PACK10` et les futurs codes uniquement dans l'API.
- Minimum panier.
- Type pourcentage, montant fixe, livraison gratuite.
- Restriction pack/produit/categorie.
- Expiration.
- `usage_limit` et `used_count` atomiques.
- Recalcul serveur du total, jamais confiance au total navigateur.

### P0-06 - Promotion admin
- Ramadan, Saint-Valentin et campagnes manuelles.
- Champs francais/darija, couleurs, image, badge, CTA, code coupon.

- Drawer panier, menu mobile, checkout et suivi.
- Corriger tout chevauchement ou bouton inaccessible.

- Idempotence.
 [x] Produits featured visibles après le Hero; home et collection utilisent les mêmes données PostgreSQL.
 [x] Filtres collection couleur et taille alimentés par `color_name` et `sizes` réels.
 [x] Checkout invité simplifié : nom complet, téléphone, adresse et ville.
 [x] Section détails produit interactive en 4 points numérotés.
 [x] Images produits persistées en base et images éditoriales stables chargées depuis le web.
 [x] Modales CRUD produits/catégories avec validation, erreur, annulation et confirmation de suppression produit.
 [x] Réservation stock et consommation coupon dans la transaction PostgreSQL de commande.
 [x] Dashboard admin français local sur `/admin`.
 [x] Login admin obligatoire avant chargement des données, token signé expirant et logout.
 [x] Admin commandes : liste et changement de statut.
 [x] Admin produits : création, stock, prix, slug, couleur et tailles de base.
 [x] Admin coupons : liste et activation/désactivation.
 [x] Admin promotions : activation/désactivation et champs bilingues existants.
 [x] Admin avis : approbation et rejet.
 [x] Variantes produit seedées avec SKU, taille, couleur et stock individuel.
[x] Pagination de base API/admin pour commandes et produits.
[x] Audit logs, notifications et exports CSV commandes/produits/clients.
[x] SEO technique : robots, sitemap, canonical, JSON-LD organisation et produit.
[x] Smoke tests Playwright client et login admin.
- Ne jamais stocker de carte bancaire.

### P1-02 - Retours et remboursements

- Entite `ReturnRequest`.
- SKU par taille/couleur.
- Pack de 2, 4 et 6 pieces.
- Stock deduit pour chaque variante.
- Section performance : indicateurs a confirmer avec Aviator.
- Visuels 3D et details par zone du produit.
- Header avec telephone et mention livraison gratuite Casablanca.
- Traduire accueil, collection, packs, produit, panier, checkout, confirmation, FAQ, legal et support.
- Ajouter URLs stables `/fr` et `/darija` si SEO requis.
- Metadata, canonical et hreflang.

- Corriger les props implicites des composants JSX JavaScript historiques (`Image`, `PageHeader`, `Reveal`, `StarRating`, `Button`, etc.).
- Faire passer `pnpm run typecheck`.
- Coupons et totaux.
 [ ] Traduction complète de toutes les pages en français et darija; le sélecteur et les zones principales sont déjà en place.
- Validation telephone marocain.
- Promotion active selon fenetre de dates.

### Q-03 - Tests integration API

- Produits.
- Zones.
- Coupons.
- Avis pending/approved.
- Commandes.
- Suivi par reference + telephone.
- Concurrence stock et idempotence.

### Q-04 - Tests E2E

- Collection -> produit -> panier -> checkout -> commande.
- Coupon valide/invalide.
- Pack custom.
- Suivi commande.
- Avis invite.
- FR/Darija.
- Admin et refus non-admin apres creation du dashboard.

## P2 - Livraison et exploitation

- Documenter le monolithe local : frontend Vite, API NestJS/Fastify, PostgreSQL, Redis/BullMQ.
- Ajouter migrations et seed reproductibles sur une base vide.
- Ajouter CI lint, typecheck, tests et build.
- Ajouter headers de securite, CORS, logs, sauvegarde et rollback.
- Configurer Google Analytics comme prevu dans les documents.
- Ajouter sitemap, robots, JSON-LD et Search Console.
- Docker Compose en dernier lot, apres validation du monolithe sans Docker.

## Commandes de verification actuelles

```bash
pnpm run lint
pnpm run build
pnpm --filter @aviator/db generate
pnpm --filter @aviator/db migrate
pnpm --filter @aviator/db seed
pnpm --filter @aviator/api build
```

## URLs locales actuelles

- Frontend : `http://localhost:8080`
- API : `http://localhost:3001/health`
- Produits : `http://localhost:3001/api/products`
- Promotion : `http://localhost:3001/api/promotions/active`
- Coupon de test : `http://localhost:3001/api/coupons/TEST10`

## Donnees de test actuelles

- Coupon : `TEST10` = 10 pour cent.
- Coupon : `PACK10` = 10 pour cent pour packs.
- Casablanca : livraison gratuite.
- Produit : Aviator Essential Navy, stock 40.
- Produit : Aviator Essential Noir, stock 35.
- Produit : Pack Signature 2 pieces, stock 20.

## Definition de fini finale

- [x] Dashboard admin securise et utilisable en local : login signe, role admin et expiration de session.
- [x] Produits, variantes, commandes, coupons, promotions et avis gerables depuis admin.
- [x] Checkout transactionnel avec stock et total serveur.
- [x] Typecheck global, lint, build API/frontend, tests unitaires API et smoke E2E verts.
- [ ] Pages francaises et darija relues.
- [ ] Accessibilite et responsive recetes.
- [ ] Backup, monitoring et rollback documentes.
- [ ] Docker Compose ajoute apres validation monolithique.