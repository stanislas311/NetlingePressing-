# Spec Delta

## ADDED Requirements

### Requirement: Page d'accueil publique
Le système SHALL afficher une page d'accueil publique pour Netlinge Pressing, accessible sans connexion, comprenant un bandeau avec appel à l'action, une présentation des services, les étapes du service (dépôt, lavage, prêt, retrait), une section de tarifs indicatifs, les coordonnées du pressing et un accès à la connexion.

#### Scenario: Visiteur sur la page d'accueil
- **WHEN** un visiteur ouvre la racine de l'application
- **THEN** la vitrine Netlinge Pressing est affichée avec un bouton Connexion

#### Scenario: Accès à la connexion
- **WHEN** le visiteur active Connexion
- **THEN** la page de connexion s'affiche
