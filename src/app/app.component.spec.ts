import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
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

  it('should render title on the home screen', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Netlinge Pressing');
  });

  it('should provide a link to the deposits list', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const liens = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('a')
    ).map((a) => a.getAttribute('href'));
    expect(liens).toContain('/depots');
  });

  it("affiche l'en-tête avec le nom de l'application et la zone utilisateur", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const entete = (fixture.nativeElement as HTMLElement).querySelector(
      '.np-entete-application'
    )!;
    expect(entete.textContent).toContain('Netlinge Pressing');
    const zone = entete.querySelector('.np-utilisateur')!;
    expect(zone.getAttribute('aria-disabled')).toBe('true');
    expect(zone.getAttribute('title')).toBe('Connexion à venir');
  });

  it("bascule le menu mobile et met à jour les attributs ARIA", () => {
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

  it("affiche la page d'accueil dans la zone principale", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const main = (fixture.nativeElement as HTMLElement).querySelector('main.np-contenu')!;
    expect(main.querySelector('h1')?.textContent).toContain('Netlinge Pressing');
    expect(main.textContent).toContain('Gestion des dépôts de linge');
  });
});
