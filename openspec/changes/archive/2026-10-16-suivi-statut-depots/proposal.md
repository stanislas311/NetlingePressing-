# Proposal

## Why

Le pressing suit manuellement l'avancement des dépôts : un dépôt est créé en statut « déposé » mais rien ne trace son passage en lavage, en préparation ou au retrait par le client. Le réceptionniste n'a aucune visibilité sur l'état d'avancement depuis la liste ni sur le ticket, et aucune trace de qui a fait quoi et quand.

## What Changes

- Ajouter un circuit de statuts linéaire : déposé → en lavage → prêt → livré, sans retour en arrière ni saut d'étape
- Ajouter un bouton « passer à l'étape suivante » sur la liste des dépôts et sur la page du ticket (masqué pour un dépôt livré)
- Enregistrer la date et l'heure réelles du retrait lorsque le statut passe à « livré »
- Historiser chaque changement de statut (ancien statut, nouveau statut, date et heure) et afficher l'historique sur la page du ticket
- Ajouter un filtre par statut dans la liste des dépôts, en complément de la recherche existante
- Rendre un dépôt livré non modifiable (plus de changement de statut ni de modification de la date de retrait)
- Garantir la compatibilité : les dépôts déjà enregistrés dans le localStorage gardent le statut « déposé » et un historique vide

## Capabilities

### New Capabilities

_(aucune nouvelle capability)_

### Modified Capabilities

- `depot-linge` : circuit de statuts, changement d'étape, historique des statuts, filtre par statut, immutabilité après livraison

## Impact

- `src/app/depot-linge/models/depot.model.ts` : extension du type `DepotStatut`, nouveaux champs `dateRetraitReelle` et `historiqueStatuts`
- `src/app/depot-linge/services/depot-store.service.ts` : logique de transition, historisation, persistance
- `src/app/depot-linge/depot-list/*` : bouton d'avancement, filtre par statut
- `src/app/depot-linge/ticket/*` : bouton d'avancement, historique, verrouillage après livraison
- `src/app/systeme-design/np-status-badge/*` : couleurs des nouveaux statuts (en lavage, prêt, livré) si déjà présentes ou à ajuster
- Tests existants à adapter ; nouveaux tests pour transitions, historique, filtre et verrouillage
