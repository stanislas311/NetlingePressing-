export type RoleUtilisateur = 'GERANT' | 'RECEPTIONNISTE';

export const ROLE_LABELS: Record<RoleUtilisateur, string> = {
  GERANT: 'Gérant',
  RECEPTIONNISTE: 'Réceptionniste',
};

export interface Utilisateur {
  id: string;
  identifiant: string;
  nom: string;
  role: RoleUtilisateur;
  sel: string;
  empreinte: string;
}

export interface SessionUtilisateur {
  id: string;
  identifiant: string;
  nom: string;
  role: RoleUtilisateur;
}

export const COMPTES_DEMO = {
  gerant: {
    identifiant: 'gerant',
    nom: 'Adjoua Kouassi',
    role: 'GERANT' as RoleUtilisateur,
    motDePasse: 'NetlingeGerant2026',
  },
  receptionniste: {
    identifiant: 'reception',
    nom: 'Koffi Yao',
    role: 'RECEPTIONNISTE' as RoleUtilisateur,
    motDePasse: 'NetlingeAccueil2026',
  },
};
