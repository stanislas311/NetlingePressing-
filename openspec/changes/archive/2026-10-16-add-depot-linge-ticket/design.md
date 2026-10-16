# Design

## Context

Projet Angular 19 initialisé à vide : uniquement le composant racine, des routes et une config d'application (`src/app/app.routes.ts`, `app.config.ts`). Aucune capacité métier, aucune spécification existante. Contraintes imposées par la demande : aucun backend (persistance localStorage), composants standalone, formulaires réactifs avec validation, interface en français, aucun emoji. Voir proposal.md pour la motivation.

## Goals / Non-Goals

**Goals:**

- Fournir le flux complet dépôt de linge : client, articles, ticket imprimable, liste/recherche.
- Poser une architecture modulaire (feature folder, service de persistance dédié) réutilisable pour les futures fonctionnalités du pressing.
- Garantir la persistance locale et la reprise des données après rechargement.

**Non-Goals:**

- Gestion des statuts ultérieurs du dépôt (en lavage, prêt, remis) au-delà du statut initial `déposé`.
- Gestion des tarifs, paiements, facturation ou notifications.
- Synchronisation multi-appareils, comptes utilisateurs ou authentification.
- Export/impression PDF côté serveur (l'impression utilise l'impression native du navigateur).

## Decisions

### 1. Organisation du code : feature folder `depot-linge/`

Nouveau dossier `src/app/depot-linge/` contenant les composants standalone, les modèles, le service et les routes de la feature, avec des routes lazy via `loadComponent` / `loadChildren` dans `app.routes.ts`.

- *Alternative rejetée* : tout dans `app/` à plat — deviendra ingérable dès la deuxième feature.
- *Alternative rejetée* : module NgModules — l'application est standalone, NgModules ajouteraient de la friction sans bénéfice.

### 2. Persistance : `DepotStoreService` unique (localStorage)

Un service injectable (`providedIn: 'root'`) est la seule porte d'accès au localStorage. Il expose des opérations CRUD sur les dépôts et les clients, sérialise en JSON sous des clés préfixées (p. ex. `netlinge.deposits`, `netlinge.customers`, `netlinge.ticketCounter`). L'UI ne touche jamais directement au localStorage.

- Lecture paresseuse au premier accès, écriture immédiate à chaque mutation.
- En cas de JSON illisible ou d'exception (mode privé, quota), le service retourne des tableaux vides et repart à zéro — jamais d'erreur bloquante pour l'utilisateur (cf. spec « Stockage indisponible ou corrompu »).

### 3. Numéro de ticket : format lisible et séquentiel

Format `DP-AAAAMMJJ-XXXX` (p. ex. `DP-20261016-0001`) : préfixe `DP`, date de création, séquence sur 4 chiffres incrémentée et persistée par le service. La date dans le numéro rend le ticket lisible pour le personnel ; la séquence garantit l'unicité même pour plusieurs dépôts le même jour.

- *Alternative rejetée* : UUID — non lisible pour l'accueil.
- *Alternative rejetée* : timestamp seul — moins lisible et collision possible à la même milliseconde.

### 4. Formulaires réactifs imbriqués

Formulaire de création en deux zones dans un seul `FormGroup` : infos client (`nom`, `telephone`) et tableau dynamique d'articles (`FormArray` de `FormGroup` avec `type`, `quantite`, `service`). Validation croisée : dépôt valide si client valide et `FormArray` non vide avec au moins un article valide. Messages d'erreur en français, sans emoji.

### 5. Date de retrait prévue

Calculée à la création du dépôt : date de dépôt + délai fixe de 48 heures (valeur constante nommée, ajustable facilement). Stockée sur le dépôt à la création (jamais recalculée à l'affichage) pour que le ticket reste stable.

- *Note* : délai de 48 h choisi par défaut faute d'exigence métier explicite — isolé dans une constante pour qu'un changement soit un one-liner.

### 6. Pages et routes

| Route | Composant | Rôle |
|---|---|---|
| `/depots` | `DepotListComponent` | Liste + recherche (numéro ou nom) |
| `/depots/nouveau` | `DepotCreateComponent` | Formulaire client + articles, création, redirection vers le ticket |
| `/depots/:id/ticket` | `TicketComponent` | Ticket imprimable (`@media print`) |

L'impression s'appuie sur des styles `@media print` (masquage de la navigation et des actions, mise en page ticket centrée) ; pas de librairie tierce.

### 7. Modèle de données

```ts
interface DepotArticle { type: string; quantite: number; service: string; }
interface Client { id: string; nom: string; telephone: string; }
interface Depot {
  id: string;
  ticketNumero: string;
  clientId: string;
  clientNom: string;      // figé au moment du dépôt
  clientTelephone: string; // figé au moment du dépôt
  articles: DepotArticle[];
  statut: 'depose';       // étendu plus tard
  dateDepot: string;      // ISO
  dateRetraitPrevue: string; // ISO
}
```

Le nom/téléphone sont dupliqués sur le dépôt (figés) pour que l'historique et les tickets restent stables même si le client est par la suite modifié — accepté comme duplication assumée en l'absence de base relationnelle.

## Risks / Trade-offs

- [localStorage limité à ~5 Mo et par-origin] → Suffisant pour un pressing local ; le service isole la persistance pour permettre plus tard un basculement vers une API sans toucher l'UI.
- [Données perdues si l'utilisateur vide les données du navigateur] → Hors périmètre ; pas de sauvegarde externe dans ce changement.
- [Duplication client/dépot] → Figé volontairement ; une éventuelle feature « fiche client » devra distinguer contact actuel et historique.
- [Concurrence multi-onglets] → Dernière écriture gagnante ; acceptable pour un poste unique de pressing.

## Open Questions

- Délai de retrait prévoyé (48 h par défaut) : à confirmer avec le métier, mais ne change ni le périmètre ni les tâches (constante isolée).
