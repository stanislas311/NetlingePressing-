# Proposal

## Why

L'application n'a pas encore de vitrine publique ni de contrôle d'accès. N'importe qui peut ouvrir les pages de gestion. Le pressing a besoin d'une page d'accueil soignée pour présenter Netlinge Pressing, et d'une authentification locale (sans backend) qui distingue le gérant et le réceptionniste.

## What Changes

- Page d'accueil publique pour Netlinge Pressing (bandeau, services, étapes, tarifs indicatifs, coordonnées, bouton Connexion)
- Authentification persistée dans le localStorage : connexion, déconnexion, session conservée après rechargement
- Guard Angular protégeant les pages de gestion et redirigeant vers la connexion
- Deux rôles : GERANT et RECEPTIONNISTE
- Mots de passe jamais stockés en clair (SHA-256 avec sel via Web Crypto)
- Compte gérant et compte réceptionniste de démonstration créés au premier lancement
- Zone utilisateur dans l'en-tête (nom, rôle, déconnexion)
- Le gérant peut gérer les comptes du personnel

## Capabilities

### New Capabilities

- `accueil-public` : page d'accueil vitrine du pressing
- `authentification` : comptes, session, rôles, protection des routes

### Modified Capabilities

- `depot-linge` : les pages de gestion des dépôts ne sont accessibles qu'aux personnes connectées

## Impact

- Nouveaux services, gardes et composants sous `src/app/auth` et `src/app/accueil`
- En-tête et navigation adaptés selon la session
- README : identifiants de démonstration
- Aucune dépendance npm ajoutée (Web Crypto natif)
