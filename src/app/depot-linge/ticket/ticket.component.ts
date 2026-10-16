import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NpButtonComponent } from '../../systeme-design/np-button/np-button.component';
import { NpCardComponent } from '../../systeme-design/np-card/np-card.component';
import { NpFormFieldComponent } from '../../systeme-design/np-form-field/np-form-field.component';
import { NpStatusBadgeComponent } from '../../systeme-design/np-status-badge/np-status-badge.component';
import { NpTableComponent } from '../../systeme-design/np-table/np-table.component';
import {
  dateRetraitEnIso,
  Depot,
  STATUT_LABELS,
  DepotStatut,
  jourLocal,
} from '../models/depot.model';
import { DepotStoreService } from '../services/depot-store.service';

const formateurDate = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

@Component({
  selector: 'app-ticket',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NpButtonComponent,
    NpCardComponent,
    NpFormFieldComponent,
    NpStatusBadgeComponent,
    NpTableComponent,
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css',
})
export class TicketComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(DepotStoreService);

  depot: Depot | undefined;
  readonly dateEdition = new FormControl('', { nonNullable: true });
  editionOuverte = false;
  erreurEdition: string | null = null;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.depot = this.store.getDepotById(id);
  }

  formaterDate(iso: string): string {
    return formateurDate.format(new Date(iso));
  }

  libelleStatut(statut: DepotStatut): string {
    return STATUT_LABELS[statut];
  }

  peutAvancer(): boolean {
    return !!this.depot && this.depot.statut !== 'livre';
  }

  passerAuStatutSuivant(): void {
    if (!this.depot) {
      return;
    }
    this.store.passerAuStatutSuivant(this.depot.id);
    this.depot = this.store.getDepotById(this.depot.id);
  }

  imprimer(): void {
    window.print();
  }

  ouvrirEdition(): void {
    if (!this.depot) {
      return;
    }
    this.dateEdition.setValue(jourLocal(new Date(this.depot.dateRetraitPrevue)));
    this.editionOuverte = true;
    this.erreurEdition = null;
  }

  annulerEdition(): void {
    this.editionOuverte = false;
    this.erreurEdition = null;
  }

  enregistrerDateRetrait(): void {
    if (!this.depot) {
      return;
    }
    const saisie = this.dateEdition.value;
    if (!saisie) {
      this.erreurEdition = 'La date de retrait est obligatoire.';
      return;
    }
    const nouvelleDateIso = dateRetraitEnIso(saisie, this.depot.dateDepot);
    const resultat = nouvelleDateIso
      ? this.store.modifierDateRetrait(this.depot.id, nouvelleDateIso)
      : null;
    if (!resultat) {
      this.erreurEdition =
        'La date de retrait ne peut pas être antérieure à la date de dépôt.';
      return;
    }
    this.depot = this.store.getDepotById(this.depot.id);
    this.editionOuverte = false;
    this.erreurEdition = null;
  }
}
