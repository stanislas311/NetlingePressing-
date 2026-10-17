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
      border: 1px solid var(--np-bordure, #e2e8f0);
      border-radius: var(--np-rayon, 10px);
      background: var(--np-surface, #ffffff);
      box-shadow: var(--np-ombre-sm, 0 1px 2px 0 rgba(15, 30, 39, 0.05));
    }

    .np-table__defilement:focus-visible {
      outline: 2px solid var(--np-couleur-principale, #0b6274);
      outline-offset: 2px;
    }

    :host ::ng-deep table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.9rem;
    }

    :host ::ng-deep thead {
      background: #f8fafc;
      border-bottom: 1px solid var(--np-bordure, #e2e8f0);
    }

    :host ::ng-deep th {
      padding: 0.85rem 1rem;
      font-weight: 600;
      color: var(--np-texte-doux, #52636e);
      font-size: 0.825rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      white-space: nowrap;
    }

    :host ::ng-deep td {
      padding: 0.9rem 1rem;
      border-bottom: 1px solid var(--np-bordure, #e2e8f0);
      color: var(--np-texte, #0f1e27);
      vertical-align: middle;
    }

    :host ::ng-deep tbody tr {
      transition: background-color var(--np-transition-rapide);
    }

    :host ::ng-deep tbody tr:hover {
      background-color: #f8fafc;
    }

    :host ::ng-deep tbody tr:last-child td {
      border-bottom: none;
    }
  `,
})
export class NpTableComponent {
  @Input() libelle = 'Tableau de données';
}
