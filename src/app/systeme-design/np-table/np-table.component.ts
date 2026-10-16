import { Component, Input } from '@angular/core';

@Component({
  selector: 'np-table',
  standalone: true,
  template: `
    <div
      class="np-table__defilement"
      role="region"
      [attr.aria-label]="libelle"
      tabindex="0"
    >
      <ng-content />
    </div>
  `,
  styles: `
    .np-table__defilement {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .np-table__defilement:focus-visible {
      outline: 2px solid var(--np-couleur-principale, #0e5a6b);
      outline-offset: 2px;
    }
  `,
})
export class NpTableComponent {
  @Input() libelle = 'Tableau de données';
}
