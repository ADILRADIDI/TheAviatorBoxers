# Tickets SEO - The Aviator

## Objectif 

Construire une visibilité durable au Maroc pour les recherches liées aux boxers,
caleçons, sous-vêtements homme, packs, qualité, livraison et achat en ligne.
Le référencement naturel ne garantit pas une position précise : les tickets
préparent le site, le contenu et la mesure nécessaires pour viser les meilleures
positions sur Google au Maroc.

## Marchés et langues

- Français : langue principale pour les pages commerciales et transactionnelles.
- Darija marocaine : pages, FAQ et contenus adaptés aux formulations locales.
- Arabe standard : à ajouter seulement si une validation métier confirme la demande et la capacité de traduction.
- Ciblage géographique : Maroc, avec priorités Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir et les autres villes réellement livrées.
- Ne pas traduire mot à mot : chaque version doit être naturelle, utile et cohérente avec le vocabulaire recherché localement.

## SEO-001 - Architecture SEO Next.js

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : migration Next.js, `CNT-002`
- Description : définir les URLs canoniques, pages catégories, fiches produits, packs, pages éditoriales et règles de pagination.
- Critères d'acceptation : une seule URL indexable par contenu; slugs stables en français; redirections 301 pour les anciens slugs; aucune page importante n'est bloquée par le routeur.

## SEO-002 - Métadonnées multilingues

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `SEO-001`, `CNT-003`
- Description : créer pour chaque page un title, une meta description, un H1, des titres structurés et des données Open Graph en français et darija.
- Critères d'acceptation : les métadonnées sont uniques, descriptives, localisées et générées depuis les données de la page; aucune valeur par défaut de démonstration ne reste en production.

## SEO-003 - Routage français et darija

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `SEO-001`, `SEO-002`
- Description : choisir et implémenter la convention de locales, par exemple `/fr/` et `/darija/`, avec sélecteur de langue et contenu réellement traduit.
- Critères d'acceptation : chaque page traduite possède une URL stable, un lien vers les autres langues, une locale correcte et aucun mélange involontaire de langues dans le contenu principal.

## SEO-004 - Hreflang et canonical

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `SEO-003`
- Description : générer les balises `hreflang`, `x-default`, canonical et alternates pour les versions françaises et darija.
- Critères d'acceptation : les URLs alternates répondent en 200, se référencent réciproquement et ne créent pas de boucle de canonicalisation.

## SEO-005 - Sitemap XML dynamique

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `SEO-001`, `ADM-003`
- Description : générer un sitemap indexable contenant uniquement les pages publiques actives, produits actifs, catégories, packs et pages éditoriales.
- Critères d'acceptation : `/sitemap.xml` ou l'endpoint Next.js répond en 200, utilise des URLs absolues HTTPS, exclut admin/panier/checkout et se met à jour après publication d'un produit.

## SEO-006 - Robots et indexation

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `SEO-005`
- Description : configurer `robots.txt`, les directives noindex et la protection des routes privées.
- Critères d'acceptation : le sitemap est déclaré dans robots; admin, compte, panier, checkout, confirmation et résultats internes ne sont pas indexés; les pages publiques importantes restent crawlables.

## SEO-007 - Données structurées

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `SEO-002`, `CNT-002`
- Description : ajouter JSON-LD `Organization`, `WebSite`, `Product`, `Offer`, `BreadcrumbList`, `FAQPage` uniquement lorsque le contenu respecte réellement le schéma.
- Critères d'acceptation : les données structurées correspondent au contenu visible, passent les validateurs Google/schema.org et n'inventent ni avis, ni prix, ni disponibilité.

## SEO-008 - Recherche de mots-clés Maroc

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `CNT-001`
- Description : construire une liste validée de requêtes françaises et darija par intention : achat, produit, pack, taille, qualité, livraison et retours.
- Critères d'acceptation : chaque mot-clé possède une intention, une ville ou zone si pertinente, une page cible, un niveau de priorité et une preuve issue de Search Console, Keyword Planner ou recherche concurrentielle.

## SEO-009 - Pages locales utiles

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `SEO-008`, `ADM-006`, `CNT-006`
- Description : créer des pages locales uniquement pour les villes réellement livrées, avec frais, délais, disponibilité et contenu unique.
- Critères d'acceptation : aucune page locale générée en masse sans valeur; chaque page indique la zone, les conditions de livraison et un appel à l'action fonctionnel.

## SEO-010 - Contenu éditorial bilingue

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `SEO-008`, `SEO-003`
- Description : produire un calendrier de contenus en français et darija : guide des tailles, entretien, choix du boxer, qualité du tissu, livraison au Maroc et FAQ.
- Critères d'acceptation : contenu original, relu par un locuteur naturel, maillage interne vers les produits et absence de traduction automatique publiée sans contrôle.

## SEO-011 - Images et recherche visuelle

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `CNT-007`
- Description : optimiser poids, formats, dimensions, noms de fichiers, alt text et `ImageObject` pour les images produits.
- Critères d'acceptation : images responsives, lazy loading hors viewport, alt text utile et aucun texte SEO artificiel dans les attributs.

## SEO-012 - Performance et Core Web Vitals

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : migration Next.js, `QA-006`
- Description : optimiser LCP, INP, CLS, JavaScript, polices, images, cache CDN et rendu mobile.
- Critères d'acceptation : les pages principales sont mesurées sur mobile réel ou simulation équivalente; aucune régression bloquante n'est introduite; les budgets performance sont documentés.

## SEO-013 - Search Console et analytics

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `SEO-005`, `SEO-006`, `QA-009`
- Description : configurer Google Search Console, sitemap, Bing Webmaster Tools si pertinent, analytics respectueux de la confidentialité et événements e-commerce.
- Critères d'acceptation : impressions, clics, requêtes, pages indexées, ajout panier, checkout et achat sont mesurables sans exposer de données personnelles inutiles.

## SEO-014 - Maillage interne et navigation

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `SEO-001`, `SEO-008`
- Description : relier catégories, produits, packs, guides, FAQ, livraison et contenus locaux avec des ancres naturelles.
- Critères d'acceptation : toute page importante est accessible en quelques clics; les liens cassés et pages orphelines sont détectés automatiquement.

## SEO-015 - Autorité et visibilité locale

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `SEO-010`, `SEO-013`
- Description : créer et maintenir la fiche Google Business Profile si l'activité possède une adresse éligible, développer des partenariats et obtenir des liens locaux légitimes.
- Critères d'acceptation : aucun achat de liens, spam, faux avis ou page satellite; les mentions partenaires sont pertinentes et vérifiables.

## SEO-016 - Suivi mensuel et amélioration

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `SEO-013`, `SEO-014`
- Description : produire un rapport mensuel Maroc/français/darija et prioriser les corrections selon impressions, CTR, positions, conversions, indexation et Core Web Vitals.
- Critères d'acceptation : le rapport compare les périodes, distingue marque et hors marque, liste les actions responsables et mesure leurs résultats.

## Checklist SEO avant production

- Domaine HTTPS, redirection www/non-www et version canonique choisis.
- Titles, descriptions, H1, canonical et hreflang vérifiés en français et darija.
- Sitemap soumis et robots validé.
- Pages privées en `noindex`.
- JSON-LD validé sans données inventées.
- Produits, prix, stock, livraison et coordonnées cohérents avec l'application.
- Mobile, vitesse, images et accessibilité contrôlés.
- Search Console et événements e-commerce actifs.
- Aucun contenu dupliqué, placeholder, faux avis ou page locale vide.
