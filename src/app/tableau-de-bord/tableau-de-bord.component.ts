import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NpCardComponent } from '../systeme-design/np-card/np-card.component';
import { NpStatusBadgeComponent } from '../systeme-design/np-status-badge/np-status-badge.component';
import { AuthService } from '../auth/services/auth.service';
import {
  Depot,
  depotVerrouille,
  formaterMontant,
  jourLocal,
  STATUT_LABELS,
  STATUTS_FILTRE,
} from '../depot-linge/models/depot.model';
import { DepotStoreService } from '../depot-linge/services/depot-store.service';
import { NotificationService } from '../notifications/services/notification.service';

@Component({
  selector: 'app-tableau-de-bord',
  imports: [RouterLink, NpCardComponent, NpStatusBadgeComponent],
  templateUrl: './tableau-de-bord.component.html',
  styleUrl: './tableau-de-bord.component.css',
})
export class TableauDeBordComponent {
  private readonly store = inject(DepotStoreService);
  readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  readonly labels = STATUT_LABELS;
  readonly depots: Depot[];
  readonly aujourdHui = jourLocal(new Date());

  constructor() {
    this.depots = this.store.listerDepots();
    this.notifications.synchroniserRetards(this.depots);
  }

  get depotsDuJour(): Depot[] {
    return this.depots.filter((d) => jourLocal(new Date(d.dateDepot)) === this.aujourdHui);
  }

  get prets(): Depot[] {
    return this.depots.filter((d) => d.statut === 'pret');
  }

  get retards(): Depot[] {
    const maintenant = Date.now();
    return this.depots.filter(
      (d) => !depotVerrouille(d.statut) && new Date(d.dateRetraitPrevue).getTime() < maintenant
    );
  }

  get chiffreAffairesJour(): string {
    let total = 0;
    for (const depot of this.depots) {
      for (const paiement of depot.paiements ?? []) {
        if (jourLocal(new Date(paiement.date)) === this.aujourdHui) {
          total += paiement.montant;
        }
      }
    }
    return formaterMontant(total);
  }

  repartition(): { statut: string; libelle: string; nombre: number }[] {
    return STATUTS_FILTRE.map((statut) => ({
      statut,
      libelle: STATUT_LABELS[statut],
      nombre: this.depots.filter((d) => d.statut === statut).length,
    }));
  }
}
