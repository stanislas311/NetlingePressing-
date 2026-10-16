import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NpStatusBadgeComponent } from './np-status-badge.component';

describe('NpStatusBadgeComponent', () => {
  let fixture: ComponentFixture<NpStatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpStatusBadgeComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(NpStatusBadgeComponent);
  });

  function badge(): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector('.np-badge')!;
  }

  function verifierCouleur(statut: string, classe: string): void {
    fixture.componentInstance.statut = statut;
    fixture.detectChanges();
    expect(badge().className).toContain(classe);
  }

  it("affiche la couleur grise pour le statut déposé", () => {
    verifierCouleur('depose', 'np-badge--gris');
  });

  it("affiche la couleur bleue pour le statut en lavage", () => {
    verifierCouleur('en-lavage', 'np-badge--bleu');
  });

  it("affiche la couleur verte pour le statut prêt", () => {
    verifierCouleur('pret', 'np-badge--vert');
  });

  it("affiche la couleur sombre pour le statut livré", () => {
    verifierCouleur('livre', 'np-badge--sombre');
  });

  it("affiche la couleur rouge pour le statut retard", () => {
    verifierCouleur('retard', 'np-badge--rouge');
  });

  it("affiche un style neutre pour un statut non reconnu", () => {
    verifierCouleur('inconnu', 'np-badge--neutre');
  });

  it('affiche le libellé fourni', () => {
    fixture.componentInstance.statut = 'depose';
    fixture.componentInstance.libelle = 'Déposé';
    fixture.detectChanges();
    expect(badge().textContent).toContain('Déposé');
  });
});
