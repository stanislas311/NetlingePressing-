# Design

## Context

L'application est 100 % client, persistée dans le localStorage. La coquille (`AppComponent`) affiche déjà un en-tête, une navigation et un accueil très minimal. Les pages `/depots` n'ont aucun garde.

## Goals / Non-Goals

**Goals:**

- Vitrine publique soignée, cohérente avec le système de design
- Auth locale avec sel + SHA-256, session persistante, deux rôles
- Protection des pages de gestion
- Comptes de démonstration documentés
- Gestion des comptes par le gérant

**Non-Goals:**

- Backend, JWT, OAuth, e-mail de réinitialisation
- Chiffrement des autres données localStorage
- Page tarifs dynamique (catalogue réel : changement facturation)

## Decisions

- **Hachage** : `crypto.subtle.digest('SHA-256')` sur `sel || motDePasse`, sel de 16 octets aléatoires, stockage en hexadécimal. Alternative bcrypt rejetée (pas de backend, pas de nouvelle dépendance).
- **Session** : identifiant utilisateur dans `netlinge.session`. Au rechargement, l'utilisateur est rétabli s'il existe encore.
- **Initialisation** : `provideAppInitializer` appelle `AuthService.initialiser()` pour créer les deux comptes de démo si le magasin d'utilisateurs est vide.
- **Rôles** : `GERANT` (personnel + vue complète) et `RECEPTIONNISTE` (dépôts, statuts, encaissements à venir). Un `gerantGuard` protège `/personnel`.
- **Pages publiques** : `/` et `/connexion` sans barre latérale. Le reste exige `authGuard`.

## Risks / Trade-offs

- [SHA-256 n'est pas un KDF lent] → acceptable pour une démo étudiante hors ligne ; le sel empêche un stockage en clair.
- [localStorage visible] → contrainte du sujet sans backend ; documentée dans le README.
