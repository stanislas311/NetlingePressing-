# Proposal

## Why

L'application fonctionne mais l'interface est rudimentaire : styles dupliqués dans chaque composant, aucune variable CSS, polices par défaut du navigateur, couleurs hard-codées, et pas de composants réutilisables. Pour professionnaliser l'outil au guichet du pressing (écran, mobile, impression) et poser des bases évolutives (authentification future, nouveaux statuts), une refonte design complète est nécessaire sans toucher à la logique métier existante.

## What Changes

- Introduction d'un système de design : variables CSS globales (couleurs, typographie, espacements, rayons), polices Plus Jakarta Sans (titres) et Inter (texte) avec polices système de secours.
- Coquille d'application (app shell) : barre latérale de navigation fixe sur grand écran, transformée en menu supérieur repliable sur mobile, en-tête « Netlinge Pressing », zone utilisateur réservée à une future authentification.
- Composants Angular réutilisables : bouton (principal, secondaire, danger), champ de formulaire avec message d'erreur, carte, tableau responsive, badge de statut.
- Refonte des pages existantes avec ces composants : formulaire de dépôt, liste des dépôts avec recherche, page ticket.
- Ticket imprimable maintenu sobre et lisible, sans barre latérale à l'impression.
- Accessibilité : contrastes suffisants, focus visible, libellés associés aux champs.
- Interface entièrement en français, sans aucun emoji, icônes uniquement en SVG intégrés avec parcimonie.
- Aucune modification de la logique métier, des services, du modèle de données ou de la persistance.

## Capabilities

### New Capabilities

- `systeme-design`: Design system de l'application — jetons visuels (couleurs, typographie), coquille d'application avec navigation adaptative, composants UI réutilisables, règles d'accessibilité et d'iconographie.

### Modified Capabilities

- `depot-linge`: Les pages existantes affichent le statut via un badge coloré (au lieu de texte brut), le tableau de la liste s'adapte aux petits écrans, et le ticket imprimable reste sobre et sans chrome d'application à l'impression.

## Impact

- Code : `src/styles.css`, `src/index.html`, `src/app/app.component.*` (shell), nouveau dossier `src/app/systeme-design/` (composants partagés), `src/app/depot-linge/depot-create/`, `depot-list/`, `ticket/` (templates + CSS refonds).
- Modèle : `STATUT_LABELS` étendu si nécessaire pour alimenter le badge (libellés uniquement, pas de nouvelle logique de statut).
- Dépendances : aucune ajoutée (pas de bibliothèque UI tierce, polices via CDN Google Fonts).
- Tests : tests de composants existants à adapter aux nouveaux classes/sélecteurs ; comportement métier inchangé.
