# Netlinge Pressing

Application web de gestion de pressing (sujet étudiant) : dépôt de linge avec ticket, suivi de statut, facturation et notifications. Projet Angular 19 (composants standalone, CSS, sans SSR, sans backend). Toutes les données sont stockées dans le `localStorage` du navigateur : chaque machine et chaque navigateur a ses propres données.

## Fonctionnalités

- Enregistrement d’un client et d’un dépôt multi-articles
- Ticket imprimable au format `DP-AAAAMMJJ-XXXX`
- Date de retrait prévue (préremplie à +48 h, modifiable)
- Suivi de statut : déposé, en lavage, prêt, livré (une étape à la fois, historisé)
- Page d’accueil publique et authentification locale (gérant / réceptionniste)
- Gestion des comptes du personnel par le gérant

## Technologies

Angular 19, TypeScript, CSS (système de design Netlinge), OpenSpec (développement piloté par les spécifications), tests Jasmine/Karma.

## Lancer le projet

```bash
npm install
ng serve
```

Ouvrir [http://localhost:4200/](http://localhost:4200/).

Build de production :

```bash
npm run build
```

Le dossier de sortie est `dist/netlinge-pressing/browser`.

Tests :

```bash
npx ng test --watch=false --browsers=ChromeHeadless
```

## Identifiants de démonstration

Créés automatiquement au premier lancement (mots de passe hachés SHA-256 avec sel, jamais stockés en clair) :

| Rôle | Identifiant | Mot de passe |
| --- | --- | --- |
| Gérant | `gerant` | `NetlingeGerant2026` |
| Réceptionniste | `reception` | `NetlingeAccueil2026` |

## Déploiement

Le fichier `vercel.json` configure le build Angular et une réécriture vers `index.html` pour les routes. Lien prévu : https://netlinge-pressing.vercel.app (à compléter après le premier déploiement).

Marche à suivre Vercel : New Project, import du dépôt GitHub `stanislas311/NetlingePressing-`, nom de projet `netlinge-pressing`, commande `npm run build`, dossier `dist/netlinge-pressing/browser`.

## Démarche OpenSpec

Chaque fonctionnalité suit le cycle proposer / implémenter / archiver dans `openspec/changes/` puis fusion des exigences dans `openspec/specs/`. Les changements déjà archivés couvrent le dépôt de linge, la date de retrait, le système de design et le suivi de statut.
