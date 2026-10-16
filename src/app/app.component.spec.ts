import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthService, CLE_SESSION, CLE_UTILISATEURS } from './auth/services/auth.service';
import { COMPTES_DEMO } from './auth/models/utilisateur.model';

describe('AppComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Netlinge Pressing' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Netlinge Pressing');
  });

  it("affiche l'en-tête avec le nom de l'application et un lien Connexion", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const entete = (fixture.nativeElement as HTMLElement).querySelector(
      '.np-entete-application'
    )!;
    expect(entete.textContent).toContain('Netlinge Pressing');
    const connexion = entete.querySelector('.np-lien-connexion');
    expect(connexion?.getAttribute('href')).toBe('/connexion');
  });

  it("n'affiche pas la navigation tant que l'utilisateur n'est pas connecté", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#np-navigation')).toBeNull();
  });

  it("affiche le nom, le rôle et la déconnexion une fois connecté", async () => {
    const auth = TestBed.inject(AuthService);
    await auth.initialiser();
    await auth.connecter(COMPTES_DEMO.gerant.identifiant, COMPTES_DEMO.gerant.motDePasse);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const entete = (fixture.nativeElement as HTMLElement).querySelector(
      '.np-entete-application'
    )!;
    expect(entete.textContent).toContain(COMPTES_DEMO.gerant.nom);
    expect(entete.textContent).toContain('Gérant');
    expect(entete.textContent).toContain('Déconnexion');
    expect(fixture.nativeElement.querySelector('#np-navigation')).not.toBeNull();
  });

  it("bascule le menu mobile et met à jour les attributs ARIA", async () => {
    const auth = TestBed.inject(AuthService);
    await auth.initialiser();
    await auth.connecter(COMPTES_DEMO.gerant.identifiant, COMPTES_DEMO.gerant.motDePasse);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const bouton = (fixture.nativeElement as HTMLElement).querySelector(
      '.np-menu-bascule'
    ) as HTMLButtonElement;

    expect(app.menuOuvert).toBeFalse();
    expect(bouton.getAttribute('aria-expanded')).toBe('false');

    bouton.click();
    fixture.detectChanges();

    expect(app.menuOuvert).toBeTrue();
    expect(bouton.getAttribute('aria-expanded')).toBe('true');
    const nav = (fixture.nativeElement as HTMLElement).querySelector(
      '#np-navigation'
    )!;
    expect(nav.className).toContain('np-nav--ouverte');

    bouton.click();
    fixture.detectChanges();
    expect(app.menuOuvert).toBeFalse();
    expect(bouton.getAttribute('aria-expanded')).toBe('false');
  });

  it("referme le menu quand on clique sur un lien de navigation", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    app.menuOuvert = true;
    app.fermerMenu();
    expect(app.menuOuvert).toBeFalse();
  });

  it('ne laisse pas de mot de passe en clair dans le stockage', async () => {
    const auth = TestBed.inject(AuthService);
    await auth.initialiser();
    const brut = localStorage.getItem(CLE_UTILISATEURS) ?? '';
    expect(brut).not.toContain(COMPTES_DEMO.gerant.motDePasse);
    expect(brut).not.toContain(COMPTES_DEMO.receptionniste.motDePasse);
    expect(localStorage.getItem(CLE_SESSION)).toBeNull();
  });
});
