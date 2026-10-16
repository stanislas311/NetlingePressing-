import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TableauDeBordComponent } from './tableau-de-bord.component';
import { DepotStoreService } from '../depot-linge/services/depot-store.service';

describe('TableauDeBordComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TableauDeBordComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    TestBed.inject(DepotStoreService).creerDepot({
      clientNom: 'Awa Diallo',
      clientTelephone: '07 12 34 56 78',
      articles: [{ type: 'Chemise', quantite: 1, service: 'Lavage' }],
    });
  });

  afterEach(() => localStorage.clear());

  it('affiche les indicateurs principaux', () => {
    const fixture = TestBed.createComponent(TableauDeBordComponent);
    fixture.detectChanges();
    const texte = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texte).toContain('Tableau de bord');
    expect(texte).toContain('Dépôts du jour');
    expect(texte).toContain('Prêts à retirer');
  });
});
