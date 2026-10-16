import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-introuvable',
  imports: [RouterLink],
  template: `
    <section class="vide">
      <h1>Page introuvable</h1>
      <p>Cette adresse n'existe pas dans Netlinge Pressing.</p>
      <a routerLink="/" class="np-bouton np-bouton--principal">Retour à l'accueil</a>
    </section>
  `,
  styles: `
    .vide {
      max-width: 32rem;
      margin: 3rem auto;
      text-align: center;
    }
  `,
})
export class PageIntrouvableComponent {}
