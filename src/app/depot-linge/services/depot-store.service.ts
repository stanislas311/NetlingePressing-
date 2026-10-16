import { Injectable } from '@angular/core';
import { Client, Depot, DepotCreation } from '../models/depot.model';

export const CLE_DEPOTS = 'netlinge.deposits';
export const CLE_CLIENTS = 'netlinge.customers';
export const CLE_COMPTEUR_TICKET = 'netlinge.ticketCounter';
export const DELAI_RETRAIT_HEURES = 48;

@Injectable({ providedIn: 'root' })
export class DepotStoreService {
  creerDepot(creation: DepotCreation): Depot {
    const maintenant = new Date();
    const client = this.enregistrerClient(creation.clientNom, creation.clientTelephone);
    const sequence = this.lireCompteur() + 1;
    this.ecrire(CLE_COMPTEUR_TICKET, String(sequence));

    const depot: Depot = {
      id: this.genererId(),
      ticketNumero: this.genererNumeroTicket(maintenant, sequence),
      clientId: client.id,
      clientNom: client.nom,
      clientTelephone: client.telephone,
      articles: creation.articles.map((a) => ({ ...a })),
      statut: 'depose',
      dateDepot: maintenant.toISOString(),
      dateRetraitPrevue: new Date(
        maintenant.getTime() + DELAI_RETRAIT_HEURES * 3_600_000
      ).toISOString(),
    };

    const depots = this.listerDepots();
    depots.push(depot);
    this.ecrire(CLE_DEPOTS, JSON.stringify(depots));
    return depot;
  }

  listerDepots(): Depot[] {
    const brut = this.lire(CLE_DEPOTS);
    if (!brut) {
      return [];
    }
    try {
      const depots = JSON.parse(brut);
      return Array.isArray(depots) ? (depots as Depot[]) : [];
    } catch {
      return [];
    }
  }

  rechercherDepots(requete: string): Depot[] {
    const filtre = requete.trim().toLowerCase();
    const depots = this.listerDepots();
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
