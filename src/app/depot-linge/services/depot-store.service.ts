import { Injectable, Optional } from '@angular/core';
import { TarifService } from '../../facturation/services/tarif.service';
import { NotificationService } from '../../notifications/services/notification.service';
import {
  Client,
  dateRetraitEnIso,
  dateRetraitValide,
  Depot,
  DepotCreation,
  depotVerrouille,
  DepotStatut,
  Paiement,
  soldeRestant,
  STATUTS_ORDE,
} from '../models/depot.model';

export const CLE_DEPOTS = 'netlinge.deposits';
export const CLE_CLIENTS = 'netlinge.customers';
export const CLE_COMPTEUR_TICKET = 'netlinge.ticketCounter';
export const DELAI_RETRAIT_HEURES = 48;

@Injectable({ providedIn: 'root' })
export class DepotStoreService {
  private readonly tarifs: TarifService;
  private readonly notifications: NotificationService;

  constructor(
    @Optional() tarifs?: TarifService,
    @Optional() notifications?: NotificationService
  ) {
    this.tarifs = tarifs ?? new TarifService();
    this.notifications = notifications ?? new NotificationService();
  }

  creerDepot(creation: DepotCreation): Depot {
    const maintenant = new Date();
    const client = this.enregistrerClient(creation.clientNom, creation.clientTelephone);
    const sequence = this.lireCompteur() + 1;
    this.ecrire(CLE_COMPTEUR_TICKET, String(sequence));

    const dateDepotIso = maintenant.toISOString();
    const dateRetraitChoisie = creation.dateRetrait
      ? dateRetraitEnIso(creation.dateRetrait, dateDepotIso)
      : null;
    const dateRetraitPrevue =
      dateRetraitChoisie && dateRetraitValide(dateRetraitChoisie, dateDepotIso)
        ? dateRetraitChoisie
        : new Date(maintenant.getTime() + DELAI_RETRAIT_HEURES * 3_600_000).toISOString();

    const articles = creation.articles.map((a) => ({ ...a }));
    const montantTotal = articles.reduce(
      (somme, a) => somme + this.tarifs.prix(a.type, a.service) * a.quantite,
      0
    );
    const avance = Math.max(0, Number(creation.avance) || 0);
    const paiements: Paiement[] =
      avance > 0
        ? [{ montant: Math.min(avance, montantTotal), date: dateDepotIso, libelle: 'Avance à la dépose' }]
        : [];

    const depot: Depot = {
      id: this.genererId(),
      ticketNumero: this.genererNumeroTicket(maintenant, sequence),
      clientId: client.id,
      clientNom: client.nom,
      clientTelephone: client.telephone,
      articles,
      statut: 'depose',
      dateDepot: dateDepotIso,
      dateRetraitPrevue,
      historiqueStatuts: [{ ancien: null, nouveau: 'depose', date: dateDepotIso }],
      montantTotal,
      paiements,
    };

    const depots = this.listerDepots();
    depots.push(depot);
    this.ecrire(CLE_DEPOTS, JSON.stringify(depots));
    this.notifications.ajouter(
      'depot',
      'Dépôt enregistré',
      `Ticket ${depot.ticketNumero} pour ${depot.clientNom}.`,
      depot.id
    );
    return depot;
  }

  listerDepots(): Depot[] {
    const brut = this.lire(CLE_DEPOTS);
    if (!brut) {
      return [];
    }
    try {
      const depots = JSON.parse(brut);
      return Array.isArray(depots) ? (depots as Depot[]).map((d) => this.normaliserDepot(d)) : [];
    } catch {
      return [];
    }
  }

  rechercherDepots(requete: string, statutFiltre?: DepotStatut): Depot[] {
    const filtre = requete.trim().toLowerCase();
    let depots = this.listerDepots();
    if (statutFiltre) {
      depots = depots.filter((d) => d.statut === statutFiltre);
    }
    if (!filtre) {
      return depots;
    }
    return depots.filter(
      (d) =>
        d.ticketNumero.toLowerCase().includes(filtre) ||
        d.clientNom.toLowerCase().includes(filtre)
    );
  }

  getDepotById(id: string): Depot | undefined {
    return this.listerDepots().find((d) => d.id === id);
  }

  passerAuStatutSuivant(depotId: string): Depot | null {
    const depots = this.listerDepots();
    const index = depots.findIndex((d) => d.id === depotId);
    if (index === -1) {
      return null;
    }
    const depot = depots[index];
    const indexCourant = STATUTS_ORDE.indexOf(depot.statut);
    if (indexCourant === -1 || indexCourant >= STATUTS_ORDE.length - 1) {
      return null;
    }
    const nouveauStatut = STATUTS_ORDE[indexCourant + 1];
    if (nouveauStatut === 'livre' && soldeRestant(depot) > 0) {
      return null;
    }
    const maintenant = new Date().toISOString();
    const misAJour: Depot = {
      ...depot,
      statut: nouveauStatut,
      historiqueStatuts: [
        ...depot.historiqueStatuts,
        { ancien: depot.statut, nouveau: nouveauStatut, date: maintenant },
      ],
    };
    if (nouveauStatut === 'livre') {
      misAJour.dateRetraitReelle = maintenant;
    }
    depots[index] = misAJour;
    this.ecrire(CLE_DEPOTS, JSON.stringify(depots));
    if (nouveauStatut === 'pret') {
      this.notifications.ajouter(
        'pret',
        'Linge prêt',
        `Le ticket ${misAJour.ticketNumero} de ${misAJour.clientNom} est prêt à retirer.`,
        misAJour.id
      );
    }
    return misAJour;
  }

