# Tickets Client - The Aviator

## État existant

Le frontend contient déjà le catalogue, les fiches produit, les packs, le panier local, le checkout COD, WhatsApp et les pages éditoriales. Les tickets ci-dessous sécurisent et complètent ces parcours.

## CLI-001 - Catalogue et disponibilité

- Priorité : `P0`
- Statut : `DONE`
- Dépendances : `ADM-003`, `ADM-004`
- Description : afficher les produits actifs, recherche, filtres, tri, variantes et disponibilité réelle.
- Critères d'acceptation : un produit archivé est absent; une variante sans stock est clairement indisponible; les états loading, empty et error sont gérés.

## CLI-002 - Panier fiable

- Priorité : `P0`
- Statut : `DONE`
- Dépendances : `CLI-001`
- Description : fiabiliser la persistance localStorage, les variantes, quantités, suppression et recalcul du sous-total.
- Critères d'acceptation : les variantes distinctes restent séparées; la quantité ne dépasse pas le stock; un panier corrompu est récupéré sans bloquer l'application.

## CLI-003 - Coupons côté serveur

- Priorité : `P1`
- Statut : `IN_PROGRESS`
- Dépendances : `ADM-007`, `CLI-002`
- Description : valider et recalculer les remises côté API avant toute confirmation de commande.
- Critères d'acceptation : le total affiché correspond au total serveur; les coupons minimum panier, pack-only, expiration et limite sont respectés; la remise ne peut pas produire un total négatif.

> Réalisé : recalcul serveur transactionnel, minimum panier, pack-only, expiration, limite d'usage, ciblage produit, plafond de remise et total jamais négatif.

## CLI-004 - Checkout COD

- Priorité : `P0`
- Statut : `DONE`
- Dépendances : `CLI-002`, `ADM-004`, `ADM-006`
- Description : finaliser le checkout existant avec frais dynamiques par ville, validation des coordonnées et protection contre les doubles soumissions.
- Critères d'acceptation : prénom, nom, téléphone, ville et adresse sont validés; les frais viennent de `ShippingZone` avec fallback documenté; une erreur conserve le panier; une commande réussie vide le panier une seule fois.

> Réalisé : frais dynamiques par ville, état de chargement du calcul de livraison, validation des coordonnées et double-submit déjà protégée par `submitting`.

> Renforcé : une clé d'idempotence persistée empêche les doublons lors des retries réseau ou d'une nouvelle soumission serveur.

## CLI-005 - Paiement en ligne (hors périmètre)

- Priorité : `P1`
- Statut : `OUT_OF_SCOPE`
- Dépendances : `CLI-004`, backend de paiement et décision fournisseur
- Description : intégrer le paiement en ligne après confirmation du prestataire retenu, sans stocker de données bancaires.
- Critères d'acceptation : intention créée côté serveur, webhook vérifié, succès/échec/retry, idempotence et statut de paiement traçable.

> Exclu du périmètre actuel : le projet conserve uniquement le paiement à la livraison (COD).


## CLI-006 - Confirmation et suivi

- Priorité : `P0`
- Statut : `DONE`
- Dépendances : `CLI-004`, `ADM-005`
- Description : afficher le numéro de commande, le récapitulatif et permettre le suivi invité par numéro + téléphone.
- Critères d'acceptation : un client ne voit que ses propres données; le statut correspond à l'API; une commande inconnue donne un message neutre.

> Réalisé : confirmation, lien de suivi et page `/suivi-commande` avec vérification conjointe du numéro de commande et du téléphone.

## CLI-007 - Avis client sans compte

- Priorité : `P1`
- Statut : `DONE`
- Dépendances : `AUTH-001`, `ADM-008`
- Description : permettre au client invité de déposer un avis sans créer de compte; le suivi de commande reste accessible par référence + téléphone.
- Critères d'acceptation : nom, ville, note et commentaire sont validés; l'avis est soumis en `pending`; seuls les avis approuvés sont publics.

> Réalisé : formulaire d'avis invité sur `/avis`, soumis en `pending` avant modération; aucun compte client n'est requis pour commander ou donner un avis.

## CLI-008 - Contact et support

- Priorité : `P1`
- Statut : `DONE`
- Dépendances : `QA-006`
- Description : remplacer le succès local du formulaire de contact par une soumission persistée ou un canal support défini.
- Critères d'acceptation : validation des champs, confirmation de réception, gestion d'erreur et protection anti-spam sont présents; WhatsApp reste disponible comme alternative.

> Réalisé : le formulaire validé ouvre une conversation WhatsApp préremplie, confirme l'envoi côté client et ignore les soumissions détectées par le champ honeypot.

## CLI-009 - Retours et remboursements

- Priorité : `P1`
- Statut : `IN_PROGRESS`
- Dépendances : `ADM-005`, `ADM-009`
- Description : permettre une demande de retour selon les conditions commerciales validées.
- Critères d'acceptation : la demande est liée à une commande livrée, visible par le client et traitable par l'admin; les statuts et délais sont affichés.

> Réalisé : demande liée à une commande livrée, anti-duplication serveur et statut de retour visible dans le suivi invité.

## CLI-010 - Accessibilité et responsive

- Priorité : `P0`
- Statut : `IN_PROGRESS`
- Dépendances : `CLI-001`, `CLI-004`
- Description : couvrir clavier, focus, labels, messages d'erreur, contraste, textes alternatifs et écrans mobile/desktop.
- Critères d'acceptation : les parcours catalogue, panier et checkout sont utilisables au clavier et sans chevauchement à partir de 320px de largeur.

> Réalisé : test Playwright Chromium à 320px sur accueil, collection, panier et checkout; aucun débordement horizontal détecté.
 