# Design

## Context

Application Angular 19 standalone, CSS plat par composant, sans variables CSS ni composants partagés. Les styles (boutons, champs, cartes, tableaux) sont dupliqués dans `depot-create`, `depot-list` et `ticket` avec les mêmes noms de classes. `src/styles.css` est quasi vide (une seule règle d'impression). Aucune police custom, aucune bibliothèque UI. Le modèle `DepotStatut` ne définit aujourd'hui que `'depose'`. Voir proposal.md pour la motivation.

## Goals / Non-Goals

**Goals:**

- Poser un design system complet (jetons + composants + coquille) sans nouvelle dépendance.
- Refondre les trois pages existantes avec les composants partagés, sans régression fonctionnelle.
- Préserver l'impression du ticket et la persistance localStorage inchangées.

**Non-Goals:**

- Ajouter de nouvelles valeurs de statut métier ou une logique de calcul de retard (seules les couleurs du badge sont prêtes à les accueillir).
- Implémenter l'authentification (seule une zone réservée est créée).
- Changer le routage, les services, le modèle de données ou la persistance.
- Migrer vers SCSS, Tailwind ou Angular Material.

## Decisions

### 1. Jetons : variables CSS globales dans `src/styles.css`

Toutes les couleurs, polices, rayons et espacements sont définis en variables CSS sur `:root` dans `src/styles.css` (fichier global déjà présent, aucun réglage de build à changer).

- *Rationale* : zéro dépendance, zéro configuration, accessible partout via `var(--…)`, y compris dans les composants standalone.
- *Alternative rejetée* : SCSS (nécessite de modifier `angular.json` et d'introduire un préprocesseur pour un gain limité).

### 2. Polices : Google Fonts via `<link>` + fallbacks système

`index.html` charge Plus Jakarta Sans (600/700) et Inter (400/500/600) via Google Fonts ; chaque `font-family` se termine par une pile système (`system-ui, sans-serif`). Hors ligne, les fallbacks prennent le relais sans erreur.

- *Rationale* : le projet n'a aucun pipeline d'assets ; un `<link>` est la voie la plus simple avec secours système demandé.
- *Alternative rejetée* : auto-héberger les fichiers (dossier `public/fonts`) — plus lourd, différé tant que le CDN suffit.

### 3. Composants partagés : dossier `src/app/systeme-design/`, standalone, CSS par composant

Composants inputs/sorties minimalistes, tous standalone :

- `NpButtonComponent` : `@Input() variant: 'principal' | 'secondaire' | 'danger' = 'principal'`, `@Input() disabled`, projection du contenu (bouton natif). Émet les événements natifs via l'élément hébergé.
- `NpFormFieldComponent` : `@Input() label`, `@Input() erreur?` (message français), `@Input() id` ; projette le ng-content du contrôle dans un wrapper avec `<label for>`.
- `NpCardComponent` : conteneur surface blanche (ng-content).
- `NpTableComponent` : wrapper tableau + conteneur à défilement horizontal (`overflow-x: auto`) pour le responsive.
- `NpStatusBadgeComponent` : `@Input() statut: string` ; map interne `statut → classe couleur` (`depose → gris`, `en-lavage → bleu`, `pret → vert`, `livre → sombre`, `retard → rouge`, inconnu → neutre).

Préfixe `Np` (Netlinge Pressing) pour éviter les collisions de sélecteurs. Pas de `shared/` générique : le dossier porte le nom de la capacité `systeme-design`.

- *Rationale* : des composants (pas seulement des classes CSS) portent la logique de mapping du badge et le contrat label/erreur du champ, testables unitairement.
- *Alternative rejetée* : kit de classes CSS pures uniquement — le badge de statut et le champ avec erreur gagnent à être des composants typés et testés.

### 4. Coquille : layout CSS Grid dans `AppComponent`, bascule à 900px

`app.component.html` devient la coquille : `<header>` (marque + zone utilisateur réservée), `<nav>` latérale, `<main><router-outlet></router-outlet></main>`.

- Écrans ≥ 900px : grid `auto 1fr` avec colonne de navigation fixe (240px) à gauche.
- Écrans < 900px : navigation en barre repliée sous l'en-tête, toggled par un bouton hamburger (état `menuOuvert` dans le composant, `aria-expanded`, `aria-controls`).
- Zone utilisateur : bouton/empreinte visuelle non cliquable avec `aria-disabled` et un titre explicite (« Connexion à venir »).
- La page d'accueil (`estAccueil`) est intégrée dans `<main>` et restylée.

- *Rationale* : un seul composant porte la coquille, pas de dépendance de routing supplémentaire ; le breakpoint 900px sépare clairement guichet/desktop et mobile.
- *Alternative rejetée* : Angular CDK Layout pour la bascule — dépendance supplémentaire pour un simple toggle.

### 5. Tableau responsive : défilement horizontal préservant la sémantique `<table>`

`NpTableComponent` enveloppe le tableau dans un conteneur `overflow-x: auto` avec tabindex/`role="region"` et `aria-label` pour rendre le défilement atteignable au clavier.

- *Rationale* : conserve la sémantique et les tests existants, effort minimal.
- *Alternative rejetée* : empilement en cartes sur mobile — plus joli mais réécrit la structure DOM et casse les tests de tableau existants sans valeur métier.

### 6. Impression : règles `@media print` centralisées sur la coquille + ticket

`styles.css` masque la navigation, l'en-tête et les zones non imprimables ; le composant ticket conserve ses règles locales (zone de modification et actions masquées, ticket plein cadre). Ajout d'une règle `@page` (marges raisonnables).

- *Rationale* : le ticket reste sobre ; les autres pages (liste, formulaire) n'impriment plus le chrome d'application.
- *Alternative rejetée* : feuille de style d'impression dédiée dans `public/` — un fichier global suffit vu la taille de l'app.

### 7. Icônes : SVG inline dans les templates, usage parcimonieux

Quelques icônes uniquement (menu hamburger, recherche éventuelle) codées en `<svg>` inline dans les templates, `aria-hidden="true"` quand l'icône est décorative. Aucune bibliothèque d'icônes.

### 8. Statuts : extension des libellés sans logique métier

`STATUT_LABELS` et `DepotStatut` restent tels quels (uniquement `depose`) — le badge accepte `statut: string` et le mapping de couleurs est déclaré côté composant, prêt pour de futures valeurs sans changer le modèle. Aucune donnée existante n'est affectée.

### 9. Tests : adapter les specs existants + tests des nouveaux composants

Les specs de composants (`depot-create`, `depot-list`, `ticket`) sont mises à jour pour les nouveaux sélecteurs et l'usage des composants partagés ; chaque composant du design system reçoit ses propres tests (variantes de bouton, affichage de l'erreur du champ, classe du badge par statut). Les tests métier (validation de date, persistance, recherche) sont conservés à l'identique sur le plan des scénarios.

## Risks / Trade-offs

- [Budgétaire CSS par composant en build prod (8 kB erreur)] → jetons globaux + CSS de composants maintenus minces ; surveillance via le build.
- [CDN Google Fonts indisponible] → pile de fallback système ; l'app reste pleinement utilisable.
- [Changement de sélecteurs casse les tests existants] → mise à jour des specs dans les mêmes tâches que la refonte de chaque page ; `ng test` exécuté à la fin.
- [Refonte visuelle casse discrètement un scénario métier] → aucun changement de service/modèle ; les tests métier existants servent de filet de sécurité.
- [Palette de statuts sans statuts derrière] → mapping côté composant, aucun effet sur le modèle ; documenté comme prêt pour l'avenir.

## Migration Plan

Aucune migration de données (localStorage inchangé). Déploiement en une fois : refonte visuelle atomique par page. Rollback : révision git (aucune donnée utilisateur en jeu).

## Open Questions

- Rien de bloquant : l'authentification future se contentera de remplacer la zone réservée de la coquille.
