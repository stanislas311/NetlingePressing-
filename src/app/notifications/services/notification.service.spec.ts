import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => localStorage.clear());

  it('ajoute une notification en tête de liste', () => {
    service.ajouter('depot', 'Dépôt enregistré', 'Ticket DP-1', 'id-1');
    expect(service.lister()[0].titre).toBe('Dépôt enregistré');
  });

  it('déduit un retard une seule fois par dépôt', () => {
    const hier = new Date(Date.now() - 86_400_000).toISOString();
    const depot = {
      id: 'd1',
      ticketNumero: 'DP-1',
      clientId: 'c',
      clientNom: 'Awa',
      clientTelephone: '0700000000',
      articles: [],
      statut: 'depose' as const,
      dateDepot: hier,
      dateRetraitPrevue: hier,
      historiqueStatuts: [],
    };
    service.synchroniserRetards([depot]);
    service.synchroniserRetards([depot]);
    expect(service.lister().filter((n) => n.type === 'retard').length).toBe(1);
  });
});
