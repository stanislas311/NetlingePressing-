# Spec Delta

## Purpose

Fournit le système de design de l'application Netlinge Pressing : jetons visuels globaux, coquille d'application avec navigation adaptative, composants UI réutilisables, accessibilité et iconographie, afin d'assurer une interface cohérente, responsive et en français sur tous les écrans.

## ADDED Requirements

### Requirement: Jetons de couleur et typographie
L'application SHALL utiliser des variables CSS globales définissant la palette du thème : couleur principale bleu-vert profond `#0E5A6B`, fond de page `#F5F8FA`, surfaces blanches, texte principal `#14232B`, accent ambre `#F2A541`. Les titres SHALL utiliser la police Plus Jakarta Sans et le texte courant la police Inter, chacune avec des polices système de secours.

#### Scenario: Application du thème
- **WHEN** l'utilisateur navigue dans l'application
- **THEN** les pages affichent le fond, les surfaces, les textes et les couleurs du thème défini, et les titres et textes utilisent les polices du thème avec leurs secours système

### Requirement: Coquille d'application
L'application SHALL présenter une coquille commune comportant un en-tête avec le nom « Netlinge Pressing », une zone d'utilisateur réservée à une future authentification, et une navigation qui SHALL s'afficher en barre latérale fixe à gauche sur grand écran et en menu supérieur repliable sur mobile.

#### Scenario: Navigation sur grand écran
- **WHEN** l'application est affichée sur un grand écran
- **THEN** la navigation apparaît en barre latérale fixe à gauche et le contenu principal occupe la zone restante

#### Scenario: Navigation sur mobile
- **WHEN** l'application est affichée sur un petit écran
- **THEN** la navigation apparaît en menu supérieur repliable, dépliable par une commande accessible

#### Scenario: Zone utilisateur
- **WHEN** l'utilisateur consulte l'en-tête de l'application
- **THEN** une zone d'utilisateur est visible, prête à accueillir une future authentification, sans action fonctionnelle pour l'instant

### Requirement: Boutons réutilisables
L'application SHALL fournir un composant bouton avec trois variantes visuelles : principal (action primaire), secondaire et danger. Toutes les actions de bouton de l'application SHALL utiliser ce composant.

#### Scenario: Affichage des variantes
- **WHEN** des actions principales, secondaires et de suppression sont affichées
- **THEN** chaque action utilise la variante de bouton correspondante avec un rendu visuel distinct

### Requirement: Champ de formulaire réutilisable
L'application SHALL fournir un composant champ de formulaire associant un libellé, un contrôle de saisie et un emplacement de message d'erreur en français affiché lorsque le champ est invalide.

#### Scenario: Champ en erreur
- **WHEN** la saisie d'un champ est invalide
- **THEN** le message d'erreur en français est affiché sous le champ et le champ est rattaché à son libellé

### Requirement: Carte de contenu
L'application SHALL fournir un composant carte (surface blanche, arrondie, ombre légère) pour regrouper visuellement des blocs de contenu sur les pages.

#### Scenario: Regroupement de contenu
- **WHEN** une page présente un bloc de contenu encadré
- **THEN** ce bloc est rendu dans une carte du système de design

### Requirement: Tableau responsive
L'application SHALL fournir un composant tableau lisible sur tous les tailles d'écran : sur petit écran, le contenu du tableau reste accessible sans casser la mise en page de la page.

#### Scenario: Tableau sur petit écran
- **WHEN** un tableau de données est affiché sur un écran de largeur réduite
- **THEN** les données restent lisibles et accessibles (défilement horizontal ou adaptation) sans débordement de la page

### Requirement: Badge de statut
L'application SHALL fournir un composant badge de statut coloré. Les statuts connus SHALL être colorés ainsi : déposé en gris, en lavage en bleu, prêt en vert, livré en ton sombre, retard en rouge. Un statut non reconnu SHALL afficher un badge neutre.

#### Scenario: Affichage d'un statut connu
- **WHEN** un élément porte un statut connu (déposé, en lavage, prêt, livré ou retard)
- **THEN** le statut est affiché comme un badge avec la couleur associée à ce statut

#### Scenario: Statut non reconnu
- **WHEN** un élément porte une valeur de statut non définie dans le thème
- **THEN** le badge s'affiche en style neutre sans erreur

### Requirement: Accessibilité de l'interface
L'application SHALL garantir des contrastes de couleur suffisants entre texte et fond (au minimum niveau AA WCAG), un indicateur de focus visible pour tous les éléments interactifs, et des libellés explicites associés à chaque champ de saisie.

#### Scenario: Navigation au clavier
- **WHEN** l'utilisateur navigue dans l'application au clavier
- **THEN** chaque élément interactif atteint affiche un indicateur de focus visible

#### Scenario: Contraste du texte
- **WHEN** le texte est affiché sur les fonds et surfaces du thème
- **THEN** le contraste atteint au minimum le niveau AA WCAG

### Requirement: Langue et iconographie
L'interface de l'application SHALL être entièrement en français. Aucun emoji SHALL apparaître dans le code ni dans les textes de l'interface. Les éventuelles icônes SHALL être des SVG intégrés, utilisés avec parcimonie.

#### Scenario: Contenu de l'interface
- **WHEN** l'utilisateur consulte les textes et éléments graphiques de l'application
- **THEN** tous les textes sont en français, aucun emoji n'est présent et les icônes éventuelles sont rendues en SVG
