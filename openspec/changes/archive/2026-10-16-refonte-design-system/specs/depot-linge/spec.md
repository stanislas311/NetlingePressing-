# Spec Delta

## MODIFIED Requirements

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
