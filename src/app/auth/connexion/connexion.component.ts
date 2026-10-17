import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NpButtonComponent } from '../../systeme-design/np-button/np-button.component';
import { NpCardComponent } from '../../systeme-design/np-card/np-card.component';
import { NpFormFieldComponent } from '../../systeme-design/np-form-field/np-form-field.component';
import { AuthService } from '../services/auth.service';
import { COMPTES_DEMO } from '../models/utilisateur.model';

@Component({
  selector: 'app-connexion',
  imports: [ReactiveFormsModule, RouterLink, NpButtonComponent, NpCardComponent, NpFormFieldComponent],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css',
})
export class ConnexionComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  erreur: string | null = null;
  enCours = false;

  readonly formulaire = new FormGroup({
    identifiant: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    motDePasse: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  remplirDemo(role: 'gerant' | 'reception'): void {
    if (role === 'gerant') {
      this.formulaire.setValue({
        identifiant: COMPTES_DEMO.gerant.identifiant,
        motDePasse: COMPTES_DEMO.gerant.motDePasse,
      });
    } else {
      this.formulaire.setValue({
        identifiant: COMPTES_DEMO.receptionniste.identifiant,
        motDePasse: COMPTES_DEMO.receptionniste.motDePasse,
      });
    }
    this.erreur = null;
  }

  async soumettre(): Promise<void> {
    this.erreur = null;
    if (this.formulaire.invalid) {
      this.erreur = 'Saisissez votre identifiant et votre mot de passe.';
      return;
    }
    this.enCours = true;
    const { identifiant, motDePasse } = this.formulaire.getRawValue();
    const ok = await this.auth.connecter(identifiant, motDePasse);
    this.enCours = false;
    if (!ok) {
      this.erreur = 'Identifiant ou mot de passe incorrect.';
      return;
    }
    await this.router.navigateByUrl('/depots');
  }
}
