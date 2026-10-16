# Tasks

## 1. Validation et service de mise à jour

- [x] 1.1 Créer une fonction utilitaire de validation `dateRetraitValide(dateRetrait, dateDepot)` (comparaison au niveau jour, retrait >= dépôt) dans `src/app/depot-linge/models/depot.model.ts` ou un fichier utilitaire dédié ; écrire des tests unitaires (retrait après dépôt, retrait même jour, retrait antérieur) et vérifier qu'ils passent (`ng test`)
- [x] 1.2 Implémenter `modifierDateRetrait(depotId, nouvelleDateIso)` sur `DepotStoreService` : recharge le dépôt, applique la validation, persiste la mise à jour dans le localStorage, retourne le dépôt mis à jour ou `null` si introuvable/invalide ; écrire des tests unitaires (mise à jour réussie, dépôt introuvable, date antérieure refusée) et vérifier qu'ils passent

## 2. Formulaire de création : champ date de retrait

- [x] 2.1 Ajouter un champ `dateRetrait` (input `type="date"`, format `YYYY-MM-DD`) au formulaire de création dans `DepotCreateComponent`, pré-rempli avec la date de dépôt + 48 heures ; le champ est modifiable par le réceptionniste ; vérifier `ng build`
- [x] 2.2 Valider côté formulaire que la date de retrait saisie n'est pas antérieure à la date de dépôt (date du jour) ; afficher un message d'erreur en français si invalide et bloquer la soumission ; écrire des tests de composant (date valide acceptée, date antérieure bloquée, pré-remplissage correct) et vérifier qu'ils passent
- [x] 2.3 À la soumission, transmettre la date de retrait choisie (ou pré-remplie) au service de création ; vérifier via le test de composant que la date choisie est bien envoyée

## 3. Liste des dépôts : modification de la date de retrait

- [x] 3.1 Ajouter une action « Modifier la date de retrait » sur chaque ligne de la liste dans `DepotListComponent` : ouvre un `input type="date"` pré-rempli avec la date de retrait courante du dépôt + bouton de confirmation ; vérifier `ng build`
- [x] 3.2 À la confirmation, appeler `modifierDateRetrait` avec la nouvelle date ; en cas d'échec (date antérieure), afficher un message d'erreur en français sans modifier la date ; rafraîchir la liste en cas de succès ; écrire des tests de composant (modification réussie, date antérieure refusée avec message) et vérifier qu'ils passent

## 4. Page ticket : modification et affichage à jour

- [x] 4.1 Ajouter un bouton « Modifier la date de retrait » sur la page ticket dans `TicketComponent` qui bascule un `input type="date"` pré-rempli avec la date courante + bouton Enregistrer ; vérifier `ng build`
- [x] 4.2 À l'enregistrement, appeler `modifierDateRetrait`, recharger le dépôt depuis le service et réafficher la date de retrait à jour sur le ticket ; en cas de date antérieure, afficher un message d'erreur en français sans changer la date ; écrire des tests de composant (modification depuis le ticket, affichage à jour après modification, date antérieure refusée) et vérifier qu'ils passent

## 5. Intégration et vérification finale

- [x] 5.1 Vérifier l'intégration complète via `ng serve` : création d'un dépôt avec date de retrait modifiée, modification depuis la liste, modification depuis le ticket, ticket imprimable affichant la date à jour après chaque modification, rechargement de la page conservant les données ; vérifier l'absence d'emoji et l'interface en français (grep sur `src/`)
- [x] 5.2 Exécuter `ng build` et `ng test` sans erreur

## Workflow follow-up

- Archiver le changement après relecture (`openspec archive`).
