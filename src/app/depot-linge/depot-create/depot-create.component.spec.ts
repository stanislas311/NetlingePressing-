import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { DepotCreateComponent } from './depot-create.component';
import { DepotStoreService, DELAI_RETRAIT_HEURES } from '../services/depot-store.service';
import { Depot, jourLocal } from '../models/depot.model';

describe('DepotCreateComponent', () => {
  let fixture: ComponentFixture<DepotCreateComponent>;
  let component: DepotCreateComponent;
  let storeSpy: jasmine.SpyObj<DepotStoreService>;
  let navigateSpy: jasmine.Spy;

  const depotFake: Depot = {
    id: 'dep-1',
    ticketNumero: 'DP-20261016-0001',
    clientId: 'cli-1',
    clientNom: 'Awa Diallo',
    clientTelephone: '07 12 34 56 78',
    articles: [{ type: 'Chemise', quantite: 2, service: 'Lavage' }],
    statut: 'depose',
    dateDepot: new Date().toISOString(),
    dateRetraitPrevue: new Date(Date.now() + 48 * 3_600_000).toISOString(),
    historiqueStatuts: [],
  };

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj('DepotStoreService', ['creerDepot']);
    storeSpy.creerDepot.and.returnValue(depotFake);

    await TestBed.configureTestingModule({
      imports: [DepotCreateComponent],
      providers: [provideRouter([]), { provide: DepotStoreService, useValue: storeSpy }],
    }).compileComponents();

    navigateSpy = spyOn(TestBed.inject(Router), 'navigate').and.returnValue(
      Promise.resolve(true)
    );

    fixture = TestBed.createComponent(DepotCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it("utilise les composants du design system (champs, cartes, boutons)", () => {
    const noeud = fixture.nativeElement as HTMLElement;
    expect(noeud.querySelectorAll('np-form-field').length).toBeGreaterThanOrEqual(4);
    expect(noeud.querySelectorAll('np-card').length).toBe(3);
    expect(noeud.querySelector('button[type="submit"]')?.textContent).toContain(
      'Enregistrer le dépôt'
    );
  });

  it("associe le libellé Nom du client au champ id nom", () => {
    const noeud = fixture.nativeElement as HTMLElement;
    const label = noeud.querySelector('label[for="nom"]') as HTMLLabelElement;
    const input = noeud.querySelector('#nom') as HTMLInputElement;
    expect(label).not.toBeNull();
    expect(input).not.toBeNull();
  });

  it('commence avec un seul article dans le formulaire', () => {
    expect(component.articles.length).toBe(1);
  });

  it("ajoute un article via le bouton Ajouter un article", () => {
    component.ajouterArticle();
    expect(component.articles.length).toBe(2);
  });

  it("retire un article via le bouton Retirer l'article", () => {
    component.ajouterArticle();
    component.supprimerArticle(0);
    expect(component.articles.length).toBe(1);
  });

  it('ne retire pas le dernier article restant', () => {
    component.supprimerArticle(0);
    expect(component.articles.length).toBe(1);
  });

  it('bloque la soumission si le formulaire est invalide', () => {
    component.onSubmit();
    expect(storeSpy.creerDepot).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it("bloque la soumission si aucun article n'est complet", () => {
    component.form.get(['client', 'nom'])!.setValue('Awa Diallo');
    component.form.get(['client', 'telephone'])!.setValue('07 12 34 56 78');
    component.articles.at(0).get('type')!.setValue('Chemise');
    component.articles.at(0).get('quantite')!.setValue(0);
    component.onSubmit();
    expect(storeSpy.creerDepot).not.toHaveBeenCalled();
    expect(component.afficherErreurAucunArticle).toBeTrue();
  });

  it("accepte la soumission quand un seul article est complet parmi plusieurs", () => {
    component.ajouterArticle();
    component.form.get(['client', 'nom'])!.setValue('Awa Diallo');
    component.form.get(['client', 'telephone'])!.setValue('07 12 34 56 78');
    const premier = component.articles.at(0);
    premier.get('type')!.setValue('Chemise');
    premier.get('quantite')!.setValue(2);
    premier.get('service')!.setValue('Lavage');
    component.articles.at(1).get('type')!.setValue('');
    component.onSubmit();
    expect(storeSpy.creerDepot).toHaveBeenCalledTimes(1);
  });

  it('appelle le service et redirige vers le ticket lors soumission valide', () => {
    component.form.get(['client', 'nom'])!.setValue('Awa Diallo');
    component.form.get(['client', 'telephone'])!.setValue('07 12 34 56 78');
    const article = component.articles.at(0);
    article.get('type')!.setValue('Chemise');
    article.get('quantite')!.setValue(2);
    article.get('service')!.setValue('Lavage');

    component.onSubmit();

    expect(storeSpy.creerDepot).toHaveBeenCalledWith({
      clientNom: 'Awa Diallo',
      clientTelephone: '07 12 34 56 78',
      dateRetrait: jourLocal(
        new Date(Date.now() + DELAI_RETRAIT_HEURES * 3_600_000)
      ),
      articles: [{ type: 'Chemise', quantite: 2, service: 'Lavage' }],
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/depots', 'dep-1', 'ticket']);
    expect(component.messageConfirmation).toContain('DP-20261016-0001');
  });

  it("rejette un numéro de téléphone invalide", () => {
    component.form.get(['client', 'telephone'])!.setValue('12');
    component.form.get(['client', 'telephone'])!.markAsTouched();
    expect(component.erreurClient('telephone')).not.toBeNull();
  });

  it('accepte un numéro de téléphone avec espaces et parenthèses', () => {
    component.form.get(['client', 'telephone'])!.setValue('(07) 12.34.56.78');
    component.form.get(['client', 'telephone'])!.markAsTouched();
    expect(component.erreurClient('telephone')).toBeNull();
  });

  describe('champ date de retrait', () => {
    function remplirFormulaire(): void {
      component.form.get(['client', 'nom'])!.setValue('Awa Diallo');
      component.form.get(['client', 'telephone'])!.setValue('07 12 34 56 78');
      const article = component.articles.at(0);
      article.get('type')!.setValue('Chemise');
      article.get('quantite')!.setValue(2);
      article.get('service')!.setValue('Lavage');
    }

    it("pré-remplit la date de retrait avec la date de dépôt plus 48 heures", () => {
      const attendu = jourLocal(
        new Date(Date.now() + DELAI_RETRAIT_HEURES * 3_600_000)
      );
      expect(component.form.get('dateRetrait')!.value).toBe(attendu);
    });

    it('accepte une date de retrait postérieure à la date de dépôt', () => {
      remplirFormulaire();
      component.form
        .get('dateRetrait')!
        .setValue(jourLocal(new Date(Date.now() + 96 * 3_600_000)));
      component.onSubmit();
      expect(storeSpy.creerDepot).toHaveBeenCalledTimes(1);
      expect(component.erreurDateRetrait()).toBeNull();
    });

    it('accepte une date de retrait le même jour que le dépôt', () => {
      remplirFormulaire();
      component.form.get('dateRetrait')!.setValue(jourLocal(new Date()));
      component.onSubmit();
      expect(storeSpy.creerDepot).toHaveBeenCalledTimes(1);
    });

    it('bloque la soumission et signale une date de retrait antérieure', () => {
      remplirFormulaire();
      component.form
        .get('dateRetrait')!
        .setValue(jourLocal(new Date(Date.now() - 86_400_000)));
      component.form.get('dateRetrait')!.markAsTouched();

      component.onSubmit();

      expect(storeSpy.creerDepot).not.toHaveBeenCalled();
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(component.erreurDateRetrait()).toBe(
        'La date de retrait ne peut pas être antérieure à la date de dépôt.'
      );
      fixture.detectChanges();
      const texte = (fixture.nativeElement as HTMLElement).textContent ?? '';
      expect(texte).toContain(
        'La date de retrait ne peut pas être antérieure à la date de dépôt.'
      );
    });

    it('transmet la date de retrait choisie au service de création', () => {
      remplirFormulaire();
      const choisie = jourLocal(new Date(Date.now() + 120 * 3_600_000));
      component.form.get('dateRetrait')!.setValue(choisie);

      component.onSubmit();

      expect(storeSpy.creerDepot).toHaveBeenCalledTimes(1);
      expect(storeSpy.creerDepot.calls.mostRecent().args[0].dateRetrait).toBe(
        choisie
      );
    });
  });
});
