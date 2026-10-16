import { Component, Input } from '@angular/core';

@Component({
  selector: 'np-form-field',
  standalone: true,
  template: `
    <div class="np-champ">
      <label [for]="controlId" class="np-champ__libelle">{{ label }}</label>
      <div class="np-champ__controle">
        <ng-content />
      </div>
      @if (erreur) {
        <p class="np-champ__erreur" role="alert">{{ erreur }}</p>
      }
    </div>
  `,
  styles: `
    .np-champ {
      margin-bottom: 0.85rem;
    }

    .np-champ__libelle {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 500;
      font-size: 0.95rem;
    }

    .np-champ__controle input,
    .np-champ__controle select {
      width: 100%;
      padding: 0.5rem 0.6rem;
      border: 1px solid var(--np-bordure, #d5dee3);
      border-radius: var(--np-rayon-petit, 6px);
      font-family: var(--np-police-texte, sans-serif);
      font-size: 1rem;
      color: var(--np-texte, #14232b);
      background: var(--np-surface, #fff);
      box-sizing: border-box;
    }

    .np-champ__controle input:focus-visible {
      border-color: var(--np-couleur-principale, #0e5a6b);
    }

    .np-champ__controle input[aria-invalid='true'] {
      border-color: var(--np-erreur, #b3261e);
    }

    .np-champ__erreur {
      color: var(--np-erreur, #b3261e);
      margin: 0.25rem 0 0;
      font-size: 0.875rem;
    }
  `,
})
export class NpFormFieldComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) controlId = '';
  @Input() erreur: string | null = null;
}
