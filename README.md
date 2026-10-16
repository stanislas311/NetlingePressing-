# Netlinge Pressing

Application web de **gestion de pressing** (projet étudiant Angular 19, sans backend ni SSR). Données dans le `localStorage` du navigateur : chaque machine a ses propres données.

Lien prévu : [https://netlinge-pressing.vercel.app](https://netlinge-pressing.vercel.app) (à confirmer après import Vercel).

## Fonctionnalités

- Page d’accueil publique, connexion (gérant / réceptionniste)
- Dépôt multi-articles, ticket `DP-AAAAMMJJ-XXXX`, date de retrait modifiable
- Suivi de statut : déposé, en lavage, prêt, livré (une étape à la fois)
- Facturation : catalogue de tarifs, avance, solde, facture imprimable ; pas de livraison si solde restant
- Notifications internes et bouton WhatsApp (`wa.me`, Côte d’Ivoire +225) quand le linge est prêt
- Tableau de bord, annulation avec motif, page 404

## Technologies

Angular 19, TypeScript, CSS (charte Netlinge), OpenSpec, Jasmine/Karma.

## Lancer le projet

```bash
npm install
ng serve
```

Ouvrir [http://localhost:4200/](http://localhost:4200/).

```bash
npm run build
npx ng test --watch=false --browsers=ChromeHeadless
```

Sortie de production : `dist/netlinge-pressing/browser`.

## Identifiants de démonstration

Créés au premier lancement. Mots de passe hachés (SHA-256 + sel), jamais en clair.

| Rôle | Identifiant | Mot de passe |
| --- | --- | --- |
| Gérant | `gerant` | `NetlingeGerant2026` |
| Réceptionniste | `reception` | `NetlingeAccueil2026` |

## Déploiement Vercel (étape par étape)

1. Aller sur [https://vercel.com](https://vercel.com) et se connecter (compte GitHub).
2. **Add New Project** puis **Import** du dépôt `https://github.com/stanislas311/NetlingePressing-.git`.
3. Nom du projet : `netlinge-pressing` (URL du type `https://netlinge-pressing.vercel.app`).
4. Preset Angular. Commande de build : `npm run build`. Dossier de sortie : `dist/netlinge-pressing/browser`.
5. Le fichier `vercel.json` réécrit toutes les routes vers `index.html` (rechargement Angular).
6. Lancer le déploiement. Les données restent locales au navigateur du visiteur.

## Démarche OpenSpec

Chaque fonctionnalité a un changement dans `openspec/changes/` (proposal, design, tasks, specs) puis archivage dans `openspec/changes/archive/` et fusion dans `openspec/specs/`.
