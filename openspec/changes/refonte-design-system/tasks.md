# Tasks

## 1. Jetons et fondations globales

- [x] 1.1 Définir les variables CSS globales dans `src/styles.css` (couleurs du thème, polices avec fallbacks système, rayons, espacements, ombres, couleurs de statut) et vérifier qu'un composant existant peut les référencer via `var(--…)` (`ng build`)
- [x] 1.2 Ajouter le chargement des polices Plus Jakarta Sans et Inter dans `src/index.html` et appliquer la typographie de base (body, titres) dans `styles.css` ; vérifier le rendu des polices et leurs fallbacks (`ng serve`)
- [x] 1.3 Écrire les règles d'impression globales dans `styles.css` (masquage de la navigation et de l'en-tête à l'impression, règle `@page`) et vérifier que l'impression d'une page ne montre pas le chrome d'application

## 2. Composants du design system

- [x] 2.1 Créer `NpButtonComponent` (`src/app/systeme-design/np-button/`) avec variantes principal/secondaire/danger et support de `disabled` ; écrire les tests ( rendu de chaque variante, état désactivé) et vérifier qu'ils passent (`ng test`)
- [x] 2.2 Créer `NpFormFieldComponent` (`src/app/systeme-design/np-form-field/`) avec libellé associé (`label for`/`id`), projection du contrôle et affichage du message d'erreur français ; écrire les tests (association label-champ, affichage/masquage de l'erreur) et vérifier qu'ils passent
- [x] 2.3 Créer `NpCardComponent` (`src/app/systeme-design/np-card/`) ; écrire son test (projection du contenu) et vérifier qu'il passe
- [x] 2.4 Créer `NpTableComponent` (`src/app/systeme-design/np-table/`) avec conteneur à défilement horizontal accessible (région focusable avec libellé) ; écrire les tests (projection du tableau, présence de la région de défilement) et vérifier qu'ils passent
- [x] 2.5 Créer `NpStatusBadgeComponent` (`src/app/systeme-design/np-status-badge/`) avec mapping statut→couleur (déposé gris, en lavage bleu, prêt vert, livré sombre, retard rouge, inconnu neutre) ; écrire les tests (classe de couleur par statut, repli neutre) et vérifier qu'ils passent

## 3. Coquille d'application

- [x] 3.1 Refondre `AppComponent` en coquille : en-tête avec « Netlinge Pressing », zone utilisateur réservée non fonctionnelle, navigation latérale fixe ≥ 900px ; vérifier le rendu desktop et mobile (`ng serve`)
- [x] 3.2 Implémenter le menu mobile repliable (bouton avec `aria-expanded`/`aria-controls`, bascule de l'état `menuOuvert`) et l'intégration de la page d'accueil dans la zone principale ; écrire les tests (bascule du menu, attributs ARIA, affichage de la page d'accueil) et vérifier qu'ils passent

## 4. Page formulaire de dépôt

- [x] 4.1 Refondre le template de `DepotCreateComponent` avec les composants du design system (boutons, champs de formulaire, cartes pour les sections) ; vérifier `ng build` et l'aspect visuel (`ng serve`)
- [x] 4.2 Adapter les tests de `DepotCreateComponent` aux nouveaux sélecteurs/composants en conservant tous les scénarios métier (pré-remplissage +48 h, date antérieure bloquée, date transmise à la soumission) et vérifier qu'ils passent

## 5. Page liste des dépôts

- [x] 5.1 Refondre `DepotListComponent` : tableau dans `NpTableComponent`, statut en `NpStatusBadgeComponent`, recherche et actions avec les composants partagés ; vérifier `ng build` et le rendu responsive sur petit écran (`ng serve`)
- [x] 5.2 Adapter les tests de `DepotListComponent` (recherche, badge de statut, édition de date réussie/refusée) et vérifier qu'ils passent

## 6. Page ticket

- [x] 6.1 Refondre `TicketComponent` : ticket dans une carte, statut en badge, zone de modification et actions avec les composants du design system ; vérifier `ng build` et l'impression sobre sans chrome d'application (`ng serve` + aperçu d'impression)
- [x] 6.2 Adapter les tests de `TicketComponent` (affichage, modification de date, date antérieure refusée) et vérifier qu'ils passent

## 7. Vérification finale

- [x] 7.1 Exécuter `ng build` et `ng test` sans erreur
- [x] 7.2 Vérifier l'absence d'emoji et l'interface en français dans `src/` (recherche de caractères Unicode emoji et de chaînes UI non françaises) et vérifier l'accessibilité de base (focus visible au clavier, contrastes de la palette, libellés sur les champs)

## Workflow follow-up

- Archiver le changement après relecture (`openspec archive`).
