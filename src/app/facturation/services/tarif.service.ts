import { Injectable } from '@angular/core';

export interface Tarif {
  type: string;
  service: string;
  prix: number;
}

export const CLE_TARIFS = 'netlinge.tarifs';

export const TYPES_ARTICLES = ['Chemise', 'Pantalon', 'Costume', 'Robe'];
export const SERVICES_CATALOGUE = ['Lavage', 'Repassage', 'Nettoyage à sec'];

const TARIFS_DEFAUT: Tarif[] = [
  { type: 'Chemise', service: 'Lavage', prix: 1000 },
  { type: 'Chemise', service: 'Repassage', prix: 800 },
  { type: 'Chemise', service: 'Nettoyage à sec', prix: 1500 },
  { type: 'Pantalon', service: 'Lavage', prix: 1200 },
  { type: 'Pantalon', service: 'Repassage', prix: 1000 },
  { type: 'Pantalon', service: 'Nettoyage à sec', prix: 2000 },
  { type: 'Costume', service: 'Repassage', prix: 2500 },
  { type: 'Costume', service: 'Nettoyage à sec', prix: 4000 },
  { type: 'Robe', service: 'Lavage', prix: 1500 },
  { type: 'Robe', service: 'Repassage', prix: 1200 },
  { type: 'Robe', service: 'Nettoyage à sec', prix: 2500 },
];

@Injectable({ providedIn: 'root' })
export class TarifService {
  lister(): Tarif[] {
    const brut = this.lire();
    if (!brut) {
      this.ecrire(JSON.stringify(TARIFS_DEFAUT));
      return TARIFS_DEFAUT.map((t) => ({ ...t }));
    }
    try {
      const data = JSON.parse(brut);
      return Array.isArray(data) && data.length > 0 ? (data as Tarif[]) : TARIFS_DEFAUT.map((t) => ({ ...t }));
    } catch {
      return TARIFS_DEFAUT.map((t) => ({ ...t }));
    }
  }

  prix(type: string, service: string): number {
    const tarif = this.lister().find(
      (t) => t.type.toLowerCase() === type.trim().toLowerCase() && t.service.toLowerCase() === service.trim().toLowerCase()
    );
    return tarif ? tarif.prix : 0;
  }

  enregistrer(tarifs: Tarif[]): void {
    const propres = tarifs
      .map((t) => ({
        type: t.type.trim(),
        service: t.service.trim(),
        prix: Math.max(0, Number(t.prix) || 0),
      }))
      .filter((t) => t.type && t.service);
    this.ecrire(JSON.stringify(propres));
  }

  private lire(): string | null {
    try {
      return localStorage.getItem(CLE_TARIFS);
    } catch {
      return null;
    }
  }

  private ecrire(valeur: string): void {
    try {
      localStorage.setItem(CLE_TARIFS, valeur);
    } catch {
      // ignore
    }
  }
}
