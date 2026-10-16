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
}
