# Tasks

## 1. Modèles et service de persistance

- [x] 1.1 Créer les interfaces `Client`, `DepotArticle`, `Depot` dans `src/app/depot-linge/models/depot.model.ts` et vérifier que `ng build` compile sans erreur de type
- [x] 1.2 Implémenter `DepotStoreService` (`src/app/depot-linge/services/depot-store.service.ts`) avec lecture/écriture localStorage sous les clés `netlinge.deposits`, `netlinge.customers`, `netlinge.ticketCounter`, génération du numéro `DP-AAAAMMJJ-XXXX` et date de retrait = dépôt + 48 h ; écrire des tests unitaires du service (création d'un dépôt, unicité du numéro sur plusieurs dépôts, statut initial `depose`, tolérance de JSON corrompu) et vérifier qu'ils passent (`ng test`)
- [x] 1.3 Exposer sur le service les méthodes `creerDepot`, `listerDepots`, `rechercherDepots` (filtre numéro ou nom, insensible à la casse) et `getDepotById` ; compléter les tests unitaires de recherche (par numéro partiel, par nom partiel, aucun résultat) et vérifier qu'ils passent

## 2. Formulaire de création de dépôt

- [x] 2.1 Créer `DepotCreateComponent` (standalone) avec formulaire réactif : `FormGroup` client (`nom` requis non vide, `telephone` requis avec motif de téléphone acceptant espaces, points, parenthèses et 8 à 15 chiffres) + `FormArray` d'articles (`type` requis, `quantite` entier >= 1, `service` requis) ; messages d'erreur en français, sans emoji ; vérifier `ng build`
- [x] 2.2 Implémenter l'ajout/suppression dynamique d'articles dans le `FormArray` et la validation croisée (au moins un article valide requis) ; ajouter des tests de composant (formulaire invalide bloquant la soumission, soumission valide appelant le service, bouton d'ajout d'article) et vérifier qu'ils passent
- [x] 2.3 À la soumission valide, appeler `creerDepot`, rediriger vers `/depots/:id/ticket` et afficher une confirmation ; vérifier le comportement via le test de composant existant

## 3. Page ticket imprimable

- [x] 3.1 Créer `TicketComponent` (standalone, route `/depots/:id/ticket`) affichant numéro de ticket, date de dépôt, date de retrait prévue, statut, coordonnées du client figées et liste des articles ; afficher un message en français si l'id est inconnu ; vérifier `ng build`
- [x] 3.2 Ajouter les styles `@media print` (masquage de la navigation et des actions, mise en page ticket centrée sur papier) et un bouton « Imprimer » déclenchant `window.print()` ; vérifier visuellement via `ng serve` que la page de ticket est correcte à l'écran et en aperçu d'impression

## 4. Liste et recherche des dépôts

- [x] 4.1 Créer `DepotListComponent` (standalone, route `/depots`) listant les dépôts (numéro de ticket, nom du client, date de dépôt, date de retrait prévue, statut) avec champ de recherche liant `rechercherDepots` en réactivité ; afficher « Aucun dépôt trouvé » quand le résultat est vide ; vérifier `ng build`
- [x] 4.2 Ajouter un lien vers le ticket et un lien « Nouveau dépôt » vers `/depots/nouveau` ; écrire des tests de composant (affichage de la liste, filtrage par numéro, filtrage par nom, message de résultat vide) et vérifier qu'ils passent

## 5. Intégration et vérification finale

- [x] 5.1 Brancher les routes lazy de la feature dans `src/app/app.routes.ts` et ajouter un lien d'accès à `/depots` depuis l'écran racine ; vérifier `ng serve` : création d'un dépôt, impression du ticket, recherche dans la liste, rechargement de la page conservant les données
- [x] 5.2 Vérifier l'interface entièrement en français et l'absence totale d'emoji dans le code source et les textes (recherche `grep` sur `src/`), puis exécuter `ng build` et `ng test` sans erreur

## Workflow follow-up

- Archiver le changement après relecture (`openspec archive`).
