import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NpFormFieldComponent } from './np-form-field.component';

@Component({
  standalone: true,
  imports: [NpFormFieldComponent],
  template: `
    <np-form-field label="Nom du client" controlId="nom" [erreur]="erreur">
      <input id="nom" type="text" />
    </np-form-field>
  `,
})
class HoteComponent {
  erreur: string | null = null;
}

describe('NpFormFieldComponent', () => {
  let fixture: ComponentFixture<HoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoteComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HoteComponent);
    fixture.detectChanges();
  });

  function champ(): HTMLElement {
    return (fixture.nativeElement as HTMLElement).querySelector('np-form-field')!;
  }

  it('associe le libellé au champ via for/id', () => {
    const label = champ().querySelector('label') as HTMLLabelElement;
    const input = champ().querySelector('input') as HTMLInputElement;
    expect(label.getAttribute('for')).toBe('nom');
    expect(input.id).toBe('nom');
  });

  it("affiche le message d'erreur en français quand il est fourni", () => {
    fixture.componentInstance.erreur = 'Le nom du client est obligatoire.';
    fixture.detectChanges();
    const message = champ().querySelector('.np-champ__erreur') as HTMLElement;
    expect(message.textContent).toContain('Le nom du client est obligatoire.');
    expect(message.getAttribute('role')).toBe('alert');
  });

  it("masque le message d'erreur quand il est absent", () => {
    fixture.componentInstance.erreur = null;
    fixture.detectChanges();
    expect(champ().querySelector('.np-champ__erreur')).toBeNull();
  });
});
