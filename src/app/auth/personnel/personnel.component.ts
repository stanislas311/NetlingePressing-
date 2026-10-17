import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NpButtonComponent } from '../../systeme-design/np-button/np-button.component';
import { NpCardComponent } from '../../systeme-design/np-card/np-card.component';
import { NpFormFieldComponent } from '../../systeme-design/np-form-field/np-form-field.component';
import { NpTableComponent } from '../../systeme-design/np-table/np-table.component';
import { ROLE_LABELS, RoleUtilisateur, SessionUtilisateur } from '../models/utilisateur.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-personnel',
  imports: [
    ReactiveFormsModule,
    NpButtonComponent,
    NpCardComponent,
    NpFormFieldComponent,
    NpTableComponent,
  ],
  templateUrl: './personnel.component.html',
  styleUrl: './personnel.component.css',
})
export class PersonnelComponent {
  private readonly auth = inject(AuthService);

  comptes: SessionUtilisateur[] = [];
  message: string | null = null;
  erreur: string | null = null;
  readonly labels = ROLE_LABELS;

  readonly formulaire = new FormGroup({
    identifiant: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    nom: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    role: new FormControl<RoleUtilisateur>('RECEPTIONNISTE', { nonNullable: true }),
    motDePasse: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  constructor() {
    this.rafraichir();
  }

  async creer(): Promise<void> {
    this.erreur = null;
    this.message = null;
    if (this.formulaire.invalid) {
      this.erreur = 'Tous les champs sont obligatoires. Le mot de passe doit contenir au moins 8 caractères.';
      return;
    }
    const { identifiant, nom, role, motDePasse } = this.formulaire.getRawValue();
    const cree = await this.auth.creerCompte(identifiant, nom, role, motDePasse);
    if (!cree) {
      this.erreur = 'Impossible de créer ce compte (identifiant déjà utilisé ou droits insuffisants).';
      return;
    }
    this.message = `Le compte ${cree.identifiant} a été créé.`;
    this.formulaire.reset({
      identifiant: '',
      nom: '',
      role: 'RECEPTIONNISTE',
      motDePasse: '',
    });
    this.rafraichir();
  }

  private rafraichir(): void {
    this.comptes = this.auth.listerComptes();
  }
}
