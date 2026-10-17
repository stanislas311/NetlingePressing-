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
  annule: 'rouge',
  'annulé': 'rouge',
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
    <span [class]="'np-badge np-badge--' + couleur()">
      <span class="np-badge__point" aria-hidden="true"></span>
      {{ libelle || statut }}
    </span>
  `,
  styles: `
    .np-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.65rem;
      border-radius: var(--np-rayon-pill, 9999px);
      font-size: 0.8rem;
      font-weight: 600;
      line-height: 1.3;
      white-space: nowrap;
      letter-spacing: 0.01em;
      border: 1px solid transparent;
      transition: all var(--np-transition-rapide);
    }

    .np-badge__point {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: currentColor;
      opacity: 0.85;
    }

    .np-badge--gris {
      background: var(--np-statut-depose-fond, #f1f5f9);
      color: var(--np-statut-depose-texte, #475569);
      border-color: #e2e8f0;
    }

    .np-badge--bleu {
      background: var(--np-statut-en-lavage-fond, #e0f2fe);
      color: var(--np-statut-en-lavage-texte, #0369a1);
      border-color: #bae6fd;
    }

    .np-badge--vert {
      background: var(--np-statut-pret-fond, #dcfce7);
      color: var(--np-statut-pret-texte, #15803d);
      border-color: #bbf7d0;
    }

    .np-badge--sombre {
      background: var(--np-statut-livre-fond, #1e293b);
      color: var(--np-statut-livre-texte, #ffffff);
      border-color: #0f172a;
    }

    .np-badge--rouge {
      background: var(--np-statut-retard-fond, #fee2e2);
      color: var(--np-statut-retard-texte, #b91c1c);
      border-color: #fecaca;
    }

    .np-badge--neutre {
      background: var(--np-statut-neutre-fond, #f1f5f9);
      color: var(--np-statut-neutre-texte, #475569);
      border-color: #e2e8f0;
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
