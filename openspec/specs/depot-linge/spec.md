# depot-linge Specification

## Purpose

Permet au pressing d'enregistrer les dépôts de linge de ses clients, de générer un ticket justificatif imprimable et de retrouver un dépôt existant par numéro de ticket ou par nom de client, avec persistance locale dans le navigateur.

## Requirements

### Requirement: Enregistrement d'un client
Le système SHALL permettre d'enregistrer un client avec un nom et un numéro de téléphone, et SHALL exiger ces deux informations avant de permettre la création d'un dépôt.

#### Scenario: Client valide
- **WHEN** l'utilisateur saisit un nom et un numéro de téléphone valides puis valide le formulaire
- **THEN** le client est enregistré et associé au dépôt en cours de création

#### Scenario: Informations manquantes ou invalides
- **WHEN** le nom ou le numéro de téléphone est absent ou invalide
- **THEN** le formulaire signale les erreurs et la création du dépôt est bloquée

### Requirement: Saisie d'un dépôt multi-articles
Le système SHALL permettre de saisir un dépôt composé d'au moins un article, chaque article comportant un type d'article, une quantité et un service demandé. Le système SHALL exiger au moins un article complet pour créer le dépôt.

#### Scenario: Dépôt avec plusieurs articles
- **WHEN** l'utilisateur ajoute plusieurs articles avec type, quantité et service valides, puis valide
- **THEN** le dépôt est enregistré avec l'ensemble des articles saisis

#### Scenario: Aucun article valide
- **WHEN** le dépôt ne contient aucun article dont les champs sont tous valides
- **THEN** la création du dépôt est bloquée avec un message d'erreur

#### Scenario: Quantité invalide
- **WHEN** la quantité d'un article est nulle, négative ou non numérique
- **THEN** l'article est considéré comme invalide et empêche la création du dépôt si aucun autre article valide n'existe

### Requirement: Génération du ticket
Le système SHALL générer automatiquement pour chaque dépôt créé un ticket comportant un numéro unique lisible, la date de dépôt (automatique, date du jour) et la date de retrait prévue. La date de retrait prévue SHALL être pré-remplie à la date de dépôt + 48 heures et SHALL être modifiable par le réceptionniste dans le formulaire de création. Le système SHALL valider que la date de retrait choisie n'est pas antérieure à la date de dépôt. Chaque dépôt SHALL être créé avec le statut initial `déposé`.

#### Scenario: Création d'un dépôt
- **WHEN** un dépôt valide est créé
- **THEN** un numéro de ticket unique lui est attribué, la date de dépôt est celle du jour, la date de retrait prévue est la date de dépôt + 48 heures (sauf si modifiée par le réceptionniste) et le statut est `déposé`

#### Scenario: Création d'un dépôt avec date de retrait modifiée
- **WHEN** le réceptionniste modifie la date de retrait prévue dans le formulaire de création puis valide un dépôt valide
- **THEN** le ticket est créé avec la date de retrait choisie par le réceptionniste

#### Scenario: Date de retrait antérieure à la date de dépôt
- **WHEN** le réceptionniste saisit une date de retrait antérieure à la date de dépôt
- **THEN** le formulaire signale l'erreur et la création du dépôt est bloquée

#### Scenario: Unicité des numéros
- **WHEN** plusieurs dépôts sont créés successivement
- **THEN** chaque ticket possède un numéro différent de tous les numéros précédemment générés

### Requirement: Affichage imprimable du ticket
Le système SHALL proposer une page dédiée affichant le ticket du dépôt, mise en forme pour l'impression papier, reprenant le numéro de ticket, la date de dépôt, la date de retrait prévue, le statut, les informations du client et la liste des articles. À l'impression, seules les informations du ticket SHALL être imprimées, dans une mise en page sobre et lisible, sans barre de navigation ni contrôles d'application.

#### Scenario: Ouverture de la page ticket
- **WHEN** l'utilisateur ouvre la page du ticket d'un dépôt existant
- **THEN** le ticket complet y est affiché dans une mise en page adaptée à l'impression

#### Scenario: Impression du ticket
- **WHEN** l'utilisateur imprime la page du ticket
- **THEN** le papier contient uniquement le ticket sobre et lisible, sans navigation ni boutons de l'application

### Requirement: Liste et recherche des dépôts
Le système SHALL lister les dépôts existants et SHALL permettre de les rechercher par numéro de ticket ou par nom de client, sans tenir compte de la casse. Le statut de chaque dépôt SHALL être affiché sous forme de badge coloré. Le tableau des dépôts SHALL rester lisible sur les petits écrans.

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

### Requirement: Persistance locale des dépôt
Le système SHALL persister les dépôts et les clients dans le localStorage du navigateur, de sorte que les données restent disponibles après un rechargement de la page. Aucune communication avec un serveur ne SHALL être effectuée.

#### Scenario: Rechargement de la page
- **WHEN** l'utilisateur recharge l'application après avoir créé des dépôts
- **THEN** les dépôts et tickets créés sont toujours disponibles dans la liste et consultables

#### Scenario: Stockage indisponible ou corrompu
- **WHEN** le localStorage est indisponible ou contient des données illisibles
- **THEN** l'application démarre avec une liste de dépôts vide sans erreur bloquante

### Requirement: Modification de la date de retrait d'un dépôt existant
Le système SHALL permettre de modifier la date de retrait prévue d'un dépôt existant, depuis la liste des dépôts et depuis la page du ticket. Le système SHALL valider que la nouvelle date de retrait n'est pas antérieure à la date de dépôt du dépôt. Après modification, la date de retrait affichée sur la page du ticket imprimable SHALL être à jour.

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
