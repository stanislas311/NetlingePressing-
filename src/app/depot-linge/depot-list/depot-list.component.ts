import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { startWith } from 'rxjs';
import {
  dateRetraitEnIso,
  Depot,
  DepotArticle,
  jourLocal,
  STATUT_LABELS,
} from '../models/depot.model';
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
  readonly dateEdition = new FormControl('', { nonNullable: true });
  depots: Depot[] = [];
  depotEnEdition: string | null = null;
  erreurEdition: string | null = null;

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

  ouvrirEdition(depot: Depot): void {
    this.depotEnEdition = depot.id;
    this.dateEdition.setValue(jourLocal(new Date(depot.dateRetraitPrevue)));
    this.erreurEdition = null;
  }

  annulerEdition(): void {
    this.depotEnEdition = null;
    this.erreurEdition = null;
  }

  confirmerEdition(depot: Depot): void {
    const saisie = this.dateEdition.value;
    if (!saisie) {
      this.erreurEdition = 'La date de retrait est obligatoire.';
      return;
    }
    const nouvelleDateIso = dateRetraitEnIso(saisie, depot.dateDepot);
    const resultat = nouvelleDateIso
      ? this.store.modifierDateRetrait(depot.id, nouvelleDateIso)
      : null;
    if (!resultat) {
      this.erreurEdition =
        'La date de retrait ne peut pas être antérieure à la date de dépôt.';
      return;
    }
    this.depotEnEdition = null;
    this.erreurEdition = null;
    this.depots = this.store.rechercherDepots(this.recherche.value);
  }
}
