# Proposal

## Why

La date de retrait prévue est aujourd'hui fixée automatiquement à la date de dépôt + 48 heures, sans possibilité de l'adapter. Or certains dépôts (gros volumes, services spécifiques, saturation du pressing) ne peuvent pas être prêts sous 48 h : le réceptionniste doit pouvoir ajuster la date de retrait annoncée au client, tant à la création que sur un dépôt déjà enregistré, sans que le ticket perde sa valeur de justificatif.

## What Changes

- Le champ date de retrait devient modifiable dans le formulaire de création de dépôt : pré-rempli à date de dépôt + 48 h, modifiable par le réceptionniste. La date de dépôt reste automatique (date du jour).
- Validation : la date de retrait choisie ne peut pas être antérieure à la date de dépôt.
- Ajout de la possibilité de modifier la date de retrait d'un dépôt existant, depuis la liste des dépôts et depuis la page du ticket.
- La page du ticket imprimable affiche toujours la date de retrait à jour après modification.
- Aucun emoji dans le code ni dans les textes de l'interface.

## Capabilities

### New Capabilities

<!-- Aucune nouvelle capacité : le module de dépôt de linge existe déjà. -->

### Modified Capabilities

- `depot-linge`: La date de retrait prévue devient modifiable à la création et sur un dépôt existant, avec validation (retrait >= dépôt) et affichage à jour sur le ticket.

## Impact

- Code : `src/app/depot-linge/` — service de persistance (nouvelle opération de mise à jour de la date de retrait), composant de création (champ date), composant de liste et composant ticket (modification de la date), modèles si nécessaire.
- Dépendances : aucune ajoutée.
- Données : le champ `dateRetraitPrevue` existant dans le localStorage est réutilisé ; migration inutile (les dépôts déjà créés gardent leur date).
- Compatibilité : le comportement existant (pré-remplissage à +48 h) est conservé par défaut.
