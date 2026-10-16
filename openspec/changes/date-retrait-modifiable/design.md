# Design

## Context

Le module `depot-linge` existe déjà : `DepotStoreService` (persistance localStorage), `DepotCreateComponent` (formulaire réactif), `DepotListComponent` (liste + recherche), `TicketComponent` (ticket imprimable). La date de retrait est aujourd'hui calculée automatiquement à la création (+48 h) et stockée dans `Depot.dateRetraitPrevue` (ISO). Aucune opération de mise à jour n'existe sur le service. Voir proposal.md pour la motivation.

## Goals / Non-Goals

**Goals:**

- Permettre au réceptionniste de choisir la date de retrait à la création, avec pré-remplissage +48 h et validation retrait >= dépôt.
- Permettre de modifier la date de retrait d'un dépôt existant depuis la liste et depuis la page ticket.
- Garantir que le ticket imprimable affiche toujours la date de retrait à jour.

**Non-Goals:**

- Modifier la date de dépôt (reste automatique).
- Ajouter d'autres champs modifiables sur un dépôt existant (client, articles, statut).
- Historiser les modifications de date ou journaliser qui a modifié quoi.

## Decisions

### 1. Validation de la date : comparaison au niveau jour

La validation « retrait >= dépôt » compare les dates au niveau calendrier (jour), pas au niveau timestamp horaire. Un retrait le même jour que le dépôt est accepté ; seul un jour strictement antérieur est refusé.

- *Rationale* : le formulaire de création utilise un `input type="date"` (granularité jour) ; comparer des timestamps plein aurait rejeté légitimement un retrait choisi le même jour.
- *Alternative rejetée* : comparer les timestamps ISO complets — trop strict pour un guichet.

### 2. Service : une opération unique `modifierDateRetrait`

Le `DepotStoreService` expose `modifierDateRetrait(depotId, nouvelleDateIso): Depot | null`. L'opération recharge le dépôt, applique la validation (retrait >= dépôt), persiste la mise à jour dans le localStorage et retourne le dépôt mis à jour (ou `null` si introuvable ou date invalide). La validation est portée par le service (source de vérité) et doublée côté formulaire pour l'UX.

- *Rationale* : centraliser la règle métier dans le service garantit que la liste et le ticket passent par la même logique ; le formulaire n'est qu'une couche de confort.
- *Alternative rejetée* : dupliquer la logique dans chaque composant — risque de divergence.

### 3. Date de retrait : stockage ISO, saisie `YYYY-MM-DD`

La date choisie dans l'interface (`input type="date"`, format `YYYY-MM-DD`) est convertie en ISO avant stockage, à la même heure que la date de dépôt du dépôt concerné (pour un dépôt existant) ou à l'heure de création (pour un nouveau dépôt). La validation de non-antériorité est effectuée sur la partie jour.

- *Rationale* : `Intl.DateTimeFormat('fr-FR')` restitue correctement la date quelle que soit la timezone locale ; la granularité heure est conservée pour ne pas casser l'affichage existant.

### 4. UI : même pattern de modification aux deux empoints

- **Liste** : chaque ligne de dépôt gagne une action « Modifier la date de retrait » qui ouvre un `input type="date"` pré-rempli avec la date courante, avec confirmation.
- **Ticket** : la page ticket gagne un bouton « Modifier la date de retrait » qui bascule un `input type="date"` + bouton Enregistrer ; après enregistrement, le composant recharge le dépôt depuis le service pour réafficher la valeur à jour.

Le même composant/mécanisme de validation (date >= dateDepot) est partagé, idéalement via une petite fonction utilitaire ou un validateur réutilisable.

### 5. Migration des données

Aucune migration : les dépôts existants dans le localStorage ont déjà un `dateRetraitPrevue` valide ; le nouveau comportement ne fait que rendre ce champ modifiable.

## Risks / Trade-offs

- [Comparaison de dates en timezone différente] → Les dates sont stockées en ISO (UTC) mais saisies/affichées en local ; la comparaison jour utilise la timezone locale de l'utilisateur, ce qui peut différer si le navigateur change de timezone entre deux sessions. Impact marginal pour un poste unique de pressing.
- [Double validation (formulaire + service) peut diverger] → La règle est simple (>=) ; les tests unitaires couvrent les deux couches pour détecter toute divergence.
- [Concurrence multi-onglets sur le même dépôt] → Dernière écriture gagnante, comme déjà le cas pour la création. Acceptable pour un poste unique.
