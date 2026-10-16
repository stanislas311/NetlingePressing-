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

### Requirement: Persistance locale des dépôt
Le système SHALL persister les dépôts et les clients dans le localStorage du navigateur, de sorte que les données restent disponibles après un rechargement de la page. Aucune communication avec un serveur ne SHALL être effectuée. Les pages de création, de liste et de ticket des dépôts SHALL n'être accessibles qu'à une personne authentifiée.

#### Scenario: Rechargement de la page
- **WHEN** l'utilisateur recharge l'application après avoir créé des dépôts
- **THEN** les dépôts et tickets créés sont toujours disponibles dans la liste et consultables

#### Scenario: Stockage indisponible ou corrompu
- **WHEN** le localStorage est indisponible ou contient des données illisibles
- **THEN** l'application démarre avec une liste de dépôts vide sans erreur bloquante

#### Scenario: Accès aux dépôts sans session
- **WHEN** un visiteur non connecté tente d'ouvrir la liste, la création ou un ticket
- **THEN** il est redirigé vers la page de connexion

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

### Requirement: Annulation d'un dépôt
Le système SHALL permettre d'annuler un dépôt non livré avec un motif obligatoire, historisé.

#### Scenario: Motif obligatoire
- **WHEN** l'annulation est demandée sans motif
- **THEN** le dépôt reste inchangé
