# Tickets Client - The Aviator

## État existant

Le frontend contient déjà le catalogue, les fiches produit, les packs, le panier local, le checkout COD, WhatsApp et les pages éditoriales. Les tickets ci-dessous sécurisent et complètent ces parcours.

## CLI-001 - Catalogue et disponibilité

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `ADM-003`, `ADM-004`
- Description : afficher les produits actifs, recherche, filtres, tri, variantes et disponibilité réelle.
- Critères d'acceptation : un produit archivé est absent; une variante sans stock est clairement indisponible; les états loading, empty et error sont gérés.

## CLI-002 - Panier fiable

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `CLI-001`
- Description : fiabiliser la persistance localStorage, les variantes, quantités, suppression et recalcul du sous-total.
- Critères d'acceptation : les variantes distinctes restent séparées; la quantité ne dépasse pas le stock; un panier corrompu est récupéré sans bloquer l'application.

## CLI-003 - Coupons côté serveur

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `ADM-007`, `CLI-002`
- Description : valider et recalculer les remises côté API avant toute confirmation de commande.
- Critères d'acceptation : le total affiché correspond au total serveur; les coupons minimum panier, pack-only, expiration et limite sont respectés; la remise ne peut pas produire un total négatif.

## CLI-004 - Checkout COD

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `CLI-002`, `ADM-004`, `ADM-006`
- Description : finaliser le checkout existant avec frais dynamiques par ville, validation des coordonnées et protection contre les doubles soumissions.
- Critères d'acceptation : prénom, nom, téléphone, ville et adresse sont validés; les frais viennent de `ShippingZone`; une erreur conserve le panier; une commande réussie vide le panier une seule fois.

## CLI-005 - Paiement en ligne

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `CLI-004`, `QA-006`
- Description : intégrer Stripe ou le prestataire confirmé dans les documents, sans stocker de données bancaires.
- Critères d'acceptation : création serveur de l'intention, webhook vérifié, succès/échec/retry, idempotence de commande et statut de paiement traçable.

## CLI-006 - Confirmation et suivi

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `CLI-004`, `ADM-005`
- Description : afficher le numéro de commande, le récapitulatif et permettre le suivi par numéro + téléphone ou compte client.
- Critères d'acceptation : un client ne voit que ses propres données; le statut correspond à l'API; une commande inconnue donne un message neutre.

## CLI-007 - Compte et avis client

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `AUTH-001`, `ADM-008`
- Description : permettre inscription, connexion, réinitialisation, historique de commandes et dépôt d'avis.
- Critères d'acceptation : les commandes sont isolées par utilisateur; un avis est validé puis soumis en `pending` si nécessaire; les avis approuvés sont affichés publiquement.

## CLI-008 - Contact et support

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `QA-006`
- Description : remplacer le succès local du formulaire de contact par une soumission persistée ou un canal support défini.
- Critères d'acceptation : validation des champs, confirmation de réception, gestion d'erreur et protection anti-spam sont présents; WhatsApp reste disponible comme alternative.

## CLI-009 - Retours et remboursements

- Priorité : `P1`
- Statut : `TODO`
- Dépendances : `ADM-005`, `ADM-009`
- Description : permettre une demande de retour selon les conditions commerciales validées.
- Critères d'acceptation : la demande est liée à une commande livrée, visible par le client et traitable par l'admin; les statuts et délais sont affichés.

## CLI-010 - Accessibilité et responsive

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `CLI-001`, `CLI-004`
- Description : couvrir clavier, focus, labels, messages d'erreur, contraste, textes alternatifs et écrans mobile/desktop.
- Critères d'acceptation : les parcours catalogue, panier et checkout sont utilisables au clavier et sans chevauchement à partir de 320px de largeur.
 