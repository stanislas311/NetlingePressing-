# Proposal

## Why

Le sujet impose facturation, notifications, tableau de bord et finitions. Sans ces éléments, le pressing ne peut ni encaisser, ni relancer un client, ni piloter l'activité.

## What Changes

- Catalogue de tarifs (gérant), total automatique, avance, paiements, facture imprimable
- Un dépôt ne passe à livré que si le solde est à zéro
- Centre de notifications (dépôt, prêt, retard) et lien WhatsApp wa.me (+225) quand le linge est prêt
- Tableau de bord (dépôts du jour, prêts, retards, CA gérant, répartition)
- Annulation avec motif, page 404, états vides

## Capabilities

### New Capabilities

- `facturation`
- `notifications`
- `tableau-de-bord`

### Modified Capabilities

- `depot-linge` : solde, livraison bloquée, annulation

## Impact

Extension de `DepotStoreService`, nouvelles pages, localStorage tarifs et notifications.
