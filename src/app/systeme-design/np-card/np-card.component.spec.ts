import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NpCardComponent } from './np-card.component';

describe('NpCardComponent', () => {
  let fixture: ComponentFixture<NpCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NpCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(NpCardComponent);
  });

  it('devrait être créé', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('projette le contenu', () => {
    const hote = document.createElement('div');
    hote.innerHTML = '<np-card><p>Contenu de la carte</p></np-card>';
    expect(hote.querySelector('np-card')?.textContent).toContain(
      'Contenu de la carte'
    );
  });
});
