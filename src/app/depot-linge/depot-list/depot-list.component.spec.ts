import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DepotListComponent } from './depot-list.component';
import { DepotStoreService } from '../services/depot-store.service';
import { jourLocal, soldeRestant } from '../models/depot.model';

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

  it("affiche le statut sous forme de badge coloré", () => {
    const badges = (fixture.nativeElement as HTMLElement).querySelectorAll(
      'np-status-badge .np-badge'
    );
    expect(badges.length).toBe(2);
    expect((badges[0] as HTMLElement).className).toContain('np-badge--gris');
    expect(badges[0].textContent).toContain('Déposé');
  });

  it("encapsule le tableau dans une région de défilement accessible", () => {
    const region = (fixture.nativeElement as HTMLElement).querySelector(
      'np-table .np-table__defilement'
    )!;
    expect(region.getAttribute('role')).toBe('region');
    expect(region.getAttribute('aria-label')).toBe('Liste des dépôts de linge');
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

  describe("modification de la date de retrait depuis la liste", () => {
    function boutons(texteRecherche: string): HTMLButtonElement[] {
      return Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll('button')
      ).filter((b) => (b.textContent ?? '').includes(texteRecherche));
    }

    it('propose une action Modifier la date de retrait sur chaque ligne non livrée', () => {
      expect(boutons('Modifier la date de retrait').length).toBe(2);
    });

    it("ouvre un champ date pré-rempli avec la date de retrait courante du dépôt", () => {
      const depot = store.listerDepots()[0];
      component.ouvrirEdition(depot);
      fixture.detectChanges();

      expect(component.depotEnEdition).toBe(depot.id);
      expect(component.dateEdition.value).toBe(
        jourLocal(new Date(depot.dateRetraitPrevue))
      );
      const champ = (fixture.nativeElement as HTMLElement).querySelector(
        'input[type="date"]'
      ) as HTMLInputElement;
      expect(champ).not.toBeNull();
      expect(champ.value).toBe(component.dateEdition.value);
    });

    it('enregistre la nouvelle date de retrait quand elle est postérieure au dépôt', () => {
      const depot = store.listerDepots()[0];
      const nouvelleDate = new Date(Date.now() + 5 * 86_400_000);
      const attendu = jourLocal(nouvelleDate);

      component.ouvrirEdition(depot);
      component.dateEdition.setValue(attendu);
      component.confirmerEdition(depot);
      fixture.detectChanges();

      expect(component.depotEnEdition).toBeNull();
      expect(component.erreurEdition).toBeNull();
      const enregistre = store.getDepotById(depot.id)!;
      expect(jourLocal(new Date(enregistre.dateRetraitPrevue))).toBe(attendu);
      expect(component.depots.find((d) => d.id === depot.id)?.dateRetraitPrevue).toBe(
        enregistre.dateRetraitPrevue
      );
    });

    it("refuse une date antérieure avec un message et sans modifier la date", () => {
      const depot = store.listerDepots()[0];
      const avant = store.getDepotById(depot.id)!.dateRetraitPrevue;
      const anterieure = new Date(Date.now() - 2 * 86_400_000);
      const saisie = `${anterieure.getFullYear()}-${String(anterieure.getMonth() + 1).padStart(2, '0')}-${String(anterieure.getDate()).padStart(2, '0')}`;

      component.ouvrirEdition(depot);
      component.dateEdition.setValue(saisie);
      component.confirmerEdition(depot);
      fixture.detectChanges();

      expect(component.erreurEdition).toBe(
        'La date de retrait ne peut pas être antérieure à la date de dépôt.'
      );
      expect(store.getDepotById(depot.id)!.dateRetraitPrevue).toBe(avant);
      const texte = (fixture.nativeElement as HTMLElement).textContent ?? '';
      expect(texte).toContain(
        'La date de retrait ne peut pas être antérieure à la date de dépôt.'
      );
    });

    it("annule l'édition sans rien modifier", () => {
      const depot = store.listerDepots()[0];
      const avant = store.getDepotById(depot.id)!.dateRetraitPrevue;
      component.ouvrirEdition(depot);
      component.annulerEdition();
      fixture.detectChanges();
      expect(component.depotEnEdition).toBeNull();
      expect(store.getDepotById(depot.id)!.dateRetraitPrevue).toBe(avant);
    });
  });

  describe('filtre par statut', () => {
    it('propose un sélecteur de filtre par statut', () => {
      const select = (fixture.nativeElement as HTMLElement).querySelector(
        '#filtre-statut'
      ) as HTMLSelectElement;
      expect(select).not.toBeNull();
      expect(select.options.length).toBe(6);
    });

    it('filtre les dépôts par statut sélectionné', () => {
      const premier = store.listerDepots()[0];
      store.passerAuStatutSuivant(premier.id);
      component.filtreStatut.setValue('en-lavage');
      fixture.detectChanges();
      expect(component.depots.length).toBe(1);
      expect(component.depots[0].statut).toBe('en-lavage');
    });

    it('combine le filtre de statut et la recherche', () => {
      const premier = store.listerDepots()[0];
      store.passerAuStatutSuivant(premier.id);
      component.filtreStatut.setValue('en-lavage');
      component.recherche.setValue('awa');
      fixture.detectChanges();
      expect(component.depots.length).toBe(1);
      expect(component.depots[0].clientNom).toBe('Awa Diallo');
    });
  });

  describe("bouton Passer à l'étape suivante", () => {
    function boutonsAvancement(): HTMLButtonElement[] {
      return Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll('button')
      ).filter((b) => (b.textContent ?? '').includes("Passer à l'étape suivante"));
    }

    it('propose le bouton sur chaque ligne non livrée', () => {
      expect(boutonsAvancement().length).toBe(2);
    });

    it("avance le statut d'un dépôt au clic", () => {
      const depot = store.listerDepots()[0];
      component.passerAuStatutSuivant(depot);
      fixture.detectChanges();
      expect(store.getDepotById(depot.id)!.statut).toBe('en-lavage');
      expect(component.depots.find((d) => d.id === depot.id)!.statut).toBe('en-lavage');
    });

    it('masque le bouton et la modification de date sur un dépôt livré', () => {
      const depot = store.listerDepots()[0];
      store.passerAuStatutSuivant(depot.id);
      store.passerAuStatutSuivant(depot.id);
      store.enregistrerPaiement(depot.id, soldeRestant(store.getDepotById(depot.id)!));
      store.passerAuStatutSuivant(depot.id);
      component.recherche.setValue(depot.ticketNumero);
      fixture.detectChanges();
      expect(boutonsAvancement().length).toBe(0);
      const boutonsModif = Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll('button')
      ).filter((b) => (b.textContent ?? '').includes('Modifier la date de retrait'));
      expect(boutonsModif.length).toBe(0);
    });
  });

  describe('archivage et suppression', () => {
    it('archive un dépôt et le retire de la liste active', () => {
      const premier = store.listerDepots()[0];
      component.archiverDepot(premier);
      fixture.detectChanges();

      expect(component.nombreArchives).toBe(1);
      expect(component.depots.some((d) => d.id === premier.id)).toBeFalse();

      component.basculerVueArchives();
      fixture.detectChanges();
      expect(component.depots.length).toBe(1);
      expect(component.depots[0].id).toBe(premier.id);

      component.desarchiverDepot(premier);
      fixture.detectChanges();
      expect(component.nombreArchives).toBe(0);
    });

    it('supprime un dépôt après confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const premier = store.listerDepots()[0];
      component.supprimerDepot(premier);
      fixture.detectChanges();

      expect(store.getDepotById(premier.id)).toBeUndefined();
      expect(component.depots.some((d) => d.id === premier.id)).toBeFalse();
    });
  });
});
