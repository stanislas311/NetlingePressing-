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
  readonly montantPaiementRapide = new FormControl(0, { nonNullable: true });
  readonly statutsDisponibles = STATUTS_FILTRE;
  readonly labelsStatuts = STATUT_LABELS;
  depots: Depot[] = [];
  depotEnEdition: string | null = null;
  depotEnPaiement: string | null = null;
  erreurEdition: string | null = null;
  erreurLivraison: string | null = null;
  messageSucces: string | null = null;

  vueArchives = false;
  nombreArchives = 0;

  constructor() {
    const majListe = () => {
      this.actualiserListe();
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

  soldeRestantValeur(depot: Depot): number {
    return soldeRestant(depot);
  }

  estSolde(depot: Depot): boolean {
    return soldeRestant(depot) === 0;
  }

  basculerVueArchives(): void {
    this.vueArchives = !this.vueArchives;
    this.actualiserListe();
  }

  archiverDepot(depot: Depot): void {
    const misAJour = this.store.archiverDepot(depot.id);
    if (misAJour) {
      this.messageSucces = `Le ticket ${depot.ticketNumero} a été placé dans les archives.`;
      this.actualiserListe();
    }
  }

  desarchiverDepot(depot: Depot): void {
    const misAJour = this.store.desarchiverDepot(depot.id);
    if (misAJour) {
      this.messageSucces = `Le ticket ${depot.ticketNumero} a été restauré des archives.`;
      this.actualiserListe();
    }
  }

  supprimerDepot(depot: Depot): void {
    const confirmation = window.confirm(
      `Confirmez-vous la suppression définitive du dépôt ${depot.ticketNumero} de ${depot.clientNom} ?`
    );
    if (confirmation) {
      this.store.supprimerDepot(depot.id);
      this.messageSucces = `Le dépôt ${depot.ticketNumero} a été définitivement supprimé.`;
      this.actualiserListe();
    }
  }

  passerAuStatutSuivant(depot: Depot): void {
    this.erreurLivraison = null;
    const resultat = this.store.passerAuStatutSuivant(depot.id);
    if (!resultat) {
      this.erreurEdition =
        'Le dépôt ne peut pas être livré tant que le solde n’est pas soldé.';
      this.erreurLivraison =
        `Le ticket ${depot.ticketNumero} ne peut pas être livré : le solde restant (${this.solde(depot)}) doit être intégralement réglé.`;
    } else {
      this.erreurEdition = null;
      this.messageSucces = `Statut mis à jour pour le ticket ${depot.ticketNumero} : ${STATUT_LABELS[resultat.statut]}.`;
    }
    this.actualiserListe();
  }

  solderEtLivrer(depot: Depot): void {
    const restant = soldeRestant(depot);
    if (restant > 0) {
      this.store.enregistrerPaiement(depot.id, restant);
    }
    const livre = this.store.passerAuStatutSuivant(depot.id);
    if (livre) {
      this.erreurLivraison = null;
      this.erreurEdition = null;
      this.messageSucces = `Le ticket ${depot.ticketNumero} a été soldé (${formaterMontant(restant)}) et marqué comme Livré !`;
    }
    this.actualiserListe();
  }

  ouvrirPaiement(depot: Depot): void {
    this.depotEnPaiement = depot.id;
    this.montantPaiementRapide.setValue(soldeRestant(depot));
  }

  annulerPaiement(): void {
    this.depotEnPaiement = null;
  }

  confirmerPaiement(depot: Depot): void {
    const montant = Number(this.montantPaiementRapide.value);
    const resultat = this.store.enregistrerPaiement(depot.id, montant);
    if (resultat) {
      this.messageSucces = `Paiement de ${formaterMontant(montant)} enregistré pour le ticket ${depot.ticketNumero}.`;
      this.depotEnPaiement = null;
      this.actualiserListe();
    }
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
    this.messageSucces = `Date de retrait modifiée pour le ticket ${depot.ticketNumero}.`;
    this.actualiserListe();
  }

  actualiserListe(): void {
    const tous = this.store.rechercherDepots(
      this.recherche.value,
      this.filtreStatut.value || undefined
    );
    this.nombreArchives = tous.filter((d) => !!d.archive).length;

    // Dépôts récents en haut : tri décroissant sur la date de dépôt
    const tries = [...tous].sort((a, b) => {
      const tempsA = new Date(a.dateDepot).getTime();
      const tempsB = new Date(b.dateDepot).getTime();
      if (tempsA !== tempsB) {
        return tempsB - tempsA;
      }
      return b.ticketNumero.localeCompare(a.ticketNumero);
    });

    if (this.vueArchives) {
      this.depots = tries.filter((d) => !!d.archive);
    } else {
      this.depots = tries.filter((d) => !d.archive);
    }
  }
}
