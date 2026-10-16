# Spec Delta

## ADDED Requirements

### Requirement: Catalogue et calcul de facture
Le système SHALL calculer le total d'un dépôt à partir du catalogue article x service. Le gérant SHALL pouvoir modifier les tarifs. Une avance et des paiements ultérieurs SHALL être historisés. Un dépôt SHALL ne pas passer à livré tant que le solde n'est pas nul. Une facture imprimable SHALL reprendre le ticket, les articles, le total, les paiements et le solde.

#### Scenario: Total à la création
- **WHEN** un dépôt est créé avec des articles tarifés
- **THEN** le montant total est enregistré

#### Scenario: Livraison refusée si solde
- **WHEN** le réceptionniste tente de passer un dépôt impayé à livré
- **THEN** le statut reste inchangé
