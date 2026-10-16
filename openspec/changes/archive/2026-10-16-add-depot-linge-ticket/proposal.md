# Proposal

## Why

L'application Angular de gestion de pressing ne couvre aucun processus métier pour l'instant (projet initialisé à vide). Le premier flux essentiel est l'enregistrement des dépôts de linge clients : sans module de dépôt et de ticket, le pressing ne peut ni tracer les articles reçus, ni remettre un justificatif au client, ni retrouver un dépôt existant.

## What Changes

- Ajout du module de dépôt de linge avec ticket, entièrement côté client (aucun backend), persisté dans le localStorage.
- Enregistrement d'un client (nom, téléphone) lié à un dépôt.
- Saisie d'un dépôt composé de plusieurs articles (type d'article, quantité, service demandé).
- Génération d'un ticket avec numéro unique lisible, date de dépôt et date de retrait prévue.
- Affichage du ticket sur une page imprimable (mise en page dédiée à l'impression).
- Liste des dépôts existants avec recherche par numéro de ticket ou par nom de client.
- Chaque dépôt est créé avec le statut initial `déposé`.
- UI entièrement en français, sans emoji, composants standalone, formulaires réactifs avec validation, service dédié pour la persistance.

## Capabilities

### New Capabilities

- `depot-linge`: Enregistrement des dépôts de linge (client, articles, statut), génération et affichage imprimable du ticket, liste et recherche des dépôts.

### Modified Capabilities

<!-- Aucune capacité existante n'est modifiée (projet sans specs existantes). -->

## Impact

- Code : nouveau feature module côté client dans `src/app` (composants standalone, routes dédiées, service de persistance, modèles de données, styles d'impression).
- Dépendances : aucune ajoutée (Angular 19, `@angular/forms` déjà présents ; localStorage natif du navigateur).
- Données : persistance locale dans le localStorage (pas d'API, pas de base de données).
- Systèmes : aucun service externe affecté.
