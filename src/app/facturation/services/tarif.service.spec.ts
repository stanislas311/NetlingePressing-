import { TestBed } from '@angular/core/testing';
import { CLE_TARIFS, TarifService } from './tarif.service';

describe('TarifService', () => {
  let service: TarifService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarifService);
  });

  afterEach(() => localStorage.clear());

  it('fournit un catalogue par défaut', () => {
    expect(service.lister().length).toBeGreaterThan(0);
    expect(service.prix('Chemise', 'Lavage')).toBe(1000);
  });

  it('enregistre une mise à jour de tarif', () => {
    service.enregistrer([{ type: 'Chemise', service: 'Lavage', prix: 1200 }]);
    expect(service.prix('Chemise', 'Lavage')).toBe(1200);
    expect(localStorage.getItem(CLE_TARIFS)).toContain('1200');
  });
});
