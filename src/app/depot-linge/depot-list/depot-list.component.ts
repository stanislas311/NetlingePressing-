import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { startWith } from 'rxjs';
import { Depot, DepotArticle, STATUT_LABELS } from '../models/depot.model';
import { DepotStoreService } from '../services/depot-store.service';

@Component({
  selector: 'app-depot-list',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './depot-list.component.html',
  styleUrl: './depot-list.component.css',
})
export class DepotListComponent {
  private readonly store = inject(DepotStoreService);

  readonly recherche = new FormControl('', { nonNullable: true });
  depots: Depot[] = [];

  constructor() {
    this.recherche.valueChanges.pipe(startWith('')).subscribe((requete) => {
      this.depots = this.store.rechercherDepots(requete);
    });
  }

  libelleStatut(depot: Depot): string {
    return STATUT_LABELS[depot.statut];
  }

  formaterDate(iso: string): string {
    return new Date(iso).toLocaleDateString('fr-FR');
  }

  formaterArticles(articles: DepotArticle[]): string {
    return articles.map((a) => `${a.quantite} x ${a.type} (${a.service})`).join(', ');
  }
}
