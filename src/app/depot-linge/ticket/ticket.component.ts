import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
  imports: [RouterLink, ReactiveFormsModule],
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
