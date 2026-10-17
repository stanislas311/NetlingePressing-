import { Component, Input } from '@angular/core';

export type VarianteBouton = 'principal' | 'secondaire' | 'danger' | 'succes';

@Component({
  selector: 'np-button',
  standalone: true,
  template: `
    <button
      [type]="type"
      [class]="'np-bouton np-bouton--' + variant + (taille && taille !== 'md' ? ' np-bouton--' + taille : '')"
      [disabled]="disabled"
    >
      <ng-content />
    </button>
  `,
})
export class NpButtonComponent {
  @Input() variant: VarianteBouton = 'principal';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() taille?: 'sm' | 'md' | 'lg' = 'md';
}
