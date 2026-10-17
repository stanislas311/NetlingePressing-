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
      margin-bottom: 1rem;
    }

    .np-champ__libelle {
      display: block;
      margin-bottom: 0.35rem;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--np-texte, #0f1e27);
    }

    .np-champ__controle input,
    .np-champ__controle select,
    .np-champ__controle textarea {
      width: 100%;
      padding: 0.6rem 0.85rem;
      border: 1px solid var(--np-bordure, #e2e8f0);
      border-radius: var(--np-rayon-petit, 6px);
      font-family: var(--np-police-texte, sans-serif);
      font-size: 0.95rem;
      color: var(--np-texte, #0f1e27);
      background: var(--np-surface, #ffffff);
      box-sizing: border-box;
      transition: border-color var(--np-transition-rapide), box-shadow var(--np-transition-rapide);
      box-shadow: var(--np-ombre-sm);
    }

    .np-champ__controle input:hover,
    .np-champ__controle select:hover {
      border-color: var(--np-bordure-forte, #cbd5e1);
    }

    .np-champ__controle input:focus,
    .np-champ__controle select:focus {
      outline: none;
      border-color: var(--np-couleur-principale, #0b6274);
      box-shadow: 0 0 0 3px rgba(11, 98, 116, 0.15);
    }

    .np-champ__controle input[aria-invalid='true'],
    .np-champ__controle select[aria-invalid='true'] {
      border-color: var(--np-erreur, #d32f2f);
      box-shadow: 0 0 0 3px rgba(211, 47, 47, 0.12);
    }

    .np-champ__erreur {
      color: var(--np-erreur, #d32f2f);
      margin: 0.35rem 0 0;
      font-size: 0.825rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  `,
})
export class NpFormFieldComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) controlId = '';
  @Input() erreur: string | null = null;
}
