# Tickets Contenu et Données - The Aviator

## CNT-001 - Matrice des exigences

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : aucune
- Description : retranscrire les exigences vérifiables de `DOC1.pdf` et du PV dans une matrice avec référence, ticket, responsable et preuve de recette.
- Critères d'acceptation : chaque exigence exploitable possède un ticket; les hypothèses non confirmées sont séparées des décisions documentées.

## CNT-002 - Données produits initiales

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `ADM-003`
- Description : préparer les produits, packs, prix, images, tailles, couleurs, matière, coupe, entretien, stock et badges.
- Critères d'acceptation : chaque produit a un slug unique, une image valide, un prix, une catégorie et des variantes cohérentes.

## CNT-003 - Pages commerciales

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `CNT-001`
- Description : valider le contenu de l'accueil, collection, packs, qualité, à propos et avis avec la marque The Aviator.
- Critères d'acceptation : textes et visuels approuvés, cohérents avec le cahier des charges, lisibles sur mobile et sans contenu de démonstration.

## CNT-004 - FAQ et informations de service

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `CNT-001`
- Description : finaliser FAQ, paiement, livraison/retours, guide des tailles et contact.
- Critères d'acceptation : délais, frais, moyens de paiement, échanges et retours sont explicites et identiques au comportement applicatif.

## CNT-005 - Légal et confidentialité

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `CNT-001`
- Description : valider CGV, politique de confidentialité, cookies, données collectées, conservation et droits utilisateur.
- Critères d'acceptation : les pages sont accessibles avant commande; les textes sont validés par le responsable légal; aucun placeholder ne reste en production.

## CNT-006 - Livraison et zones

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `ADM-006`
- Description : préparer la liste des villes, régions, frais, seuils de gratuité et délais.
- Critères d'acceptation : les données éditoriales correspondent aux `ShippingZone` actifs et aux montants calculés au checkout.

## CNT-007 - Assets et SEO

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `CNT-002`, `CNT-003`
- Description : optimiser logo, images, alt text, titres, descriptions, Open Graph, favicon, sitemap et robots.
- Critères d'acceptation : aucune image critique ne casse; les pages principales ont des métadonnées uniques et des textes alternatifs utiles.

## CNT-008 - Validation éditoriale finale

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : tous les tickets `CNT-*`
- Description : organiser la validation finale avec le propriétaire métier et consigner les corrections issues du PV.
- Critères d'acceptation : contenu, prix, promotions, conditions et coordonnées sont validés avant publication.
