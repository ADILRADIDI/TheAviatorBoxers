- in client side : Erreur d'affichage du panneau
Cannot read properties of undefined (reading 'toLocaleString')
Réessayer

- each page should be a route not /admin in all pages . if i refresh page return in commands . 

- 
















- WEBSITE
    - Traduire entièrement toutes les pages en français naturel et darija naturelle.
    - Ajouter des routes SEO stables pour les langues, par exemple `/fr` et `/darija`.
    - Ajouter hreflang, canonical dynamique et metadata par page, catégorie et produit.
    - Générer un sitemap dynamique depuis les produits, catégories et pages CMS publiés.
    - Compléter les données structurées JSON-LD : Organization, WebSite, Product, Offer, Breadcrumb et FAQ.
    - Configurer les identifiants réels Google Analytics, Meta Pixel et TikTok Pixel.
    - Vérifier les événements marketing : vue produit, ajout panier, début checkout et commande.
    - Ajouter une section configurable depuis le dashboard pour les campagnes : vente flash, Every Friday, Ramadan, Saint-Valentin et campagnes personnalisées.
    - Ajouter une section Workflow / processus de fabrication et tests qualité du produit.
    - Ajouter les contenus et visuels produit 3D si les assets validés sont fournis (high quality)
    - Finaliser les pages légales, FAQ, livraison, retours et guide des tailles avec contenu validé.
    - Compléter l'accessibilité : navigation clavier, focus visible, labels, erreurs, contraste et textes alternatifs.
    - Tester le parcours complet : produit, panier, coupon, checkout COD, confirmation et suivi.
    - Tester les retours, avis invités, changement de langue et affichage mobile.
    - Tester les performances : LCP, INP, CLS, images, polices, lazy loading et bundle frontend.
    - Corriger les liens cassés, pages orphelines, metadata manquantes et URLs privées indexables.

- ADMIN DASHBOARD
    - Ajouter les réglages globaux du footer : téléphone, email, WhatsApp, réseaux sociaux et liens légaux.
    - Ajouter une gestion complète des paramètres de la boutique : identité, horaires, contact, livraison et SEO.
    - Finaliser le CRUD produits : images, médias, tailles, couleurs, SKU, description, prix, stock, badges, visibilité et SEO.
    - Ajouter les pages détail produit avec onglets : overview, variantes, inventaire, commandes, analytics, SEO et activité.
    - Ajouter un inventory dédié : stock disponible, réservé, total, seuil, rupture et stock faible.
    - Ajouter les mouvements de stock avec ajustement, quantité avant/après, motif, note interne et admin responsable.
    - Ajouter les pages détail commande, client et retour avec drawers professionnels.
    - Finaliser le workflow retour : conditions, délais, statuts, remboursement/avoir et restauration du stock.
    - Ajouter les analytics réelles : ventes, produits, catégories, villes, clients et promotions.
    - Ajouter les reports avec aperçu, filtres, export CSV et export XLSX.
    - Ajouter les actions bulk sur produits, clients, coupons, promotions, notifications et autres tables.
    - Ajouter les filtres avancés : recherche, statut, dates, ville, rôle, module, tri et filtres sauvegardés.
    - Ajouter les réglages de tables : tri, visibilité des colonnes, pagination serveur et export contextuel.
    - Finaliser le centre notifications : lu/non lu, tout marquer lu, suppression et lien vers la ressource liée.
    - Ajouter une command palette `Cmd/Ctrl + K` pour rechercher produits, commandes, clients, coupons et pages.
    - Ajouter les tests d'intégration avec les vrais rôles : ADMIN, SALES, WAREHOUSE, MARKETING et CONTENT_EDITOR.
    - Vérifier systématiquement les réponses `403` pour toutes les permissions sensibles.
    - Tester l'expiration, la révocation et la réutilisation des sessions.
    - Ajouter les métriques PostgreSQL, Redis et stockage média avec alertes 5xx, login et espace disque.
    - Tester la restauration PostgreSQL sur une base vierge et documenter le rollback Drizzle.
    - Exécuter `docker compose up --build` de bout en bout avec migrations, seed, PostgreSQL, Redis et volume média.
    - Ajouter migrations, services PostgreSQL/Redis et tests E2E dans la CI.
    - Vérifier la CI sur un runner GitHub réel.
    - Documenter et vérifier tous les secrets obligatoires : `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`, `MEDIA_ROOT` et secrets CI.
