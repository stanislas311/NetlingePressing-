import { Injectable, signal } from '@angular/core';
import {
  COMPTES_DEMO,
  RoleUtilisateur,
  SessionUtilisateur,
  Utilisateur,
} from '../models/utilisateur.model';
import { genererSel, hacherMotDePasse, verifierMotDePasse } from './mot-de-passe.util';

export const CLE_UTILISATEURS = 'netlinge.users';
export const CLE_SESSION = 'netlinge.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session = signal<SessionUtilisateur | null>(null);

  readonly utilisateurCourant = this.session.asReadonly();

  async initialiser(): Promise<void> {
    const existants = this.lireUtilisateurs();
    if (existants.length === 0) {
      await this.creerCompteInterne(
        COMPTES_DEMO.gerant.identifiant,
        COMPTES_DEMO.gerant.nom,
        COMPTES_DEMO.gerant.role,
        COMPTES_DEMO.gerant.motDePasse
      );
      await this.creerCompteInterne(
        COMPTES_DEMO.receptionniste.identifiant,
        COMPTES_DEMO.receptionniste.nom,
        COMPTES_DEMO.receptionniste.role,
        COMPTES_DEMO.receptionniste.motDePasse
      );
    }
    this.restaurerSession();
  }

  estConnecte(): boolean {
    return this.session() !== null;
  }

  estGerant(): boolean {
    return this.session()?.role === 'GERANT';
  }

  async connecter(identifiant: string, motDePasse: string): Promise<boolean> {
    const cible = identifiant.trim().toLowerCase();
    const utilisateur = this.lireUtilisateurs().find(
      (u) => u.identifiant.toLowerCase() === cible
    );
    if (!utilisateur) {
      return false;
    }
    const ok = await verifierMotDePasse(motDePasse, utilisateur.sel, utilisateur.empreinte);
    if (!ok) {
      return false;
    }
    const session: SessionUtilisateur = {
      id: utilisateur.id,
      identifiant: utilisateur.identifiant,
      nom: utilisateur.nom,
      role: utilisateur.role,
    };
    this.ecrire(CLE_SESSION, JSON.stringify({ id: utilisateur.id }));
    this.session.set(session);
    return true;
  }

  deconnecter(): void {
    try {
      localStorage.removeItem(CLE_SESSION);
    } catch {
      // ignore
    }
    this.session.set(null);
  }

  listerComptes(): SessionUtilisateur[] {
    return this.lireUtilisateurs().map((u) => ({
      id: u.id,
      identifiant: u.identifiant,
      nom: u.nom,
      role: u.role,
    }));
  }

  async creerCompte(
    identifiant: string,
    nom: string,
    role: RoleUtilisateur,
    motDePasse: string
  ): Promise<SessionUtilisateur | null> {
    if (!this.estGerant()) {
      return null;
    }
    const identifiantPropre = identifiant.trim().toLowerCase();
    const nomPropre = nom.trim();
    if (!identifiantPropre || !nomPropre || motDePasse.length < 8) {
      return null;
    }
    const deja = this.lireUtilisateurs().some(
      (u) => u.identifiant.toLowerCase() === identifiantPropre
    );
    if (deja) {
      return null;
    }
    const cree = await this.creerCompteInterne(identifiantPropre, nomPropre, role, motDePasse);
    return {
      id: cree.id,
      identifiant: cree.identifiant,
      nom: cree.nom,
      role: cree.role,
    };
  }

  private async creerCompteInterne(
    identifiant: string,
    nom: string,
    role: RoleUtilisateur,
    motDePasse: string
  ): Promise<Utilisateur> {
    const sel = genererSel();
    const empreinte = await hacherMotDePasse(motDePasse, sel);
    const utilisateur: Utilisateur = {
      id: this.genererId(),
      identifiant,
      nom,
      role,
      sel,
      empreinte,
    };
    const tous = this.lireUtilisateurs();
    tous.push(utilisateur);
    this.ecrire(CLE_UTILISATEURS, JSON.stringify(tous));
    return utilisateur;
  }

  private restaurerSession(): void {
    const brut = this.lire(CLE_SESSION);
    if (!brut) {
      this.session.set(null);
      return;
    }
    try {
      const data = JSON.parse(brut) as { id?: string };
      const utilisateur = this.lireUtilisateurs().find((u) => u.id === data.id);
      if (!utilisateur) {
        this.session.set(null);
        return;
      }
      this.session.set({
        id: utilisateur.id,
        identifiant: utilisateur.identifiant,
        nom: utilisateur.nom,
        role: utilisateur.role,
      });
    } catch {
      this.session.set(null);
    }
  }

  private lireUtilisateurs(): Utilisateur[] {
    const brut = this.lire(CLE_UTILISATEURS);
    if (!brut) {
      return [];
    }
    try {
      const data = JSON.parse(brut);
      return Array.isArray(data) ? (data as Utilisateur[]) : [];
    } catch {
      return [];
    }
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
      // Stockage indisponible
    }
  }
}
