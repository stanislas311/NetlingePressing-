import {
  dateRetraitEnIso,
  dateRetraitValide,
  jourLocal,
} from './depot.model';

describe('utilitaires de date de retrait', () => {
  describe('jourLocal', () => {
    it('formate une date au format YYYY-MM-DD selon la timezone locale', () => {
      expect(jourLocal(new Date(2026, 9, 16, 23, 59))).toBe('2026-10-16');
    });
  });

  describe('dateRetraitValide', () => {
    it('accepte une date de retrait postérieure à la date de dépôt', () => {
      expect(dateRetraitValide('2026-10-18', '2026-10-16')).toBeTrue();
    });

    it('accepte une date de retrait le même jour que le dépôt', () => {
      expect(dateRetraitValide('2026-10-16', '2026-10-16')).toBeTrue();
    });

    it('refuse une date de retrait antérieure à la date de dépôt', () => {
      expect(dateRetraitValide('2026-10-15', '2026-10-16')).toBeFalse();
    });

    it('compare au niveau du jour même avec des horodatages ISO', () => {
      const depot = new Date(2026, 9, 16, 8, 30).toISOString();
      const retraitMemeJour = new Date(2026, 9, 16, 22, 0).toISOString();
      const retraitAvant = new Date(2026, 9, 15, 22, 0).toISOString();
      expect(dateRetraitValide(retraitMemeJour, depot)).toBeTrue();
      expect(dateRetraitValide(retraitAvant, depot)).toBeFalse();
    });

    it('refuse une valeur vide ou illisible', () => {
      expect(dateRetraitValide('', '2026-10-16')).toBeFalse();
      expect(dateRetraitValide('2026-10-16', '')).toBeFalse();
      expect(dateRetraitValide('pas-une-date', '2026-10-16')).toBeFalse();
      expect(dateRetraitValide('2026-10-16', 'pas-une-date')).toBeFalse();
    });

    it('refuse un jour de calendrier inexistant', () => {
      expect(dateRetraitValide('2026-02-30', '2026-02-01')).toBeFalse();
    });
  });

  describe('dateRetraitEnIso', () => {
    it('convertit une date de saisie en ISO en conservant le jour choisi', () => {
      const iso = dateRetraitEnIso('2026-10-20', '2026-10-16T14:30:00.000Z');
      expect(iso).not.toBeNull();
      expect(jourLocal(new Date(iso!))).toBe('2026-10-20');
    });

    it("conserve l'heure de la date de référence", () => {
      const ref = new Date(2026, 9, 16, 14, 30, 0, 0);
      const iso = dateRetraitEnIso('2026-10-20', ref.toISOString());
      const resultat = new Date(iso!);
      expect(resultat.getHours()).toBe(ref.getHours());
      expect(resultat.getMinutes()).toBe(ref.getMinutes());
    });

    it('refuse une valeur hors format YYYY-MM-DD', () => {
      expect(dateRetraitEnIso('20/10/2026', new Date().toISOString())).toBeNull();
      expect(dateRetraitEnIso('', new Date().toISOString())).toBeNull();
    });

    it('refuse un jour de calendrier inexistant', () => {
      expect(dateRetraitEnIso('2026-02-30', new Date().toISOString())).toBeNull();
    });
  });
});
