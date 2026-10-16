# Design

## Context

Auth, dépôts et statuts existent. Pas de backend.

## Goals / Non-Goals

**Goals:** tarifs, encaissement, facture, notifications in-app, WhatsApp, dashboard, annulation, 404.

**Non-Goals:** SMS réel, paiement en ligne, serveur.

## Decisions

- Tarifs dans `netlinge.tarifs`, totaux calculés à la création.
- Livraison refusée si `soldeRestant > 0`.
- WhatsApp via `wa.me/225…` (zéro initial retiré).
- Statut `annule` hors circuit linéaire, motif obligatoire.

## Risks

LocalStorage propre à chaque navigateur, documenté dans le README.
