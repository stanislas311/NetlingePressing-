# Spec Delta

## ADDED Requirements

### Requirement: Pilotage et finitions
Le système SHALL afficher un tableau de bord (dépôts du jour, prêts, retards, répartition, CA du jour pour le gérant). Un dépôt non livré SHALL pouvoir être annulé avec un motif obligatoire. Une page 404 SHALL s'afficher pour une route inconnue.

#### Scenario: Annulation
- **WHEN** un motif est saisi et l'annulation confirmée
- **THEN** le dépôt passe à annulé et n'avance plus
