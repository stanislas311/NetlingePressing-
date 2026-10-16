import { TestBed } from '@angular/core/testing';
import {
  CLE_CLIENTS,
  CLE_COMPTEUR_TICKET,
  CLE_DEPOTS,
  DepotStoreService,
} from './depot-store.service';
import { DepotCreation } from '../models/depot.model';

describe('DepotStoreService', () => {
  let service: DepotStoreService;

  const creation: DepotCreation = {
    clientNom: 'Awa Diallo',
    clientTelephone: '07 12 34 56 78',
    articles: [
      { type: 'Chemise', quantite: 2, service: 'Lavage' },
      { type: 'Pantalon', quantite: 1, service: 'Repassage' },
    ],
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepotStoreService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  describe('creerDepot', () => {
    it('crée un dépôt avec un numéro de ticket au format DP-AAAAMMJJ-XXXX', () => {
      const depot = service.creerDepot(creation);
      const aujourdhui = new Date();
      const datePart = `${aujourdhui.getFullYear()}${String(aujourdhui.getMonth() + 1).padStart(2, '0')}${String(aujourdhui.getDate()).padStart(2, '0')}`;
      expect(depot.ticketNumero).toMatch(new RegExp(`^DP-${datePart}-\\d{4}$`));
    });

    it('attribue le statut initial depose', () => {
      const depot = service.creerDepot(creation);
      expect(depot.statut).toBe('depose');
    });

    it('fige les informations du client sur le dépôt', () => {
      const depot = service.creerDepot(creation);
      expect(depot.clientNom).toBe('Awa Diallo');
      expect(depot.clientTelephone).toBe('07 12 34 56 78');
    });

    it('enregistre la date de retrait prévue à 48 heures du dépôt', () => {
      const depot = service.creerDepot(creation);
      const ecart = new Date(depot.dateRetraitPrevue).getTime() - new Date(depot.dateDepot).getTime();
      expect(ecart).toBe(48 * 3_600_000);
    });

    it('conserve tous les articles saisis', () => {
      const depot = service.creerDepot(creation);
      expect(depot.articles.length).toBe(2);
      expect(depot.articles[0]).toEqual({ type: 'Chemise', quantite: 2, service: 'Lavage' });
    });

    it('persiste le dépôt dans le localStorage', () => {
      service.creerDepot(creation);
      expect(localStorage.getItem(CLE_DEPOTS)).not.toBeNull();
      expect(service.listerDepots().length).toBe(1);
    });

    it('génère des numéros uniques pour plusieurs dépôts', () => {
      const premier = service.creerDepot(creation);
      const second = service.creerDepot(creation);
      const troisieme = service.creerDepot(creation);
      expect(new Set([premier.ticketNumero, second.ticketNumero, troisieme.ticketNumero]).size).toBe(3);
    });

    it('enregistre le client associé', () => {
      service.creerDepot(creation);
      const clients = JSON.parse(localStorage.getItem(CLE_CLIENTS) ?? '[]');
      expect(clients.length).toBe(1);
      expect(clients[0].nom).toBe('Awa Diallo');
    });
  });

  describe('tolérance du stockage', () => {
    it('retourne une liste vide si le JSON des dépôts est corrompu', () => {
      localStorage.setItem(CLE_DEPOTS, '{corrompu');
      expect(service.listerDepots()).toEqual([]);
    });

    it('retourne une liste vide si la valeur n’est pas un tableau', () => {
      localStorage.setItem(CLE_DEPOTS, '"pas-un-tableau"');
      expect(service.listerDepots()).toEqual([]);
    });

    it('ne bloque pas si le compteur est illisible', () => {
      localStorage.setItem(CLE_COMPTEUR_TICKET, 'abc');
      const depot = service.creerDepot(creation);
      expect(depot.ticketNumero).toMatch(/-0001$/);
    });
  });

  describe('listerDepots et getDepotById', () => {
    it('liste les dépôts persistés', () => {
      service.creerDepot(creation);
      service.creerDepot(creation);
      expect(service.listerDepots().length).toBe(2);
    });

    it('retrouve un dépôt par son identifiant', () => {
      const depot = service.creerDepot(creation);
      expect(service.getDepotById(depot.id)).toEqual(depot);
    });

    it('retourne undefined pour un identifiant inconnu', () => {
      expect(service.getDepotById('inconnu')).toBeUndefined();
    });
  });

  describe('modifierDateRetrait', () => {
    let depot: ReturnType<DepotStoreService['creerDepot']>;

    beforeEach(() => {
      depot = service.creerDepot(creation);
    });

    it("met à jour la date de retrait et l'engage dans le localStorage", () => {
      const nouvelleDate = new Date(
        depot.dateRetraitPrevue
      );
      nouvelleDate.setDate(nouvelleDate.getDate() + 3);

      const resultat = service.modifierDateRetrait(depot.id, nouvelleDate.toISOString());

      expect(resultat).not.toBeNull();
      expect(resultat!.dateRetraitPrevue).toBe(nouvelleDate.toISOString());
      expect(service.getDepotById(depot.id)!.dateRetraitPrevue).toBe(
        nouvelleDate.toISOString()
      );
    });

    it('conserve les autres champs du dépôt', () => {
      const nouvelleDate = new Date(Date.now() + 96 * 3_600_000).toISOString();
      const resultat = service.modifierDateRetrait(depot.id, nouvelleDate);
      expect(resultat!.ticketNumero).toBe(depot.ticketNumero);
      expect(resultat!.clientNom).toBe(depot.clientNom);
      expect(resultat!.articles).toEqual(depot.articles);
      expect(resultat!.dateDepot).toBe(depot.dateDepot);
    });

    it('retourne null pour un dépôt introuvable', () => {
      expect(
        service.modifierDateRetrait('inconnu', new Date(Date.now() + 96 * 3_600_000).toISOString())
      ).toBeNull();
    });

    it('refuse une date antérieure à la date de dépôt sans rien modifier', () => {
      const avant = service.getDepotById(depot.id)!.dateRetraitPrevue;
      const anterieure = new Date(depot.dateDepot);
      anterieure.setDate(anterieure.getDate() - 1);

      const resultat = service.modifierDateRetrait(depot.id, anterieure.toISOString());

      expect(resultat).toBeNull();
      expect(service.getDepotById(depot.id)!.dateRetraitPrevue).toBe(avant);
    });

    it('accepte une date de retrait le même jour que le dépôt', () => {
      const memeJour = new Date(depot.dateDepot);
      memeJour.setHours(memeJour.getHours() + 1);

      const resultat = service.modifierDateRetrait(depot.id, memeJour.toISOString());

      expect(resultat).not.toBeNull();
      expect(resultat!.dateRetraitPrevue).toBe(memeJour.toISOString());
    });
  });

  describe('rechercherDepots', () => {
    beforeEach(() => {
      service.creerDepot(creation);
      service.creerDepot({
        clientNom: 'Moussa Traoré',
        clientTelephone: '06 98 76 54 32',
        articles: [{ type: 'Robe', quantite: 1, service: 'Nettoyage à sec' }],
      });
    });

    it('recherche par numéro de ticket partiel, sans tenir compte de la casse', () => {
      const premier = service.listerDepots()[0];
      const resultat = service.rechercherDepots(premier.ticketNumero.slice(-5).toLowerCase());
      expect(resultat.length).toBe(1);
      expect(resultat[0].id).toBe(premier.id);
    });

    it('recherche par nom de client partiel, sans tenir compte de la casse', () => {
      const resultat = service.rechercherDepots('moussa');
      expect(resultat.length).toBe(1);
      expect(resultat[0].clientNom).toBe('Moussa Traoré');
    });

    it('retourne tous les dépôts si la requête est vide', () => {
      expect(service.rechercherDepots('   ').length).toBe(2);
    });

    it('retourne une liste vide si aucun dépôt ne correspond', () => {
      expect(service.rechercherDepots('zzz-inconnu')).toEqual([]);
    });
  });
});
