# Spec Delta

## MODIFIED Requirements

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
