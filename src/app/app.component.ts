import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './auth/services/auth.service';
import { ROLE_LABELS } from './auth/models/utilisateur.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly labelsRole = ROLE_LABELS;
  title = 'Netlinge Pressing';
  pagePublique = true;
  menuOuvert = false;

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url.split('?')[0];
        this.pagePublique = url === '/' || url === '/connexion';
        this.menuOuvert = false;
      });
  }

  get afficherNavigation(): boolean {
    return this.auth.estConnecte();
  }

  libelleRole(): string {
    const utilisateur = this.auth.utilisateurCourant();
    return utilisateur ? this.labelsRole[utilisateur.role] : '';
  }

  basculerMenu(): void {
    this.menuOuvert = !this.menuOuvert;
  }

  fermerMenu(): void {
    this.menuOuvert = false;
  }

  deconnecter(): void {
    this.auth.deconnecter();
    this.menuOuvert = false;
    void this.router.navigateByUrl('/');
  }
}
