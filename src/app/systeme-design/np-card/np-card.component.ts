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
      background: var(--np-surface, #fff);
      border: 1px solid var(--np-bordure, #d5dee3);
      border-radius: var(--np-rayon, 8px);
      box-shadow: var(--np-ombre-carte, none);
      padding: 1.25rem;
    }
  `,
})
export class NpCardComponent {}
