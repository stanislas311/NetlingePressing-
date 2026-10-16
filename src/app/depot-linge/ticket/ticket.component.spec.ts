import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { TicketComponent } from './ticket.component';
import { DepotStoreService } from '../services/depot-store.service';

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

  it('affiche un message en français si l identifiant est inconnu', async () => {
    await creerComposant('inconnu');
    const texte = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texte).toContain('Ticket introuvable.');
  });
});
