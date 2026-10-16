# Spec Delta

## MODIFIED Requirements

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

## ADDED Requirements

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
