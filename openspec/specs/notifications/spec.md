# notifications Specification

## Purpose
TBD - created by archiving change finalisation-metier. Update Purpose after archive.

## Requirements

### Requirement: Centre de notifications et WhatsApp
Le système SHALL enregistrer des notifications locales pour un dépôt créé, un linge prêt et un retard de retrait. Quand un dépôt est prêt, un lien WhatsApp pré-rempli SHALL être proposé avec le numéro du client au format international Côte d'Ivoire +225.

#### Scenario: Linge prêt
- **WHEN** un dépôt passe à prêt
- **THEN** une notification est créée et un lien wa.me est disponible sur le ticket
