import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NpButtonComponent } from '../../systeme-design/np-button/np-button.component';
import { NpCardComponent } from '../../systeme-design/np-card/np-card.component';
import { NpFormFieldComponent } from '../../systeme-design/np-form-field/np-form-field.component';
import { dateRetraitValide, formaterMontant, jourLocal } from '../models/depot.model';
import { DELAI_RETRAIT_HEURES, DepotStoreService } from '../services/depot-store.service';
import { SERVICES_CATALOGUE, TarifService, TYPES_ARTICLES } from '../../facturation/services/tarif.service';

export function telephoneValidator(control: AbstractControl): ValidationErrors | null {
  const valeur: string = control.value ?? '';
  if (!valeur) {
    return null;
  }
  if (!/^[0-9\s().+-]+$/.test(valeur)) {
    return { telephone: true };
  }
  const chiffres = valeur.replace(/\D/g, '');
  if (chiffres.length < 8 || chiffres.length > 15) {
    return { telephone: true };
  }
  return null;
}

export function dateRetraitValidator(control: AbstractControl): ValidationErrors | null {
  const valeur: string = control.value ?? '';
  if (!valeur) {
    return null;
  }
  return dateRetraitValide(valeur, jourLocal(new Date())) ? null : { dateRetraitAnterieure: true };
}

@Component({
  selector: 'app-depot-create',
  imports: [ReactiveFormsModule, RouterLink, NpButtonComponent, NpCardComponent, NpFormFieldComponent],
  templateUrl: './depot-create.component.html',
  styleUrl: './depot-create.component.css',
})
export class DepotCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(DepotStoreService);
  private readonly tarifs = inject(TarifService);
  private readonly router = inject(Router);
  readonly types = TYPES_ARTICLES;
  readonly services = SERVICES_CATALOGUE;

  soumis = false;
  messageConfirmation: string | null = null;

  readonly form: FormGroup = this.fb.group({
    client: this.fb.group({
      nom: ['', [Validators.required, Validators.maxLength(120)]],
      telephone: ['', [Validators.required, telephoneValidator]],
    }),
    dateRetrait: [
      jourLocal(new Date(Date.now() + DELAI_RETRAIT_HEURES * 3_600_000)),
      [Validators.required, dateRetraitValidator],
    ],
    articles: this.fb.array([this.creerArticle()]),
    avance: [0, [Validators.min(0)]],
  });

  get articles(): FormArray {
    return this.form.controls['articles'] as FormArray;
  }

  get articlesValides(): FormGroup[] {
    return this.articles.controls.filter((c) => c.valid) as FormGroup[];
  }

  ajouterArticle(): void {
    this.articles.push(this.creerArticle());
  }

  supprimerArticle(index: number): void {
    if (this.articles.length > 1) {
      this.articles.removeAt(index);
    }
  }

  erreurClient(champ: 'nom' | 'telephone'): string | null {
    const control = this.form.get(['client', champ]);
    if (!control || (!control.invalid) || (!control.touched && !this.soumis)) {
      return null;
    }
    if (control.hasError('required')) {
      return champ === 'nom' ? 'Le nom du client est obligatoire.' : 'Le numéro de téléphone est obligatoire.';
    }
    if (control.hasError('telephone') || control.hasError('pattern')) {
      return 'Le téléphone doit contenir entre 8 et 15 chiffres (espaces, points et parenthèses acceptés).';
    }
    if (control.hasError('maxlength')) {
      return 'Le nom est trop long.';
    }
    return null;
  }

  erreurArticle(index: number, champ: 'type' | 'quantite' | 'service'): string | null {
    const control = this.articles.at(index)?.get(champ);
    if (!control || !control.invalid || (!control.touched && !this.soumis)) {
      return null;
    }
    if (control.hasError('required')) {
      if (champ === 'type') {
        return "Le type d'article est obligatoire.";
      }
      if (champ === 'quantite') {
        return 'La quantité est obligatoire.';
      }
      return 'Le service demandé est obligatoire.';
    }
    if (control.hasError('min') || control.hasError('pattern')) {
      return 'La quantité doit être un nombre entier supérieur ou égal à 1.';
    }
    return null;
  }

  get afficherErreurAucunArticle(): boolean {
    return this.soumis && this.articlesValides.length === 0;
  }

  erreurDateRetrait(): string | null {
    const control = this.form.get('dateRetrait');
    if (!control || control.valid || (!control.touched && !this.soumis)) {
      return null;
    }
    if (control.hasError('required')) {
      return 'La date de retrait est obligatoire.';
    }
    if (control.hasError('dateRetraitAnterieure')) {
      return 'La date de retrait ne peut pas être antérieure à la date de dépôt.';
    }
    return null;
  }

  totalEstimeValeur(): number {
    return this.articlesValides.reduce((somme, g) => {
      const qte = Number(g.value.quantite) || 0;
      return somme + this.tarifs.prix(String(g.value.type), String(g.value.service)) * qte;
    }, 0);
  }

  apercuTotal(): string {
    return formaterMontant(this.totalEstimeValeur());
  }

  apercuSolde(): string {
    const total = this.totalEstimeValeur();
    const avance = Number(this.form.get('avance')?.value) || 0;
    const solde = Math.max(0, total - avance);
    return formaterMontant(solde);
  }

  definirAvancePourcentage(pct: number): void {
    const total = this.totalEstimeValeur();
    const montant = Math.round((total * pct) / 100);
    this.form.get('avance')?.setValue(montant);
  }

  onSubmit(): void {
    this.soumis = true;
    const clientValide = this.form.get('client')!.valid;
    const dateRetraitValideForm = this.form.get('dateRetrait')!.valid;
    const articlesValides = this.articlesValides;
    if (!clientValide || !dateRetraitValideForm || articlesValides.length === 0) {
      this.form.markAllAsTouched();
      return;
    }
    const client = this.form.get('client')!.value;
    const articles = articlesValides.map((g) => ({
      type: String(g.value.type).trim(),
      quantite: Number(g.value.quantite),
      service: String(g.value.service).trim(),
    }));
    const avance = Number(this.form.get('avance')!.value) || 0;
    const depot = this.store.creerDepot({
      clientNom: client.nom.trim(),
      clientTelephone: client.telephone.trim(),
      dateRetrait: this.form.get('dateRetrait')!.value,
      articles,
      ...(avance > 0 ? { avance } : {}),
    });
    this.messageConfirmation = `Dépôt enregistré avec le ticket ${depot.ticketNumero}.`;
    this.router.navigate(['/depots', depot.id, 'ticket']);
  }

  private creerArticle(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      quantite: ['', [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
      service: ['', Validators.required],
    });
  }
}
