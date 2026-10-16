import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConnexionComponent } from './connexion.component';
import { AuthService } from '../services/auth.service';
import { COMPTES_DEMO } from '../models/utilisateur.model';

@Component({ standalone: true, template: '' })
class PageDepotsFacticeComponent {}

describe('ConnexionComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [ConnexionComponent],
      providers: [
        provideRouter([{ path: 'depots', component: PageDepotsFacticeComponent }]),
      ],
    }).compileComponents();
    await TestBed.inject(AuthService).initialiser();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('affiche un message si les identifiants sont incorrects', async () => {
    const fixture = TestBed.createComponent(ConnexionComponent);
    fixture.detectChanges();
    const composant = fixture.componentInstance;
    composant.formulaire.setValue({ identifiant: 'gerant', motDePasse: 'incorrect' });
    await composant.soumettre();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'Identifiant ou mot de passe incorrect.'
    );
  });

  it('connecte un compte valide', async () => {
    const fixture = TestBed.createComponent(ConnexionComponent);
    const composant = fixture.componentInstance;
    composant.formulaire.setValue({
      identifiant: COMPTES_DEMO.gerant.identifiant,
      motDePasse: COMPTES_DEMO.gerant.motDePasse,
    });
    await composant.soumettre();
    expect(TestBed.inject(AuthService).estConnecte()).toBeTrue();
  });
});
