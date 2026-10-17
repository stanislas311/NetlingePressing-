import { Component } from '@angular/core';

@Component({
  selector: 'np-card',
  standalone: true,
  host: {
    class: 'np-carte',
  },
  template: `<ng-content />`,
  styles: `
    :host {
      display: block;
      background: var(--np-surface, #ffffff);
      border: 1px solid var(--np-bordure, #e2e8f0);
      border-radius: var(--np-rayon, 10px);
      box-shadow: var(--np-ombre-carte, 0 4px 6px -1px rgba(15, 30, 39, 0.07));
      padding: 1.5rem;
      transition: box-shadow var(--np-transition-rapide), border-color var(--np-transition-rapide);
    }
  `,
})
export class NpCardComponent {}
