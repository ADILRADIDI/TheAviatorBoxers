# Tickets Admin - The Aviator

## Règles de ticket

Statuts : `TODO`, `DOING`, `BLOCKED`, `DONE`. Tous les tickets commencent à `TODO`.

## ADM-001 - Protéger l'espace admin

- Priorité : `P0`
- Statut : `DOING`
- Dépendances : `AUTH-001`
- Description : créer un layout et des routes admin accessibles uniquement aux utilisateurs authentifiés ayant le rôle `admin`.
- Critères d'acceptation :
  - un utilisateur non connecté est redirigé vers la connexion ;
  - un utilisateur `user` reçoit une réponse d'accès refusé ;
  - un utilisateur `admin` voit la navigation admin ;
  - les états de chargement et d'erreur sont affichés sans fuite de données.

> Réalisé en local : login admin signé avec expiration, token requis sur `/api/admin/*`, dashboard français sur `/admin`. Un fournisseur d'identité production reste à brancher.

## ADM-002 - Dashboard opérationnel

- Priorité : `P0`
- Statut : `DONE`
- Dépendances : `ADM-001`, `ADM-003`, `ADM-006`
- Description : afficher les commandes récentes, le chiffre d'affaires, les produits en rupture et les avis en attente.
- Critères d'acceptation : les indicateurs sont calculés depuis l'API, filtrables par période et accompagnés d'états loading, empty et error.

## ADM-003 - CRUD produits

- Priorité : `P0`
- Statut : `DOING`
- Dépendances : `ADM-001`
- Description : gérer les produits `Product` : nom, slug, description, prix, images, SKU, catégorie, tailles, couleur, matière, coupe, badge et ordre.
- Critères d'acceptation : création, modification, archivage et réactivation fonctionnent; le slug est unique; les champs requis sont validés; un produit archivé ne s'affiche plus dans le storefront.

> Réalisé en local : création produit, liste produits réelle, prix, slug, stock, couleur et tailles de base.

## ADM-004 - Variantes et stock

- Priorité : `P0`
- Statut : `DOING`
- Dépendances : `ADM-003`
- Description : gérer le stock par variante couleur/taille et signaler les seuils faibles.
- Critères d'acceptation : une variante indisponible ne peut pas être ajoutée; une commande valide décrémente le stock une seule fois; une annulation autorisée restaure le stock.

> Réalisé en local : table `product_variants`, SKU par taille/couleur, seed des variantes et écran admin d'ajustement de stock. La restauration d'annulation reste à finaliser.

## ADM-012 - Clients invités

- Priorité : `P0`
- Statut : `DONE`
- Dépendances : `ADM-005`
- Description : exploiter les commandes invitées comme base clients sans imposer de compte client.
- Critères d'acceptation : regroupement par téléphone, nombre de commandes, total dépensé, ville et dernière commande.

> Réalisé en local : onglet Clients connecté aux commandes PostgreSQL.

## ADM-013 - Catégories

- Priorité : `P0`
- Statut : `DOING`
- Dépendances : `ADM-001`
- Description : créer et lister les catégories du catalogue.
- Critères d'acceptation : slug unique, description, activation et ordre d'affichage.

> Réalisé en local : table catégories, seed Boxers, endpoint et écran d'ajout/liste. L'arborescence imbriquée et la protection de suppression restent à finaliser.

## ADM-005 - Gestion des commandes

- Priorité : `P0`
- Statut : `DONE`
- Dépendances : `ADM-001`, `ADM-004`, `CLI-004`
- Description : créer une file de commandes avec filtres par statut, date, ville et source, puis afficher le détail client et articles.
- Critères d'acceptation : les transitions sont limitées à la machine d'état définie; chaque changement est horodaté; les actions d'annulation et de retour respectent les permissions.

## ADM-006 - Zones de livraison

- Priorité : `P0`
- Statut : `DOING`
- Dépendances : `ADM-001`
- Description : administrer `ShippingZone` : ville, région, frais, seuil gratuit, délai et activation.
- Critères d'acceptation : une zone active est utilisée au checkout; une zone inactive ne peut pas être sélectionnée; l'absence de zone produit une erreur explicite.

## ADM-007 - Coupons et promotions

- Priorité : `P1`
- Statut : `DOING`
- Dépendances : `ADM-001`, `CLI-003`
- Description : gérer les coupons en pourcentage, montant fixe ou livraison gratuite, avec minimum panier, expiration, limite d'utilisation et restriction packs.
- Critères d'acceptation : un coupon invalide est refusé côté serveur; `used_count` est mis à jour atomiquement; un coupon expiré ou épuisé ne peut plus être utilisé.

## ADM-008 - Modération des avis

- Priorité : `P1`
- Statut : `DONE`
- Dépendances : `ADM-001`, `CLI-007`
- Description : traiter les avis `pending` et `approved`.
- Critères d'acceptation : un admin peut approuver ou rejeter un avis; seuls les avis approuvés sont publics; la note et le compteur produit restent cohérents.

## ADM-009 - Utilisateurs et rôles

- Priorité : `P0`
- Statut : `TODO`
- Dépendances : `ADM-001`
- Description : consulter les utilisateurs et contrôler l'attribution du rôle admin.
- Critères d'acceptation : seul un admin autorisé peut modifier un rôle; la dernière protection admin ne peut pas être supprimée accidentellement; les actions sensibles sont auditées.

> Bloqué : l'application actuelle utilise des clients invités et ne possède pas encore d'entité utilisateurs/roles distincte.

## ADM-010 - Exports et reporting

- Priorité : `P2`
- Statut : `TODO`
- Dépendances : `ADM-005`, `ADM-007`
- Description : exporter les commandes et afficher les indicateurs commerciaux.
- Critères d'acceptation : les exports respectent les filtres appliqués, n'exposent pas de données non autorisées et indiquent la date de génération.

## ADM-011 - Promotions configurables

- Priorité : `P0`
- Statut : `DOING`
- Dépendances : `ADM-001`, `ADM-007`
- Description : permettre à l'admin de créer des promotions programmées (vente flash, chaque vendredi, Ramadan ou campagne personnalisée) avec titres français/darija, texte, image, couleurs, code coupon, dates, CTA et URL.
- Critères d'acceptation : une seule promotion active et dans sa fenêtre est affichée; l'admin peut prévisualiser, activer, désactiver et planifier; les valeurs sont validées; le code promo reste soumis aux règles serveur.

> Socle livré : schéma `Promotion`, activation par dates, rendu storefront multilingue français préparé et personnalisation image/couleurs/CTA. Le CRUD complet du dashboard admin reste à implémenter.
