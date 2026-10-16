export interface Client {
  id: string;
  nom: string;
  telephone: string;
}

export interface DepotArticle {
  type: string;
  quantite: number;
  service: string;
}

export type DepotStatut = 'depose';

export const STATUT_LABELS: Record<DepotStatut, string> = {
  depose: 'Déposé',
};

export interface Depot {
  id: string;
  ticketNumero: string;
  clientId: string;
  clientNom: string;
  clientTelephone: string;
  articles: DepotArticle[];
  statut: DepotStatut;
  dateDepot: string;
  dateRetraitPrevue: string;
}

export interface DepotCreation {
  clientNom: string;
  clientTelephone: string;
  articles: DepotArticle[];
  dateRetrait?: string;
}

function pad2(valeur: number): string {
  return String(valeur).padStart(2, '0');
}

export function jourLocal(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function cleJour(valeur: string | Date): string | null {
  if (valeur instanceof Date) {
    return Number.isNaN(valeur.getTime()) ? null : jourLocal(valeur);
  }
  const brut = valeur.trim();
  if (!brut) {
    return null;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(brut)) {
    const date = new Date(`${brut}T00:00:00`);
    if (Number.isNaN(date.getTime()) || jourLocal(date) !== brut) {
      return null;
    }
    return brut;
  }
  const date = new Date(brut);
  return Number.isNaN(date.getTime()) ? null : jourLocal(date);
}

export function dateRetraitValide(dateRetrait: string, dateDepot: string): boolean {
  const jourRetrait = cleJour(dateRetrait);
  const jourDepot = cleJour(dateDepot);
  if (!jourRetrait || !jourDepot) {
    return false;
  }
  return jourRetrait >= jourDepot;
}

export function dateRetraitEnIso(valeurJour: string, heureRefIso: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valeurJour)) {
    return null;
  }
  const ref = new Date(heureRefIso);
  if (Number.isNaN(ref.getTime())) {
    return null;
  }
  const [annee, mois, jour] = valeurJour.split('-').map(Number);
  const date = new Date(
    annee,
    mois - 1,
    jour,
    ref.getHours(),
    ref.getMinutes(),
    ref.getSeconds(),
    ref.getMilliseconds()
  );
  if (date.getFullYear() !== annee || date.getMonth() !== mois - 1 || date.getDate() !== jour) {
    return null;
  }
  return date.toISOString();
}
