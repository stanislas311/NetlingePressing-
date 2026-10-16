import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AccueilComponent } from './accueil.component';

describe('AccueilComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it("présente Netlinge Pressing et un accès à la connexion", () => {
    const fixture = TestBed.createComponent(AccueilComponent);
    fixture.detectChanges();
    const texte = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texte).toContain('Netlinge Pressing');
    expect(texte).toContain('Connexion');
    expect(texte).toContain('Lavage');
    expect(texte).toContain('Dépôt');
    expect(texte).toContain('Tarifs indicatifs');
    expect(texte).toContain('Cocody, Abidjan');
  });
});
