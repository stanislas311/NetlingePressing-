# Tasks

## 1. Modèle et constantes de statut

- [x] 1.1 Étendre `DepotStatut` avec `'en-lavage' | 'pret' | 'livre'`, ajouter `STATUTS_ORDE` et `STATUT_LABELS` en français dans `depot.model.ts`, et vérifier que `ng build` passe sans erreur
- [x] 1.2 Ajouter `DepotHistoriqueStatut`, `dateRetraitReelle?` et `historiqueStatuts` à l'interface `Depot`, et vérifier que `ng build` passe sans erreur
- [x] 1.3 Adapter `np-status-badge` pour couvrir les quatre statuts (déposé, en lavage, prêt, livré) et vérifier que les tests du badge passent

## 2. Logique de transition et persistance

- [x] 2.1 Implémenter `passerAuStatutSuivant(depotId)` dans `DepotStoreService` (vérifie l'ordre, refuse `livre`, enregistre `dateRetraitReelle` au passage à livré, historise) et vérifier que les tests de transition passent
- [x] 2.2 Implémenter la migration à la lecture dans `listerDepots`/`getDepotById` (statut manquant → `depose`, historique absent → initialisé) et vérifier que les tests de compatibilité passent
- [x] 2.3 Refuser `modifierDateRetrait` sur un dépôt livré et vérifier que le test de verrouillage passe
- [x] 2.4 Étendre `rechercherDepots` avec un filtre `statutFiltre?: DepotStatut` et vérifier que les tests de filtre passent

## 3. Composant liste des dépôts

- [x] 3.1 Ajouter un sélecteur de filtre par statut dans `depot-list.component.html` et connecter la logique de filtrage combinée à la recherche, puis vérifier `ng build`
- [x] 3.2 Ajouter le bouton « Passer à l'étape suivante » sur chaque ligne (masqué pour les dépôts livrés) et connecter l'action au service, puis vérifier `ng build`
- [x] 3.3 Adapter les tests de `DepotListComponent` (filtre, bouton d'avancement, masquage sur livré) et vérifier qu'ils passent

## 4. Composant ticket

- [x] 4.1 Ajouter l'affichage de l'historique des statuts sur la page du ticket (du plus ancien au plus récent) et vérifier `ng build`
- [x] 4.2 Ajouter l'affichage de la date et de l'heure réelles du retrait pour un dépôt livré et vérifier `ng build`
- [x] 4.3 Ajouter le bouton « Passer à l'étape suivante » (masqué pour les dépôts livrés) et masquer l'édition de date sur un dépôt livré, puis vérifier `ng build`
- [x] 4.4 Adapter les tests de `TicketComponent` (historique, retrait réel, bouton d'avancement, verrouillage) et vérifier qu'ils passent

## 5. Vérification finale

- [x] 5.1 Exécuter `ng build` et `ng test` sans erreur, et vérifier qu'aucun emoji n'apparaît dans le code ni dans l'interface

## Workflow follow-up

- Archiver le changement après relecture (`openspec archive`).
