import { Injectable } from '@angular/core';
import { Depot, depotVerrouille } from '../../depot-linge/models/depot.model';

export type TypeNotification = 'depot' | 'pret' | 'retard';

export interface NotificationApp {
  id: string;
  type: TypeNotification;
  titre: string;
  message: string;
  date: string;
  depotId?: string;
}

export const CLE_NOTIFICATIONS = 'netlinge.notifications';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  lister(): NotificationApp[] {
    const brut = this.lire();
    if (!brut) {
      return [];
    }
    try {
      const data = JSON.parse(brut);
      return Array.isArray(data) ? (data as NotificationApp[]) : [];
    } catch {
      return [];
    }
  }

  ajouter(type: TypeNotification, titre: string, message: string, depotId?: string): void {
    const toutes = this.lister();
    toutes.unshift({
      id: this.genererId(),
      type,
      titre,
      message,
      date: new Date().toISOString(),
      depotId,
    });
    this.ecrire(JSON.stringify(toutes.slice(0, 80)));
  }

  synchroniserRetards(depots: Depot[]): void {
    const existantes = this.lister();
    const maintenant = Date.now();
    for (const depot of depots) {
      if (depotVerrouille(depot.statut)) {
        continue;
      }
      if (new Date(depot.dateRetraitPrevue).getTime() >= maintenant) {
        continue;
      }
      const deja = existantes.some((n) => n.type === 'retard' && n.depotId === depot.id);
      if (!deja) {
        this.ajouter(
          'retard',
          'Retard de retrait',
          `Le ticket ${depot.ticketNumero} (${depot.clientNom}) a dépassé la date de retrait prévue.`,
          depot.id
        );
      }
    }
  }

  private genererId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  private lire(): string | null {
    try {
      return localStorage.getItem(CLE_NOTIFICATIONS);
    } catch {
      return null;
    }
  }

  private ecrire(valeur: string): void {
    try {
      localStorage.setItem(CLE_NOTIFICATIONS, valeur);
    } catch {
      // ignore
    }
  }
}
