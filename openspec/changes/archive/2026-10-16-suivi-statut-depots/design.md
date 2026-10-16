# Design

## Context

Voir proposal.md pour la motivation. Le dépôt courant est en statut `depose` unique ; le `DepotStoreService` gère la création, la recherche, la persistance localStorage et la modification de date de retrait. Les composants liste et ticket affichent le statut via `np-status-badge` (couleurs déjà prêtes : déposé, en lavage, prêt, livré). Les dépôts persistés n'ont ni historique ni date de retrait réelle.

## Goals / Non-Goals

**Goals:**

- Circuit de statuts linéaire déposé → en lavage → prêt → livré, une étape à la fois
- Bouton d'avancement sur liste et ticket, masqué sur dépôt livré
- Enregistrement automatique de la date/heure réelle du retrait au passage à livré
- Historique des changements (ancien, nouveau, date/heure) affiché sur le ticket
- Filtre par statut en complément de la recherche dans la liste
- Compatibilité ascendante des dépôts existants sans rupture de persistance

**Non-Goals:**

- Annulation ou retour en arrière de statut
- Notifications, e-mails ou interactions avec un serveur
- Multi-utilisateurs ou authentification
- Retard automatique calculé par rapport à la date de retrait prévue

## Decisions

- **Modèle `Depot`** : étendre `DepotStatut` avec `'en-lavage' | 'pret' | 'livre'` ; ajouter `dateRetraitReelle?: string` et `historiqueStatuts: DepotHistoriqueStatut[]` (type local `{ ancien: DepotStatut | null; nouveau: DepotStatut; date: string }`). Alternative : store séparé pour l'historique — rejetée car la donnée est propre au dépôt et la persistance unique reste localStorage.
- **Ordre des statuts** : constantes `STATUTS_ORDE: DepotStatut[] = ['depose', 'en-lavage', 'pret', 'livre']` et `STATUT_LABELS` étendu en français sans accent dans les clés (clés ASCII `depose`, `en-lavage`, `pret`, `livre` ; labels `Déposé`, `En lavage`, `Prêt`, `Livré`). Le badge existant normalise déjà les accents et espaces.
- **Transition** : méthode `DepotStoreService.passerAuStatutSuivant(depotId: string): Depot | null` qui vérifie le statut courant, refuse si `livre`, refuse les sauts/retours (index + 1 uniquement), enregistre `dateRetraitReelle` si cible `livre`, pousse une entrée d'historique, persiste. Alternative : machine à états externe — rejetée car trop lourd pour un localStorage local.
- **Migration des dépôts existants** : à la lecture (`listerDepots`/`getDepotById`), si `statut` manquant ou inconnu → `depose` ; si `historiqueStatuts` absent → `[ { ancien: null, nouveau: 'depose', date: dateDepot } ]`. Aucune écriture forcée au chargement pour éviter les erreurs de quota ; normalisation à la lecture et lors de la première mutation.
- **Blocage après livraison** : `modifierDateRetrait` refuse si `statut === 'livre'` ; le bouton d'avancement n'est pas rendu pour `livre` ; les composants masquent aussi l'édition de date sur dépôt livré.
- **Filtre par statut** : un `select` (ou boutons) dans le composant liste, en plus de l'input recherche ; logique de filtrage combinée côté composant ou service (`rechercherDepots` étendue avec un paramètre `statutFiltre?: DepotStatut`).

## Risks / Trade-offs

- [Données corrompues dans le localStorage] → Normalisation défensive à la lecture : statut inconnu → `depose`, historique absent → initialisé, pas d'erreur bloquante.
- [Historique trop volumineux] → Un dépôt a au maximum 4 entrées (création + 3 transitions) ; volume négligeable pour localStorage.
- [Double clic sur le bouton d'avancement] → Désactivation du bouton pendant le traitement ou vérification serveur-style côté service (idempotence : si le statut est déjà `livre`, ne rien faire).
- [Impression du ticket avec historique] → L'historique s'affiche dans le ticket imprimé ; les règles d'impression globales existantes masquent la navigation et les contrôles, pas le contenu du ticket.
