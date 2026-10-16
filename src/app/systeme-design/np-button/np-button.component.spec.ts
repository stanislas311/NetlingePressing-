import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NpButtonComponent } from './np-button.component';

@Component({
  standalone: true,
  imports: [NpButtonComponent],
  template: `<np-button>Enregistrer</np-button>`,
})
class HoteComponent {}

describe('NpButtonComponent', () => {
  let fixture: ComponentFixture<HoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HoteComponent] }).compileComponents();
    fixture = TestBed.createComponent(HoteComponent);
    fixture.detectChanges();
  });

  function bouton(): HTMLButtonElement {
    return (fixture.nativeElement as HTMLElement).querySelector('button')!;
  }

  it('devrait être créé', () => {
    expect(fixture).toBeTruthy();
  });

  it("rend la variante principale par défaut", () => {
    expect(bouton().className).toContain('np-bouton--principal');
  });

  it("projette le libellé du bouton", () => {
    expect(bouton().textContent).toContain('Enregistrer');
  });

  it('désactive le bouton natif quand disabled est vrai', () => {
    const composant = (fixture.debugElement.children[0]
      .componentInstance as NpButtonComponent);
    composant.disabled = true;
    fixture.detectChanges();
    expect(bouton().disabled).toBeTrue();
  });

  it("utilise le type natif fourni", () => {
    const composant = (fixture.debugElement.children[0]
      .componentInstance as NpButtonComponent);
    composant.type = 'submit';
    fixture.detectChanges();
    expect(bouton().type).toBe('submit');
  });

  it("rend les variantes secondaire et danger", () => {
    const composant = (fixture.debugElement.children[0]
      .componentInstance as NpButtonComponent);
    composant.variant = 'secondaire';
    fixture.detectChanges();
    expect(bouton().className).toContain('np-bouton--secondaire');
    composant.variant = 'danger';
    fixture.detectChanges();
    expect(bouton().className).toContain('np-bouton--danger');
  });
});
