# Spec Delta

## MODIFIED Requirements

### Requirement: Liste et recherche des dépôts
Le système SHALL lister les dépôts existants et SHALL permettre de les rechercher par numéro de ticket ou par nom de client, sans tenir compte de la casse. Le système SHALL permettre de filtrer la liste par statut (déposé, en lavage, prêt, livré), en complément de la recherche. Le statut de chaque dépôt SHALL être affiché sous forme de badge coloré. Le tableau des dépôts SHALL rester lisible sur les petits écrans.

#### Scenario: Recherche par numéro de ticket
- **WHEN** l'utilisateur saisit un numéro de ticket partiel ou complet
- **THEN** seule la liste des dépôts dont le numéro correspond est affichée

#### Scenario: Recherche par nom de client
- **WHEN** l'utilisateur saisit un nom ou un fragment de nom de client
- **THEN** seule la liste des dépôts dont le nom du client correspond est affichée

#### Scenario: Aucun résultat
- **WHEN** la recherche ne correspond à aucun dépôt
- **THEN** un message indiquant qu'aucun dépôt n'a été trouvé est affiché

#### Scenario: Affichage du statut
- **WHEN** la liste des dépôts est affichée
- **THEN** le statut de chaque dépôt est présenté sous forme de badge coloré selon son statut

#### Scenario: Liste sur petit écran
- **WHEN** la liste des dépôts est affichée sur un écran de largeur réduite
- **THEN** le tableau reste lisible et la page ne déborde pas

#### Scenario: Filtre par statut
- **WHEN** l'utilisateur sélectionne un statut dans le filtre de la liste
- **THEN** seuls les dépôts dont le statut correspond sont affichés

#### Scenario: Filtre combiné à la recherche
- **WHEN** l'utilisateur combine un filtre par statut et une recherche par numéro ou nom
- **THEN** seuls les dépôts correspondant à la fois au filtre et à la recherche sont affichés

### Requirement: Modification de la date de retrait d'un dépôt existant
Le système SHALL permettre de modifier la date de retrait prévue d'un dépôt existant, depuis la liste des dépôts et depuis la page du ticket, uniquement si le dépôt n'est pas livré. Le système SHALL valider que la nouvelle date de retrait n'est pas antérieure à la date de dépôt du dépôt. Après modification, la date de retrait affichée sur la page du ticket imprimable SHALL être à jour.

#### Scenario: Modification depuis la liste des dépôts
- **WHEN** le réceptionniste modifie la date de retrait d'un dépôt depuis la liste des dépôts et confirme
- **THEN** la nouvelle date de retrait est enregistrée pour ce dépôt

#### Scenario: Modification depuis la page du ticket
- **WHEN** le réceptionniste modifie la date de retrait d'un dépôt depuis la page du ticket et confirme
- **THEN** la nouvelle date de retrait est enregistrée pour ce dépôt

#### Scenario: Date de retrait modifiée antérieure à la date de dépôt
- **WHEN** le réceptionniste tente de modifier la date de retrait d'un dépôt existant vers une date antérieure à la date de dépôt de ce dépôt
- **THEN** la modification est refusée avec un message d'erreur et la date de retrait reste inchangée

#### Scenario: Ticket imprimable à jour
- **WHEN** la date de retrait d'un dépôt a été modifiée puis que l'utilisateur ouvre ou réimprime la page du ticket de ce dépôt
- **THEN** le ticket affiche la date de retrait mise à jour

#### Scenario: Dépôt livré non modifiable
- **WHEN** le réceptionniste tente de modifier la date de retrait d'un dépôt dont le statut est « livré »
- **THEN** la modification n'est pas proposée et le dépôt reste inchangé

## ADDED Requirements

### Requirement: Circuit de statuts des dépôts
Le système SHALL gérer un circuit de statuts linéaire pour les dépôts : déposé, en lavage, prêt, livré. Un dépôt SHALL ne pouvoir avancer que d'une étape à la fois dans cet ordre, sans retour en arrière ni saut d'étape. Depuis la liste des dépôts et la page du ticket, un bouton SHALL permettre de passer à l'étape suivante, sauf pour un dépôt livré qui constitue un état final.

#### Scenario: Avancement d'une étape
- **WHEN** le réceptionniste active le bouton de passage à l'étape suivante sur un dépôt non livré
- **THEN** le statut du dépôt avance d'une étape dans le circuit (déposé → en lavage → prêt → livré)

#### Scenario: Dépôt livré sans bouton d'avancement
- **WHEN** le réceptionniste consulte un dépôt dont le statut est « livré »
- **THEN** aucun bouton de passage à l'étape suivante n'est proposé

#### Scenario: Dépôt créé en statut déposé
- **WHEN** un dépôt est créé
- **THEN** son statut initial est « déposé »

### Requirement: Enregistrement du retrait réel
Lorsqu'un dépôt passe au statut « livré », le système SHALL enregistrer automatiquement la date et l'heure réelles du retrait par le client. Cette date et heure SHALL être distinctes de la date de retrait prévue et SHALL être conservées pour affichage et impression.

#### Scenario: Passage à livré
- **WHEN** le statut d'un dépôt passe à « livré »
- **THEN** la date et l'heure réelles du retrait sont enregistrées sur le dépôt

#### Scenario: Affichage du retrait réel sur le ticket
- **WHEN** l'utilisateur consulte le ticket d'un dépôt livré
- **THEN** la date et l'heure réelles du retrait y sont affichées

### Requirement: Historique des changements de statut
Le système SHALL historiser chaque changement de statut d'un dépôt : ancien statut, nouveau statut, date et heure du changement. L'historique SHALL être affiché sur la page du ticket, du plus ancien au plus récent, et SHALL inclure le statut initial « déposé » au moment de la création.

#### Scenario: Historique après création
- **WHEN** un dépôt vient d'être créé
- **THEN** son historique contient une entrée « déposé » avec la date et l'heure de création

#### Scenario: Historique après un changement de statut
- **WHEN** le statut d'un dépôt avance d'une étape
- **THEN** une entrée est ajoutée à l'historique avec l'ancien statut, le nouveau statut et la date et heure du changement

#### Scenario: Affichage de l'historique sur le ticket
- **WHEN** l'utilisateur consulte la page du ticket d'un dépôt
- **THEN** l'historique des statuts y est affiché du plus ancien au plus récent

### Requirement: Compatibilité des dépôts existants
Le système SHALL lire les dépôts déjà enregistrés dans le localStorage sans rupture : un dépôt existant sans statut explicite ou avec le statut « déposé » SHALL être traité comme « déposé », et son historique SHALL être initialisé à vide ou à la seule entrée « déposé » le cas échéant. La lecture des dépôts existants SHALL rester sans erreur bloquante.

#### Scenario: Dépôt existant sans historique
- **WHEN** l'application lit un dépôt préexistant dans le localStorage qui ne contient pas d'historique de statut
- **THEN** ce dépôt est affiché avec le statut « déposé » et un historique vide ou initialisé

#### Scenario: Données existantes préservées
- **WHEN** l'application est rechargée après la mise à jour
- **THEN** les dépôts, clients et numéros de ticket existants restent disponibles et modifiables selon leur statut
