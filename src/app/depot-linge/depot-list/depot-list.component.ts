import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { startWith } from 'rxjs';
import { NpButtonComponent } from '../../systeme-design/np-button/np-button.component';
import { NpFormFieldComponent } from '../../systeme-design/np-form-field/np-form-field.component';
import { NpStatusBadgeComponent } from '../../systeme-design/np-status-badge/np-status-badge.component';
import { NpTableComponent } from '../../systeme-design/np-table/np-table.component';
import {
  dateRetraitEnIso,
  Depot,
  DepotArticle,
  DepotStatut,
  jourLocal,
  depotVerrouille,
  formaterMontant,
  soldeRestant,
  STATUTS_FILTRE,
  STATUT_LABELS,
} from '../models/depot.model';
import { DepotStoreService } from '../services/depot-store.service';

@Component({
  selector: 'app-depot-list',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NpButtonComponent,
    NpFormFieldComponent,
    NpStatusBadgeComponent,
    NpTableComponent,
  ],
  templateUrl: './depot-list.component.html',
  styleUrl: './depot-list.component.css',
})
export class DepotListComponent {
  private readonly store = inject(DepotStoreService);

  readonly recherche = new FormControl('', { nonNullable: true });
  readonly filtreStatut = new FormControl<DepotStatut | ''>('', { nonNullable: true });
  readonly dateEdition = new FormControl('', { nonNullable: true });
  readonly statutsDisponibles = STATUTS_FILTRE;
  readonly labelsStatuts = STATUT_LABELS;
  depots: Depot[] = [];
  depotEnEdition: string | null = null;
  erreurEdition: string | null = null;

  constructor() {
    const majListe = () => {
      this.depots = this.store.rechercherDepots(
        this.recherche.value,
        this.filtreStatut.value || undefined
      );
    };
    this.recherche.valueChanges.pipe(startWith('')).subscribe(majListe);
    this.filtreStatut.valueChanges.pipe(startWith('')).subscribe(majListe);
  }

  libelleStatut(depot: Depot): string {
    return STATUT_LABELS[depot.statut];
  }

  peutAvancer(depot: Depot): boolean {
    return !depotVerrouille(depot.statut);
  }

  solde(depot: Depot): string {
    return formaterMontant(soldeRestant(depot));
  }

  passerAuStatutSuivant(depot: Depot): void {
    const resultat = this.store.passerAuStatutSuivant(depot.id);
    if (!resultat) {
      this.erreurEdition =
        'Le dépôt ne peut pas être livré tant que le solde n’est pas soldé.';
    }
    this.depots = this.store.rechercherDepots(
      this.recherche.value,
      this.filtreStatut.value || undefined
    );
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
    this.depots = this.store.rechercherDepots(
      this.recherche.value,
      this.filtreStatut.value || undefined
    );
  }
}
