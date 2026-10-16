import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DepotListComponent } from './depot-list.component';
import { DepotStoreService } from '../services/depot-store.service';

describe('DepotListComponent', () => {
  let fixture: ComponentFixture<DepotListComponent>;
  let component: DepotListComponent;
  let store: DepotStoreService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [DepotListComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    store = TestBed.inject(DepotStoreService);
    store.creerDepot({
      clientNom: 'Awa Diallo',
      clientTelephone: '07 12 34 56 78',
      articles: [{ type: 'Chemise', quantite: 2, service: 'Lavage' }],
    });
    store.creerDepot({
      clientNom: 'Moussa Traoré',
      clientTelephone: '06 98 76 54 32',
      articles: [{ type: 'Robe', quantite: 1, service: 'Nettoyage à sec' }],
    });

    fixture = TestBed.createComponent(DepotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  function texte(): string {
    return (fixture.nativeElement as HTMLElement).textContent ?? '';
  }

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it("affiche la liste des dépôts existants", () => {
    expect(texte()).toContain('DP-');
    expect(texte()).toContain('Awa Diallo');
    expect(texte()).toContain('Moussa Traoré');
    expect(texte()).toContain('Déposé');
  });

  it('filtre par numéro de ticket', () => {
    const premierTicket = store.listerDepots()[0].ticketNumero;
    component.recherche.setValue(premierTicket.slice(-4));
    fixture.detectChanges();
    expect(component.depots.length).toBe(1);
    expect(texte()).toContain(premierTicket);
  });

  it('filtre par nom de client, sans tenir compte de la casse', () => {
    component.recherche.setValue('moussa');
    fixture.detectChanges();
    expect(component.depots.length).toBe(1);
    expect(component.depots[0].clientNom).toBe('Moussa Traoré');
  });

  it("affiche le message Aucun dépôt trouvé quand rien ne correspond", () => {
    component.recherche.setValue('zzz-inconnu');
    fixture.detectChanges();
    expect(component.depots.length).toBe(0);
    expect(texte()).toContain('Aucun dépôt trouvé.');
  });

  it("affiche le message Aucun dépôt trouvé quand aucun dépôt n'existe", () => {
    localStorage.clear();
    const videFixture = TestBed.createComponent(DepotListComponent);
    const videComponent = videFixture.componentInstance;
    videComponent.depots = [];
    videFixture.detectChanges();
    expect((videFixture.nativeElement as HTMLElement).textContent).toContain(
      'Aucun dépôt trouvé.'
    );
  });

  it('propose un lien vers le ticket de chaque dépôt et un lien nouveau dépôt', () => {
    const liens = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('a')
    ).map((a) => a.getAttribute('href'));
    expect(liens.some((h) => h?.endsWith('/ticket') ?? false)).toBeTrue();
    expect(liens.some((h) => h?.includes('/depots/nouveau') ?? false)).toBeTrue();
  });
});