  enregistrerPaiement(depotId: string, montant: number): Depot | null {
    const depots = this.listerDepots();
    const index = depots.findIndex((d) => d.id === depotId);
    if (index === -1) {
      return null;
    }
    const depot = depots[index];
    if (depotVerrouille(depot.statut)) {
      return null;
    }
    const restant = soldeRestant(depot);
    if (!Number.isFinite(montant) || montant <= 0 || montant > restant) {
      return null;
    }
    const misAJour: Depot = {
      ...depot,
      paiements: [
        ...(depot.paiements ?? []),
        { montant, date: new Date().toISOString(), libelle: 'Paiement' },
      ],
    };
    depots[index] = misAJour;
    this.ecrire(CLE_DEPOTS, JSON.stringify(depots));
    return misAJour;
  }

  annulerDepot(depotId: string, motif: string): Depot | null {
    const motifPropre = motif.trim();
    if (!motifPropre) {
      return null;
    }
    const depots = this.listerDepots();
    const index = depots.findIndex((d) => d.id === depotId);
    if (index === -1) {
      return null;
    }
    const depot = depots[index];
    if (depotVerrouille(depot.statut)) {
      return null;
    }
    const maintenant = new Date().toISOString();
    const misAJour: Depot = {
      ...depot,
      statut: 'annule',
      motifAnnulation: motifPropre,
      historiqueStatuts: [
        ...depot.historiqueStatuts,
        { ancien: depot.statut, nouveau: 'annule', date: maintenant },
      ],
    };
    depots[index] = misAJour;
    this.ecrire(CLE_DEPOTS, JSON.stringify(depots));
    return misAJour;
  }

  modifierDateRetrait(depotId: string, nouvelleDateIso: string): Depot | null {
    const depots = this.listerDepots();
    const index = depots.findIndex((d) => d.id === depotId);
    if (index === -1) {
      return null;
    }
    const depot = depots[index];
    if (depotVerrouille(depot.statut)) {
      return null;
    }
    if (!dateRetraitValide(nouvelleDateIso, depot.dateDepot)) {
      return null;
    }
    const misAJour: Depot = { ...depot, dateRetraitPrevue: nouvelleDateIso };
    depots[index] = misAJour;
    this.ecrire(CLE_DEPOTS, JSON.stringify(depots));
    return misAJour;
  }

  private normaliserDepot(depot: Depot): Depot {
    const statutValide: DepotStatut[] = [...STATUTS_ORDE, 'annule'];
    const statut =
      depot.statut && statutValide.includes(depot.statut) ? depot.statut : 'depose';
    const historique =
      Array.isArray(depot.historiqueStatuts) && depot.historiqueStatuts.length > 0
        ? depot.historiqueStatuts
        : [{ ancien: null, nouveau: statut, date: depot.dateDepot }];
    return {
      ...depot,
      statut,
      historiqueStatuts: historique,
      montantTotal: depot.montantTotal ?? 0,
      paiements: Array.isArray(depot.paiements) ? depot.paiements : [],
    };
  }

  private enregistrerClient(nom: string, telephone: string): Client {
    const clients = this.lireClients();
    const existant = clients.find(
      (c) =>
        c.nom.trim().toLowerCase() === nom.trim().toLowerCase() &&
        c.telephone.replace(/\s/g, '') === telephone.replace(/\s/g, '')
    );
    if (existant) {
      return existant;
    }
    const client: Client = { id: this.genererId(), nom: nom.trim(), telephone: telephone.trim() };
    clients.push(client);
    this.ecrire(CLE_CLIENTS, JSON.stringify(clients));
    return client;
  }

  private lireClients(): Client[] {
    const brut = this.lire(CLE_CLIENTS);
    if (!brut) {
      return [];
    }
    try {
      const clients = JSON.parse(brut);
      return Array.isArray(clients) ? (clients as Client[]) : [];
    } catch {
      return [];
    }
  }

  private lireCompteur(): number {
    const brut = this.lire(CLE_COMPTEUR_TICKET);
    const valeur = Number(brut);
    return Number.isInteger(valeur) && valeur >= 0 ? valeur : 0;
  }

  private genererNumeroTicket(date: Date, sequence: number): string {
    const annee = date.getFullYear();
    const mois = String(date.getMonth() + 1).padStart(2, '0');
    const jour = String(date.getDate()).padStart(2, '0');
    return `DP-${annee}${mois}${jour}-${String(sequence).padStart(4, '0')}`;
  }

  private genererId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  private lire(cle: string): string | null {
    try {
      return localStorage.getItem(cle);
    } catch {
      return null;
    }
  }

  private ecrire(cle: string, valeur: string): void {
    try {
      localStorage.setItem(cle, valeur);
    } catch {
      // Stockage indisponible ou quota dépassé : on continue sans bloquer l'utilisateur.
    }
  }
}
