import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { TicketComponent } from './ticket.component';
import { DepotStoreService } from '../services/depot-store.service';
import { Depot, jourLocal } from '../models/depot.model';

describe('TicketComponent', () => {
  let fixture: ComponentFixture<TicketComponent>;

  async function creerComposant(id: string): Promise<TicketComponent> {
    await TestBed.configureTestingModule({
      imports: [TicketComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id }) } },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TicketComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  it('affiche le ticket complet d un dépôt existant', async () => {
    const depot = new DepotStoreService().creerDepot({
      clientNom: 'Awa Diallo',
      clientTelephone: '07 12 34 56 78',
      articles: [{ type: 'Chemise', quantite: 2, service: 'Lavage' }],
    });
    await creerComposant(depot.id);

    const texte = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texte).toContain(depot.ticketNumero);
    expect(texte).toContain('Awa Diallo');
    expect(texte).toContain('Chemise');
    expect(texte).toContain('Déposé');
    expect(texte).toContain('Date de retrait prévue');
  });

  it("affiche le statut sous forme de badge dans le ticket", async () => {
    const depot = new DepotStoreService().creerDepot({
      clientNom: 'Awa Diallo',
      clientTelephone: '07 12 34 56 78',
      articles: [{ type: 'Chemise', quantite: 2, service: 'Lavage' }],
    });
    await creerComposant(depot.id);
    const badge = (fixture.nativeElement as HTMLElement).querySelector(
      'np-status-badge .np-badge'
    ) as HTMLElement;
    expect(badge).not.toBeNull();
    expect(badge.className).toContain('np-badge--gris');
    expect(badge.textContent).toContain('Déposé');
  });

  it('affiche un message en français si l identifiant est inconnu', async () => {
    await creerComposant('inconnu');
    const texte = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texte).toContain('Ticket introuvable.');
  });

  describe('modification de la date de retrait depuis le ticket', () => {
    async function creerAvecDepot(): Promise<{ depot: Depot; composant: TicketComponent }> {
      const depot = new DepotStoreService().creerDepot({
        clientNom: 'Awa Diallo',
        clientTelephone: '07 12 34 56 78',
        articles: [{ type: 'Chemise', quantite: 2, service: 'Lavage' }],
      });
      const composant = await creerComposant(depot.id);
      return { depot, composant };
    }

    function texteTicket(): string {
      return (fixture.nativeElement as HTMLElement).textContent ?? '';
    }

    it('propose un bouton Modifier la date de retrait', async () => {
      await creerAvecDepot();
      expect(texteTicket()).toContain('Modifier la date de retrait');
    });

    it("bascule un champ date pré-rempli avec la date courante", async () => {
      const { depot, composant } = await creerAvecDepot();
      composant.ouvrirEdition();
      fixture.detectChanges();

      expect(composant.editionOuverte).toBeTrue();
      expect(composant.dateEdition.value).toBe(
        jourLocal(new Date(depot.dateRetraitPrevue))
      );
      const champ = (fixture.nativeElement as HTMLElement).querySelector(
        '#date-retrait-ticket'
      ) as HTMLInputElement;
      expect(champ).not.toBeNull();
      expect(champ.value).toBe(composant.dateEdition.value);
      expect(texteTicket()).toContain('Enregistrer');
    });

    it('enregistre la nouvelle date et réaffiche la date à jour', async () => {
      const { depot, composant } = await creerAvecDepot();
      const nouvelleDate = new Date(Date.now() + 5 * 86_400_000);
      const attendu = jourLocal(nouvelleDate);

      composant.ouvrirEdition();
      composant.dateEdition.setValue(attendu);
      composant.enregistrerDateRetrait();
      fixture.detectChanges();

      expect(composant.editionOuverte).toBeFalse();
      expect(composant.erreurEdition).toBeNull();
      expect(jourLocal(new Date(composant.depot!.dateRetraitPrevue))).toBe(attendu);
      expect(new DepotStoreService().getDepotById(depot.id)!.dateRetraitPrevue).toBe(
        composant.depot!.dateRetraitPrevue
      );
      const dateAffichee = composant.formaterDate(composant.depot!.dateRetraitPrevue);
      expect(texteTicket()).toContain(dateAffichee);
      expect(texteTicket()).toContain('Modifier la date de retrait');
    });

    it("refuse une date antérieure avec un message et sans changer la date", async () => {
      const { depot, composant } = await creerAvecDepot();
      const avant = depot.dateRetraitPrevue;
      const anterieure = jourLocal(new Date(Date.now() - 2 * 86_400_000));

      composant.ouvrirEdition();
      composant.dateEdition.setValue(anterieure);
      composant.enregistrerDateRetrait();
      fixture.detectChanges();

      expect(composant.erreurEdition).toBe(
        'La date de retrait ne peut pas être antérieure à la date de dépôt.'
      );
      expect(composant.depot!.dateRetraitPrevue).toBe(avant);
      expect(new DepotStoreService().getDepotById(depot.id)!.dateRetraitPrevue).toBe(avant);
      expect(texteTicket()).toContain(
        'La date de retrait ne peut pas être antérieure à la date de dépôt.'
      );
    });

    it("annule l'édition sans rien modifier", async () => {
      const { depot, composant } = await creerAvecDepot();
      composant.ouvrirEdition();
      composant.annulerEdition();
      fixture.detectChanges();
      expect(composant.editionOuverte).toBeFalse();
      expect(composant.depot!.dateRetraitPrevue).toBe(depot.dateRetraitPrevue);
    });
  });

  describe('circuit de statuts', () => {
    async function creerAvecDepot(): Promise<{ depot: Depot; composant: TicketComponent }> {
      const depot = new DepotStoreService().creerDepot({
        clientNom: 'Awa Diallo',
        clientTelephone: '07 12 34 56 78',
        articles: [{ type: 'Chemise', quantite: 2, service: 'Lavage' }],
      });
      const composant = await creerComposant(depot.id);
      return { depot, composant };
    }

    it("propose le bouton Passer à l'étape suivante pour un dépôt non livré", async () => {
      await creerAvecDepot();
      const texte = (fixture.nativeElement as HTMLElement).textContent ?? '';
      expect(texte).toContain("Passer à l'étape suivante");
    });

    it("avance le statut au clic sur le bouton", async () => {
      const { composant } = await creerAvecDepot();
      composant.passerAuStatutSuivant();
      fixture.detectChanges();
      expect(composant.depot!.statut).toBe('en-lavage');
      const texte = (fixture.nativeElement as HTMLElement).textContent ?? '';
      expect(texte).toContain('En lavage');
    });

    it("affiche l'historique des statuts du plus ancien au plus récent", async () => {
      const { composant } = await creerAvecDepot();
      composant.passerAuStatutSuivant();
      fixture.detectChanges();
      const lignes = (fixture.nativeElement as HTMLElement).querySelectorAll(
        'table.historique tbody tr'
      );
      expect(lignes.length).toBe(2);
      expect(lignes[0].textContent).toContain('Déposé');
      expect(lignes[1].textContent).toContain('En lavage');
    });

    it("masque le bouton et l'édition de date sur un dépôt livré", async () => {
      const { composant } = await creerAvecDepot();
      composant.passerAuStatutSuivant();
      composant.passerAuStatutSuivant();
      composant.passerAuStatutSuivant();
      fixture.detectChanges();
      expect(composant.depot!.statut).toBe('livre');
      const texte = (fixture.nativeElement as HTMLElement).textContent ?? '';
      expect(texte).not.toContain("Passer à l'étape suivante");
      expect(texte).not.toContain('Modifier la date de retrait');
    });

    it("affiche la date et l'heure réelles du retrait pour un dépôt livré", async () => {
      const { composant } = await creerAvecDepot();
      composant.passerAuStatutSuivant();
      composant.passerAuStatutSuivant();
      composant.passerAuStatutSuivant();
      fixture.detectChanges();
      const texte = (fixture.nativeElement as HTMLElement).textContent ?? '';
      expect(texte).toContain('Retiré le');
      expect(composant.depot!.dateRetraitReelle).toBeDefined();
    });
  });
});
