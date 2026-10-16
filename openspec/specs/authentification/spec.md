# authentification Specification

## Purpose
TBD - created by archiving change accueil-authentification. Update Purpose after archive.

## Requirements

### Requirement: Comptes et hachage des mots de passe
Le système SHALL stocker les comptes dans le localStorage. Les mots de passe SHALL être hachés avec SHA-256 et un sel aléatoire. Le système SHALL ne jamais persister un mot de passe en clair. Au premier lancement, le système SHALL créer un compte gérant et un compte réceptionniste de démonstration.

#### Scenario: Premier lancement
- **WHEN** l'application démarre sans aucun compte enregistré
- **THEN** un compte gérant et un compte réceptionniste de démonstration sont créés

#### Scenario: Mot de passe non stocké en clair
- **WHEN** un compte est enregistré
- **THEN** le localStorage contient une empreinte et un sel, et ne contient pas le mot de passe en clair

### Requirement: Connexion, déconnexion et session
Le système SHALL permettre de se connecter avec un identifiant et un mot de passe, de se déconnecter, et SHALL rétablir la session après un rechargement de la page tant que la session est présente.

#### Scenario: Connexion réussie
- **WHEN** l'utilisateur saisit un identifiant et un mot de passe valides
- **THEN** il est connecté et redirigé vers la gestion des dépôts

#### Scenario: Identifiants invalides
- **WHEN** l'identifiant ou le mot de passe est incorrect
- **THEN** un message d'erreur en français est affiché et aucune session n'est créée

#### Scenario: Persistance de session
- **WHEN** un utilisateur connecté recharge la page
- **THEN** il reste connecté avec le même nom et le même rôle

#### Scenario: Déconnexion
- **WHEN** l'utilisateur active la déconnexion
- **THEN** la session est effacée et les pages de gestion ne sont plus accessibles

### Requirement: Protection des pages de gestion
Le système SHALL refuser l'accès aux pages de gestion (dépôts, ticket, personnel) aux visiteurs non connectés et SHALL les rediriger vers la page de connexion.

#### Scenario: Accès anonyme aux dépôts
- **WHEN** un visiteur non connecté ouvre une URL de gestion
- **THEN** il est redirigé vers la page de connexion

### Requirement: Rôles gérant et réceptionniste
Le système SHALL distinguer les rôles GERANT et RECEPTIONNISTE. Seul le gérant SHALL pouvoir gérer les comptes du personnel. L'en-tête SHALL afficher le nom et le rôle de la personne connectée.

#### Scenario: Affichage de l'identité
- **WHEN** un utilisateur est connecté
- **THEN** l'en-tête affiche son nom, son rôle et un bouton de déconnexion

#### Scenario: Gestion du personnel réservée au gérant
- **WHEN** un réceptionniste tente d'ouvrir la page du personnel
- **THEN** l'accès est refusé
