import { genererSel, hacherMotDePasse, verifierMotDePasse } from './mot-de-passe.util';

describe('mot-de-passe.util', () => {
  it('produit une empreinte différente du mot de passe en clair', async () => {
    const sel = genererSel();
    const empreinte = await hacherMotDePasse('secret-demo', sel);
    expect(empreinte).not.toBe('secret-demo');
    expect(empreinte.length).toBe(64);
  });

  it('valide le bon mot de passe et refuse un mauvais', async () => {
    const sel = genererSel();
    const empreinte = await hacherMotDePasse('secret-demo', sel);
    expect(await verifierMotDePasse('secret-demo', sel, empreinte)).toBeTrue();
    expect(await verifierMotDePasse('autre', sel, empreinte)).toBeFalse();
  });
});
