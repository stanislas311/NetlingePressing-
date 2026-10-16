import { Component, Input } from '@angular/core';

const COULEURS_STATUT: Record<string, string> = {
  depose: 'gris',
  'deposé': 'gris',
  'en-lavage': 'bleu',
  'en lavage': 'bleu',
  pret: 'vert',
  'prêt': 'vert',
  livre: 'sombre',
  'livré': 'sombre',
  retard: 'rouge',
};

function normaliser(statut: string): string {
  return statut
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-');
}

@Component({
  selector: 'np-status-badge',
  standalone: true,
  template: `
    <span [class]="'np-badge np-badge--' + couleur()">{{ libelle || statut }}</span>
  `,
  styles: `
    .np-badge {
      display: inline-block;
      padding: 0.15rem 0.6rem;
      border-radius: 999px;
      font-size: 0.85rem;
      font-weight: 600;
      line-height: 1.4;
      white-space: nowrap;
    }

    .np-badge--gris {
      background: var(--np-statut-depose-fond, #e4e8eb);
      color: var(--np-statut-depose-texte, #3c4a52);
    }

    .np-badge--bleu {
      background: var(--np-statut-en-lavage-fond, #dceaf7);
      color: var(--np-statut-en-lavage-texte, #1a4f8a);
    }

    .np-badge--vert {
      background: var(--np-statut-pret-fond, #dcf0e2);
      color: var(--np-statut-pret-texte, #1b5e20);
    }

    .np-badge--sombre {
      background: var(--np-statut-livre-fond, #14232b);
      color: var(--np-statut-livre-texte, #ffffff);
    }

    .np-badge--rouge {
      background: var(--np-statut-retard-fond, #fbe2e0);
      color: var(--np-statut-retard-texte, #9b1c14);
    }

    .np-badge--neutre {
      background: var(--np-statut-neutre-fond, #eceff1);
      color: var(--np-statut-neutre-texte, #455a64);
    }
  `,
})
export class NpStatusBadgeComponent {
  @Input({ required: true }) statut = '';
  @Input() libelle = '';

  couleur(): string {
    return COULEURS_STATUT[normaliser(this.statut)] ?? 'neutre';
  }
}
