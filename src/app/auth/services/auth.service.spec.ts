import { TestBed } from '@angular/core/testing';
import { COMPTES_DEMO } from '../models/utilisateur.model';
import { AuthService, CLE_SESSION, CLE_UTILISATEURS } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('crée les comptes de démonstration au premier lancement', async () => {
    await service.initialiser();
    const comptes = service.listerComptes();
    expect(comptes.length).toBe(2);
    expect(comptes.map((c) => c.identifiant).sort()).toEqual(['gerant', 'reception']);
  });

  it('ne stocke jamais le mot de passe en clair', async () => {
    await service.initialiser();
    const brut = localStorage.getItem(CLE_UTILISATEURS) ?? '';
    expect(brut).not.toContain(COMPTES_DEMO.gerant.motDePasse);
    expect(brut).toContain('"sel"');
    expect(brut).toContain('"empreinte"');
  });

  it('connecte le gérant avec les identifiants valides', async () => {
    await service.initialiser();
    const ok = await service.connecter('gerant', COMPTES_DEMO.gerant.motDePasse);
    expect(ok).toBeTrue();
    expect(service.estConnecte()).toBeTrue();
    expect(service.estGerant()).toBeTrue();
    expect(service.utilisateurCourant()?.nom).toBe(COMPTES_DEMO.gerant.nom);
  });

  it('refuse un mot de passe incorrect', async () => {
    await service.initialiser();
    const ok = await service.connecter('gerant', 'mauvais-mot-de-passe');
    expect(ok).toBeFalse();
    expect(service.estConnecte()).toBeFalse();
  });

  it('restaure la session après rechargement', async () => {
    await service.initialiser();
    await service.connecter('reception', COMPTES_DEMO.receptionniste.motDePasse);
    const session = localStorage.getItem(CLE_SESSION);
    expect(session).not.toBeNull();
    service.deconnecter();
    localStorage.setItem(CLE_SESSION, session!);
    await service.initialiser();
    expect(service.estConnecte()).toBeTrue();
    expect(service.utilisateurCourant()?.identifiant).toBe('reception');
    expect(service.estGerant()).toBeFalse();
  });

  it('efface la session à la déconnexion', async () => {
    await service.initialiser();
    await service.connecter('gerant', COMPTES_DEMO.gerant.motDePasse);
    service.deconnecter();
    expect(service.estConnecte()).toBeFalse();
    expect(localStorage.getItem(CLE_SESSION)).toBeNull();
  });

  it('autorise le gérant à créer un compte', async () => {
    await service.initialiser();
    await service.connecter('gerant', COMPTES_DEMO.gerant.motDePasse);
    const cree = await service.creerCompte('ami', 'Ami Nguessan', 'RECEPTIONNISTE', 'MotDePasse8');
    expect(cree).not.toBeNull();
    expect(service.listerComptes().some((c) => c.identifiant === 'ami')).toBeTrue();
  });

  it('interdit au réceptionniste de créer un compte', async () => {
    await service.initialiser();
    await service.connecter('reception', COMPTES_DEMO.receptionniste.motDePasse);
    const cree = await service.creerCompte('intrus', 'Intrus', 'RECEPTIONNISTE', 'MotDePasse8');
    expect(cree).toBeNull();
  });
});
